/**
 * Schema Types Index
 * 
 * File này tổng hợp và export tất cả các schema types cho Sanity CMS.
 * Mỗi schema type định nghĩa cấu trúc dữ liệu cho một loại document trong CMS.
 * 
 * Các schema types bao gồm:
 * - categoryType: Danh mục sản phẩm
 * - blockContentType: Nội dung rich text cho blog
 * - productType: Sản phẩm
 * - orderType: Đơn hàng
 * - brandType: Thương hiệu
 * - blogType: Bài viết blog
 * - blogCategoryType: Danh mục blog
 * - authorType: Tác giả blog
 * - addressType: Địa chỉ giao hàng
 */

import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
  ],
};