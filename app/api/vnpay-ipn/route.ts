import { verifyVNPayReturn } from '@/actions/createVNPayPayment';
import { NextRequest, NextResponse } from 'next/server';
import { ReturnQueryFromVNPay } from 'vnpay';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};
    
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log('VNPay IPN received:', params);

    // Verify signature and update order status
    // The verifyVNPayReturn function now handles both verification and order update
    const result = await verifyVNPayReturn(params as unknown as ReturnQueryFromVNPay);

    if (!result.isSuccess) {
      console.error('VNPay IPN: Invalid signature');
      return NextResponse.json(
        { RspCode: '97', Message: 'Invalid Checksum' },
        { status: 200 }
      );
    }

    // Check if order was updated successfully
    const responseCode = params['vnp_ResponseCode'];
    
    if (responseCode === '00') {
      // Payment successful
      if ('orderUpdateSuccess' in result && result.orderUpdateSuccess) {
        console.log(`VNPay IPN: Order ${params['vnp_TxnRef']} updated successfully`);
      } else {
        console.warn(`VNPay IPN: Payment successful but order update may have failed`);
      }
      
      return NextResponse.json(
        { RspCode: '00', Message: 'Confirm Success' },
        { status: 200 }
      );
    } else {
      // Payment failed
      console.log(`VNPay IPN: Payment failed with code ${responseCode}`);
      return NextResponse.json(
        { RspCode: '00', Message: 'Confirm Success' },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('VNPay IPN Error:', error);
    return NextResponse.json(
      { RspCode: '99', Message: 'Unknown Error' },
      { status: 200 }
    );
  }
}
