import React from 'react';
import Title from '../Title';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

const priceArray = [
  { title: 'Dưới 5 triệu', value: '0-5000000' },
  { title: '5 triệu - 10 triệu', value: '5000000-10000000' },
  { title: '10 triệu - 20 triệu', value: '10000000-20000000' },
  { title: '20 triệu - 50 triệu', value: '20000000-50000000' },
  { title: 'Trên 50 triệu', value: '50000000-1000000000' },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Giá</Title>
      <RadioGroup
        className="mt-2 space-y-1"
        value={selectedPrice || ''}
      >
        {priceArray?.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={`${selectedPrice === price?.value ? 'font-semibold text-shop_dark_green' : 'font-normal'}`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect"
        >
          Xóa lựa chọn
        </button>
      )}
    </div>
  );
};

export default PriceList;
