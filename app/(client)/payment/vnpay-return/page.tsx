'use client';

import { verifyVNPayReturn } from '@/actions/createVNPayPayment';
import { updateOrderStatus } from '@/sanity/helpers/orders';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import useStore from '@/store';
import { ReturnQueryFromVNPay } from 'vnpay';

const VNPayReturnContent = () => {
  const searchParams = useSearchParams();
  const { resetCart } = useStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const params: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      const result = await verifyVNPayReturn(
        params as unknown as ReturnQueryFromVNPay
      );

      if (result.isSuccess) {
        // Update order status to paid
        const orderId = params['vnp_TxnRef'];
        if (orderId) {
           await updateOrderStatus(orderId, 'paid');
        }

        setStatus('success');
        setMessage('Thanh toán thành công!');
        resetCart();
      } else {
        setStatus('failed');
        setMessage(result.message || 'Thanh toán thất bại');
      }
    };

    if (searchParams.size > 0) {
      verifyPayment();
    }
  }, [searchParams, resetCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            {status === 'loading' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Đang xử lý thanh toán...
                </h1>
                <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
              </div>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600 mb-6">
                  Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.
                </p>
              </>
            )}

            {status === 'failed' && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thất bại!
                </h1>
                <p className="text-gray-600 mb-6">
                  {message || 'Có lỗi xảy ra trong quá trình thanh toán.'}
                </p>
              </>
            )}

            <div className="space-y-3 mt-6">
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
                href="/cart"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Quay lại giỏ hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const VNPayReturnPage = () => {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <VNPayReturnContent />
    </Suspense>
  );
};

export default VNPayReturnPage;
