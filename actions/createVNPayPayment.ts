'use server';

import { vnpay } from '@/lib/vnpay';
import { Address, Product } from '@/sanity.types';
import { ReturnQueryFromVNPay, ProductCode, VnpLocale } from 'vnpay';

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

export async function createVNPayPayment(
  items: GroupedCartItem[],
  metadata: Metadata
): Promise<string | null> {
  try {
    console.log("Starting createVNPayPayment with metadata:", JSON.stringify(metadata, null, 2));
    // Create order in Sanity first
    await createOrder(items, metadata);
    console.log("Order created successfully");

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price;
    }, 0);

    const orderId = metadata.orderNumber;
    const orderInfo = `Thanh toan don hang ${orderId}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/payment/vnpay-return`;

    // Generate payment URL
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalAmount,
      vnp_IpAddr: '127.0.0.1', // Should be real IP in production
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other' as ProductCode,
      vnp_Locale: 'vn' as VnpLocale,
    });

    console.log('VNPay Payment URL:', paymentUrl);

    return paymentUrl;
  } catch (error) {
    console.error('Error creating VNPay payment:', error);
    return null;
  }
}

export async function verifyVNPayReturn(query: ReturnQueryFromVNPay) {
  try {
    const verify = vnpay.verifyReturnUrl(query);
    return verify;
  } catch (error) {
    console.error('Error verifying VNPay return:', error);
    return { isSuccess: false, message: 'Verification failed' };
  }
}
