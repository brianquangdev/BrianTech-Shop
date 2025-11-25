import crypto from 'crypto';

export interface MoMoConfig {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  endpoint: string;
}

export interface MoMoPaymentRequest {
  orderInfo: string;
  amount: number;
  orderId: string;
  requestId: string;
  returnUrl: string;
  notifyUrl: string;
  extraData?: string;
}

export interface MoMoPaymentResponse {
  payUrl?: string;
  message?: string;
  resultCode?: number;
}

export class MoMoPayment {
  private config: MoMoConfig;

  constructor(config: MoMoConfig) {
    this.config = config;
  }

  /**
   * Tạo chữ ký HMAC SHA256 cho request
   */
  private createSignature(rawData: string): string {
    return crypto
      .createHmac('sha256', this.config.secretKey)
      .update(rawData)
      .digest('hex');
  }

  /**
   * Tạo payment URL để redirect user đến MoMo gateway
   */
  async createPaymentUrl(
    request: MoMoPaymentRequest
  ): Promise<MoMoPaymentResponse> {
    const {
      orderInfo,
      amount,
      orderId,
      requestId,
      returnUrl,
      notifyUrl,
      extraData = '',
    } = request;

    const requestType = 'captureWallet';
    const redirectUrl = returnUrl;
    const ipnUrl = notifyUrl;

    // Tạo raw signature theo thứ tự alphabet của MoMo
    const rawSignature = `accessKey=${this.config.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.config.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = this.createSignature(rawSignature);

    const requestBody = {
      partnerCode: this.config.partnerCode,
      accessKey: this.config.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: 'vi',
    };

    try {
      const response = await fetch(
        `${this.config.endpoint}/v2/gateway/api/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.resultCode === 0) {
        return {
          payUrl: data.payUrl,
          message: 'Success',
          resultCode: 0,
        };
      } else {
        return {
          message: data.message || 'Payment creation failed',
          resultCode: data.resultCode,
        };
      }
    } catch (error) {
      console.error('MoMo API Error:', error);
      return {
        message: 'Network error',
        resultCode: -1,
      };
    }
  }

  /**
   * Verify IPN callback từ MoMo
   */
  verifyIPN(data: Record<string, string | number>): boolean {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = data;

    // Tạo raw signature để verify
    const rawSignature = `accessKey=${this.config.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = this.createSignature(rawSignature);

    return signature === expectedSignature;
  }

  /**
   * Verify return URL từ MoMo
   */
  verifyReturnUrl(data: Record<string, string | number>): boolean {
    return this.verifyIPN(data);
  }
}

// Export singleton instance với test credentials
export const momoPayment = new MoMoPayment({
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  accessKey: process.env.MOMO_ACCESS_KEY || '',
  secretKey: process.env.MOMO_SECRET_KEY || '',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn',
});
