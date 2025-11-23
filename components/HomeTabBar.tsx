'use client';
import { productType } from '@/constants/data';
import Link from 'next/link';
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div className="gassp-1.5 flex items-center text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`border-shop_light_green/30 hover:bg-shop_light_green hover:border-shop_light_green hoverEffect rounded-full border px-4 py-1.5 hover:text-white md:px-6 md:py-2 ${
                selectedTab === item?.title
                  ? 'bg-shop_light_green border-shop_light_green text-white'
                  : 'bg-shop_light_green/10'
              }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={'/shop'}
        className="border-darkColor hover:bg-shop_light_green hover:border-shop_light_green hoverEffect rounded-full border px-4 py-1 hover:text-white"
      >
        Tất cả
      </Link>
    </div>
  );
};

export default HomeTabbar;
