'use server';

import { momoPayment } from '@/lib/momo';
import { Address, Product } from '@/sanity.types';

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address: Address | null;
}

export interface GroupedCartItem {
  product: Product;
}

export async function createMoMoPayment(
  items: GroupedCartItem[],
  metadata: Metadata
): Promise<string | null> {
  try {
    // Tính tổng tiền
    const totalAmount = items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price;
    }, 0);

    // Tạo unique IDs
    const orderId = metadata.orderNumber;
    const requestId = `${orderId}_${Date.now()}`;

    // Tạo order info
    const orderInfo = `Thanh toán đơn hàng ${orderId}`;

    // URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/api/payment/momo/return`;
    const notifyUrl = `${baseUrl}/api/payment/momo/callback`;

    // Tạo extra data (lưu metadata)
    const extraData = Buffer.from(
      JSON.stringify({
        items: items.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
        })),
        metadata,
      })
    ).toString('base64');

    // Debug: Check credentials
    console.log('MoMo Config Check:', {
      hasPartnerCode: !!process.env.MOMO_PARTNER_CODE,
      hasAccessKey: !!process.env.MOMO_ACCESS_KEY,
      hasSecretKey: !!process.env.MOMO_SECRET_KEY,
      endpoint: process.env.MOMO_ENDPOINT,
    });

    console.log('MoMo Payment Request:', {
      orderInfo,
      amount: totalAmount,
      orderId,
      requestId,
    });

    // Gọi MoMo API
    const response = await momoPayment.createPaymentUrl({
      orderInfo,
      amount: totalAmount,
      orderId,
      requestId,
      returnUrl,
      notifyUrl,
      extraData,
    });

    console.log('MoMo Response:', response);

    if (response.resultCode === 0 && response.payUrl) {
      return response.payUrl;
    } else {
      console.error('MoMo payment creation failed:', response.message);
      return null;
    }
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return null;
  }
}
