'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { client } from '@/sanity/lib/client';
import NoProductAvailable from './NoProductAvailable';
import { Loader2 } from 'lucide-react';
import Container from './Container';
import HomeTabbar from './HomeTabBar';
import { productType } from '@/constants/data';
import { Product } from '@/sanity.types';

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || '');
  const query = `*[_type == "product" && variant == $variant] | order(name asc){
  ...,"categories": categories[]->title
}`;
  const params = {
    variant:
      productType.find((item) => item.title === selectedTab)?.value || '',
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
      } catch (error) {
        console.log('Product fetching Error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  return (
    <Container className="my-10 flex flex-col lg:px-0">
      <HomeTabbar
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />
      {loading ? (
        <div className="mt-10 flex min-h-80 w-full flex-col items-center justify-center space-y-4 rounded-lg bg-gray-100 py-10 text-center">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Tải sản phẩm...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <>
            {products?.map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard
                    key={product?._id}
                    product={product}
                  />
                </motion.div>
              </AnimatePresence>
            ))}
          </>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
