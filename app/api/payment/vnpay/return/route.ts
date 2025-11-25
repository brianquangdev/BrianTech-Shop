import { vnpayPayment } from '@/lib/vnpay';
import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const vnpParams: Record<string, string | number> = {};

    // Convert search params to object
    searchParams.forEach((value, key) => {
      vnpParams[key] = value;
    });

    // Verify signature và get result
    const { isValid, resultCode, message } =
      vnpayPayment.verifyReturnUrl(vnpParams);

    if (!isValid) {
      console.error('Invalid VNPay signature');
      return NextResponse.redirect(
        new URL('/payment/failure?error=invalid_signature', req.url)
      );
    }

    const orderId = vnpParams.vnp_TxnRef as string;
    const transactionId = vnpParams.vnp_TransactionNo as string;

    // Update order status trong Sanity
    if (resultCode === '00') {
      // Payment successful
      await client
        .patch(orderId)
        .set({
          paymentStatus: 'success',
          transactionId: transactionId,
          status: 'paid',
        })
        .commit();

      console.log(`Order ${orderId} payment successful`);

      return NextResponse.redirect(
        new URL(`/payment/success?orderId=${orderId}`, req.url)
      );
    } else {
      // Payment failed or cancelled
      const paymentStatus = resultCode === '24' ? 'cancelled' : 'failed';

      await client
        .patch(orderId)
        .set({
          paymentStatus,
          transactionId: transactionId,
        })
        .commit();

      console.log(`Order ${orderId} payment ${paymentStatus}: ${message}`);

      return NextResponse.redirect(
        new URL(
          `/payment/failure?orderId=${orderId}&code=${resultCode}&message=${encodeURIComponent(message)}`,
          req.url
        )
      );
    }
  } catch (error) {
    console.error('VNPay return URL error:', error);
    return NextResponse.redirect(
      new URL('/payment/failure?error=server_error', req.url)
    );
  }
}
