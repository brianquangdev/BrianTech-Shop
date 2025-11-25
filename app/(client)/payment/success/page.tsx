'use client';

import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import useStore from '@/store';

export const dynamic = 'force-dynamic';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { resetCart } = useStore();

  useEffect(() => {
    // Clear cart sau khi thanh toán thành công
    resetCart();
  }, [resetCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-md p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  {orderId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/"
                className="block"
              >
                <Button
                  className="w-full"
                  size="lg"
                >
                  Tiếp tục mua sắm
                </Button>
              </Link>
              <Link
                href="/orders"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Xem đơn hàng
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của
              bạn.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
