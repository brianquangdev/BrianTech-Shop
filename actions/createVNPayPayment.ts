'use server';

import { vnpayPayment } from '@/lib/vnpay';
import { Address, Product } from '@/sanity.types';
import { headers } from 'next/headers';

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
    // Tính tổng tiền
    const totalAmount = items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price;
    }, 0);

    // Tạo order ID
    const orderId = metadata.orderNumber;

    // Lấy IP address từ headers
    const headersList = await headers();
    const ipAddr =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      '127.0.0.1';

    // Lưu metadata vào session storage hoặc database
    // Tạm thời encode vào orderInfo (giới hạn 255 ký tự)
    const shortOrderInfo = `DH ${orderId} - ${metadata.customerName}`;

    // Debug: Check credentials
    console.log('VNPay Config Check:', {
      hasTmnCode: !!process.env.VNPAY_TMN_CODE,
      hasHashSecret: !!process.env.VNPAY_HASH_SECRET,
      url: process.env.VNPAY_URL,
    });

    console.log('VNPay Payment Request:', {
      amount: totalAmount,
      orderInfo: shortOrderInfo,
      orderId,
      ipAddr: ipAddr.split(',')[0].trim(),
    });

    // Tạo payment URL
    const paymentUrl = vnpayPayment.createPaymentUrl({
      amount: totalAmount,
      orderInfo: shortOrderInfo,
      orderId,
      ipAddr: ipAddr.split(',')[0].trim(), // Lấy IP đầu tiên nếu có nhiều
    });

    console.log('VNPay Payment URL created:', paymentUrl.substring(0, 100) + '...');

    return paymentUrl;
  } catch (error) {
    console.error('Error creating VNPay payment:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return null;
  }
}
