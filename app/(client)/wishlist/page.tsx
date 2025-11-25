import NoAccess from '@/components/NoAccess';
import WishListProducts from '@/components/WishListProducts';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';

const WishListPage = async () => {
  const user = await currentUser();
  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Đăng nhập để xem danh sách yêu thích của bạn. Đừng bỏ lỡ những sản phẩm yêu thích để mua sắm!" />
      )}
    </>
  );
};

export default WishListPage;
