'use client';

import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const PaymentFailurePage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  let errorMessage = 'Đã có lỗi xảy ra trong quá trình thanh toán.';

  if (error === 'invalid_signature') {
    errorMessage = 'Chữ ký không hợp lệ. Vui lòng thử lại.';
  } else if (error === 'server_error') {
    errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau.';
  } else if (message) {
    errorMessage = decodeURIComponent(message);
  } else if (code === '24') {
    errorMessage = 'Bạn đã hủy giao dịch.';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>

            {orderId && (
              <div className="bg-gray-50 rounded-md p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  {orderId}
                </p>
              </div>
            )}

            {code && code !== '24' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-sm text-red-600">
                  Mã lỗi: <span className="font-semibold">{code}</span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/cart" className="block">
                <Button className="w-full" size="lg">
                  Quay lại giỏ hàng
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Về trang chủ
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentFailurePage;
