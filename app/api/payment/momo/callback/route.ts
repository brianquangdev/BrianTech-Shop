import { momoPayment } from '@/lib/momo';
import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify signature từ MoMo
    const isValid = momoPayment.verifyIPN(body);

    if (!isValid) {
      console.error('Invalid MoMo signature');
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 400 }
      );
    }

    const { orderId, resultCode, transId } = body;

    // Update order status trong Sanity
    if (resultCode === 0) {
      // Payment successful
      await client
        .patch(orderId)
        .set({
          paymentStatus: 'success',
          transactionId: transId,
          status: 'paid',
        })
        .commit();

      console.log(`Order ${orderId} payment successful`);
    } else {
      // Payment failed
      await client
        .patch(orderId)
        .set({
          paymentStatus: 'failed',
          transactionId: transId,
        })
        .commit();

      console.log(`Order ${orderId} payment failed with code ${resultCode}`);
    }

    // Return success response to MoMo
    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('MoMo IPN error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
