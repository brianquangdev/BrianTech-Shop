import CategoryProducts from '@/components/CategoryProducts';
import Container from '@/components/Container';
import Title from '@/components/Title';
import { getCategories } from '@/sanity/queries';
import { categoriesData } from '@/constants/data';
import React from 'react';

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const categories = await getCategories();
  const { slug } = await params;
  
  // Tìm tên tiếng Việt từ slug
  const categoryName = categoriesData.find(cat => cat.href === slug)?.title || slug;
  
  return (
    <div className="py-10">
      <Container>
        <Title>
          Sản phẩm theo danh mục:{' '}
          <span className="font-bold text-green-600 capitalize tracking-wide">
            {categoryName}
          </span>
        </Title>
        <CategoryProducts
          categories={categories}
          slug={slug}
        />
      </Container>
    </div>
  );
};

export default CategoryPage;
