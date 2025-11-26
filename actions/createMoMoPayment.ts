'use server';

import { momoPayment } from '@/lib/momo';
import { Address, Product } from '@/sanity.types';
import { createOrder } from '@/sanity/helpers/orders';

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
): Promise<{ url: string | null; error?: string }> {
  try {
    // 1. Create order in Sanity first
    console.log(
      'Starting createMoMoPayment with metadata:',
      JSON.stringify(metadata, null, 2)
    );
    await createOrder(
      items.map((item) => ({ product: item.product })),
      {
        ...metadata,
        paymentMethod: 'momo',
      }
    );
    console.log('Order created successfully');

    // 2. Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price;
    }, 0);

    // 3. Use orderNumber as the unique Order ID for MoMo
    const orderId = metadata.orderNumber;
    const requestId = `${orderId}_${Date.now()}`;

    // 4. Create order info
    const orderInfo = `Thanh toan don hang ${orderId}`;

    // 5. URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brian-tech-shop.vercel.app';
    const returnUrl = `${baseUrl}/api/payment/momo/return`;
    const notifyUrl = `${baseUrl}/api/payment/momo/callback`;

    // 6. Create extra data
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

    // 7. Call MoMo API
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
      return { url: response.payUrl };
    } else {
      console.error('MoMo payment creation failed:', response.message);
      return {
        url: null,
        error: response.message || 'Payment creation failed',
      };
    }
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
      errorMessage = error.message;
    }
    return { url: null, error: errorMessage };
  }
}
