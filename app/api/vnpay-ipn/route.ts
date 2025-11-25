import { verifyVNPayReturn } from '@/actions/createVNPayPayment';
import { updateOrderStatus } from '@/sanity/helpers/orders';
import { NextRequest, NextResponse } from 'next/server';
import { ReturnQueryFromVNPay } from 'vnpay';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Verify signature
    const verify = await verifyVNPayReturn(params as unknown as ReturnQueryFromVNPay);

    if (!verify.isSuccess) {
      return NextResponse.json(
        { RspCode: '97', Message: 'Invalid Checksum' },
        { status: 200 }
      );
    }

    // Check transaction status
    const responseCode = params['vnp_ResponseCode'];
    const orderId = params['vnp_TxnRef'];

    if (responseCode === '00') {
      // Payment successful
      if (orderId) {
        console.log(`IPN: Updating order ${orderId} to paid`);
        await updateOrderStatus(orderId, 'paid');
      }
      return NextResponse.json(
        { RspCode: '00', Message: 'Confirm Success' },
        { status: 200 }
      );
    } else {
      // Payment failed
      console.log(`IPN: Payment failed for order ${orderId} with code ${responseCode}`);
      // Optionally update order status to 'failed' if you have that status
      return NextResponse.json(
        { RspCode: '00', Message: 'Confirm Success' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('IPN Error:', error);
    return NextResponse.json(
      { RspCode: '99', Message: 'Unknown Error' },
      { status: 200 }
    );
  }
}
