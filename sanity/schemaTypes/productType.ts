/**
 * Product Type Schema
 * 
 * Schema này định nghĩa cấu trúc cho sản phẩm trong hệ thống e-commerce.
 * Mỗi product chứa đầy đủ thông tin cần thiết để hiển thị và bán hàng.
 * 
 * Fields:
 * - name: Tên sản phẩm
 * - slug: URL-friendly identifier
 * - images: Mảng hình ảnh sản phẩm (có hotspot)
 * - description: Mô tả sản phẩm
 * - price: Giá gốc
 * - discount: Giảm giá
 * - categories: Danh mục sản phẩm (reference to category)
 * - stock: Số lượng tồn kho
 * - brand: Thương hiệu (reference to brand)
 * - status: Trạng thái (new/hot/sale)
 * - variant: Loại sản phẩm (gadget/appliances/refrigerators/others)
 * - isFeatured: Đánh dấu sản phẩm nổi bật
 */

import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { PriceInput } from "../components/PriceInput";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Tên sản phẩm",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Đường dẫn (Slug)",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Hình ảnh sản phẩm",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Mô tả",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Giá",
      type: "number",
      components: {
        input: PriceInput,
      },
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Giảm giá",
      type: "number",
      components: {
        input: PriceInput,
      },
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Danh mục",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Kho hàng",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "brand",
      title: "Thương hiệu",
      type: "reference",
      to: { type: "brand" },
    }),

    defineField({
      name: "status",
      title: "Trạng thái sản phẩm",
      type: "string",
      options: {
        list: [
          { title: "Mới", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Giảm giá", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Loại sản phẩm",
      type: "string",
      options: {
        list: [
          { title: "Thiết bị", value: "gadget" },
          { title: "Đồ điện tử", value: "appliances" },
          { title: "Tủ lạnh", value: "refrigerators" },
          { title: "Khác", value: "others" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Sản phẩm nổi bật",
      type: "boolean",
      description: "Bật tắt trạng thái nổi bật",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      
      const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(subtitle || 0);

      return {
        title: title,
        subtitle: formattedPrice,
        media: image,
      };
    },
  },
});