import crypto from 'crypto';

export interface VNPayConfig {
  tmnCode: string;
  hashSecret: string;
  url: string;
  returnUrl: string;
}

export interface VNPayPaymentRequest {
  amount: number;
  orderInfo: string;
  orderId: string;
  ipAddr: string;
  bankCode?: string;
}

export class VNPayPayment {
  private config: VNPayConfig;

  constructor(config: VNPayConfig) {
    this.config = config;
  }

  /**
   * Tạo chữ ký HMAC SHA512 cho VNPay
   */
  private createSignature(data: string): string {
    return crypto
      .createHmac('sha512', this.config.hashSecret)
      .update(Buffer.from(data, 'utf-8'))
      .digest('hex');
  }

  /**
   * Sort object theo alphabet (yêu cầu của VNPay)
   */
  private sortObject(
    obj: Record<string, string | number>
  ): Record<string, string | number> {
    const sorted: Record<string, string | number> = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  /**
   * Tạo payment URL để redirect user đến VNPay gateway
   */
  createPaymentUrl(request: VNPayPaymentRequest): string {
    const { amount, orderInfo, orderId, ipAddr, bankCode = '' } = request;

    const createDate = this.formatDate(new Date());
    const expireDate = this.formatDate(new Date(Date.now() + 15 * 60 * 1000)); // 15 phút

    let vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.tmnCode,
      vnp_Amount: amount * 100, // VNPay yêu cầu amount * 100
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    // Sort params theo alphabet
    vnpParams = this.sortObject(vnpParams);

    // Tạo query string WITHOUT URL encoding (VNPay yêu cầu)
    const paramPairs: string[] = [];
    Object.keys(vnpParams).forEach((key) => {
      paramPairs.push(`${key}=${vnpParams[key]}`);
    });
    const signData = paramPairs.join('&');
    const signature = this.createSignature(signData);

    // Thêm signature vào params
    vnpParams.vnp_SecureHash = signature;

    // Build final URL manually (không dùng querystring.stringify để tránh encoding)
    const finalParamPairs: string[] = [];
    Object.keys(vnpParams).forEach((key) => {
      finalParamPairs.push(`${key}=${vnpParams[key]}`);
    });
    const paymentUrl = `${this.config.url}?${finalParamPairs.join('&')}`;

    return paymentUrl;
  }

  /**
   * Verify IPN callback hoặc return URL từ VNPay
   */
  verifyReturnUrl(vnpParams: Record<string, string | number>): {
    isValid: boolean;
    resultCode: string;
    message: string;
  } {
    const secureHash = vnpParams.vnp_SecureHash as string;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Sort params
    const sortedParams = this.sortObject(vnpParams);
    
    // Build query string manually WITHOUT encoding
    const paramPairs: string[] = [];
    Object.keys(sortedParams).forEach((key) => {
      paramPairs.push(`${key}=${sortedParams[key]}`);
    });
    const signData = paramPairs.join('&');
    const signature = this.createSignature(signData);

    const isValid = secureHash === signature;
    const resultCode = String(vnpParams.vnp_ResponseCode || '99');

    let message = 'Unknown error';
    if (resultCode === '00') {
      message = 'Transaction successful';
    } else if (resultCode === '24') {
      message = 'Transaction cancelled by user';
    } else if (resultCode === '07') {
      message = 'Transaction suspicious (fraud)';
    } else {
      message = `Transaction failed with code: ${resultCode}`;
    }

    return {
      isValid,
      resultCode,
      message,
    };
  }

  /**
   * Format date theo yêu cầu của VNPay: yyyyMMddHHmmss
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}

// Export singleton instance với test credentials
export const vnpayPayment = new VNPayPayment({
  tmnCode: process.env.VNPAY_TMN_CODE || '',
  hashSecret: process.env.VNPAY_HASH_SECRET || '',
  url:
    process.env.VNPAY_URL ||
    'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/vnpay/return`,
});
