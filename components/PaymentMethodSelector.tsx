'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';

interface PaymentMethodSelectorProps {
  selectedMethod: 'momo' | 'vnpay';
  onMethodChange: (method: 'momo' | 'vnpay') => void;
}

const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chọn phương thức thanh toán</h3>
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => onMethodChange(value as 'momo' | 'vnpay')}
      >
        {/* MoMo Option */}
        <div
          onClick={() => onMethodChange('momo')}
          className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'momo'
              ? 'border-shop_dark_green bg-shop_light_green/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <RadioGroupItem value="momo" id="momo" />
          <Label
            htmlFor="momo"
            className="flex items-center gap-3 cursor-pointer flex-1"
          >
            <div className="w-12 h-12 relative">
              <Image
                src="/momo-logo.png"
                alt="MoMo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-semibold">Ví MoMo</p>
              <p className="text-sm text-gray-500">
                Thanh toán qua ví điện tử MoMo
              </p>
            </div>
          </Label>
        </div>

        {/* VNPay Option */}
        <div
          onClick={() => onMethodChange('vnpay')}
          className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === 'vnpay'
              ? 'border-shop_dark_green bg-shop_light_green/5'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <RadioGroupItem value="vnpay" id="vnpay" />
          <Label
            htmlFor="vnpay"
            className="flex items-center gap-3 cursor-pointer flex-1"
          >
            <div className="w-12 h-12 relative">
              <Image
                src="/vnpay-logo.png"
                alt="VNPay"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-semibold">VNPay</p>
              <p className="text-sm text-gray-500">
                Thanh toán qua thẻ ATM, Visa, MasterCard
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
