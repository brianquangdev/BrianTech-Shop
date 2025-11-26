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

    // Find the order by orderNumber (which is passed as orderId from MoMo)
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]`,
      { orderNumber: orderId }
    );

    if (!order) {
      console.error(`Order with number ${orderId} not found`);
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status trong Sanity using the real _id
    if (resultCode === 0) {
      // Payment successful
      await client
        .patch(order._id)
        .set({
          paymentStatus: 'success',
          transactionId: transId.toString(),
          status: 'paid',
        })
        .commit();

      console.log(`Order ${orderId} payment successful`);
    } else {
      // Payment failed
      await client
        .patch(order._id)
        .set({
          paymentStatus: 'failed',
          transactionId: transId.toString(),
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
