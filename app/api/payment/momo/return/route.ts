import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const resultCode = searchParams.get('resultCode');
    const orderId = searchParams.get('orderId');

    if (resultCode === '0') {
      // Payment successful - redirect to success page
      return NextResponse.redirect(
        new URL(
          `/payment/success?orderId=${orderId}`,
          req.url
        )
      );
    } else {
      // Payment failed - redirect to failure page
      return NextResponse.redirect(
        new URL(
          `/payment/failure?orderId=${orderId}&code=${resultCode}`,
          req.url
        )
      );
    }
  } catch (error) {
    console.error('MoMo return URL error:', error);
    return NextResponse.redirect(new URL('/payment/failure', req.url));
  }
}
