'use server';

import { vnpay } from '@/lib/vnpay';
import { Address, Product } from '@/sanity.types';
import { ReturnQueryFromVNPay, ProductCode, VnpLocale } from 'vnpay';
import { headers } from 'next/headers';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

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

/**
 * Secure Write Client - Only used on server-side
 * Uses SANITY_API_TOKEN with write permissions
 */
function getWriteClient() {
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    throw new Error(
      'SANITY_API_TOKEN is not set! Write operations will fail.\n' +
        'Please create a token with Editor or Developer permissions in your Sanity dashboard.'
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Never use CDN for write operations
    token,
  });
}

/**
 * Get real client IP address from request headers
 * Supports Vercel, Cloudflare, and other proxies
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();

  // Try multiple headers in order of preference
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const cfConnectingIp = headersList.get('cf-connecting-ip');

  // x-forwarded-for can contain multiple IPs, take the first one
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    return ips[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback IP for development/testing
  return '127.0.0.1';
}

export async function createVNPayPayment(
  items: GroupedCartItem[],
  metadata: Metadata
): Promise<string | null> {
  try {
    console.log(
      'Starting createVNPayPayment with metadata:',
      JSON.stringify(metadata, null, 2)
    );

    // Create order in Sanity first
    await createOrder(items, {
      ...metadata,
      paymentMethod: 'vnpay',
    });
    console.log('Order created successfully');

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price;
    }, 0);

    const orderId = metadata.orderNumber;
    const orderInfo = `Thanh toan don hang ${orderId}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brian-tech-shop.vercel.app';
    const returnUrl = `${baseUrl}/payment/vnpay-return`;

    // Get real client IP address
    const clientIp = await getClientIp();
    console.log('Client IP:', clientIp);

    // Generate payment URL
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalAmount,
      vnp_IpAddr: clientIp, // Use real client IP
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

/**
 * Verify VNPay return and update order status
 * This function is called from the VNPay IPN callback
 */
export async function verifyVNPayReturn(query: ReturnQueryFromVNPay) {
  try {
    // Verify signature
    const verify = vnpay.verifyReturnUrl(query);

    if (!verify.isSuccess) {
      console.error('VNPay signature verification failed');
      return verify;
    }

    // Extract order info from query
    const responseCode = query.vnp_ResponseCode;
    const orderNumber = query.vnp_TxnRef;
    const transactionNo = query.vnp_TransactionNo;

    console.log(
      `VNPay verification success for order ${orderNumber}, response code: ${responseCode}`
    );

    // If payment successful (response code 00), update order status
    if (responseCode === '00' && orderNumber) {
      try {
        const writeClient = getWriteClient();

        // Find order by orderNumber
        const order = await writeClient.fetch(
          `*[_type == "order" && orderNumber == $orderNumber][0]`,
          { orderNumber }
        );

        if (!order) {
          console.error(`Order ${orderNumber} not found in Sanity`);
          return {
            ...verify,
            orderUpdateSuccess: false,
            message: 'Order not found',
          };
        }

        // Update only payment status to 'paid'
        // Keep order status as 'pending' for admin to manually confirm after shipping
        const updatedOrder = {
          ...order,
          paymentStatus: 'paid', // Payment confirmed by VNPay
          // status remains 'pending' - admin will update to 'paid' after shipping
          vnpayTransactionNo: transactionNo,
          paidAt: new Date().toISOString(),
          _type: 'order',
        };

        await writeClient.createOrReplace(updatedOrder);

        console.log(`✅ Order ${orderNumber} payment confirmed. Status remains 'pending' for admin confirmation.`);

        return {
          ...verify,
          orderUpdateSuccess: true,
          orderNumber,
        };
      } catch (updateError) {
        console.error('Error updating order status:', updateError);
        return {
          ...verify,
          orderUpdateSuccess: false,
          error: updateError,
        };
      }
    }

    // Payment failed or other status
    return verify;
  } catch (error) {
    console.error('Error verifying VNPay return:', error);
    return { isSuccess: false, message: 'Verification failed' };
  }
}
