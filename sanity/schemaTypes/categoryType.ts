/**
 * Category Type Schema
 * 
 * Schema này định nghĩa cấu trúc cho danh mục sản phẩm (Product Categories).
 * Mỗi category có thể chứa nhiều sản phẩm và được sử dụng để phân loại sản phẩm.
 * 
 * Fields:
 * - title: Tên danh mục
 * - slug: URL-friendly identifier
 * - description: Mô tả danh mục
 * - range: Giá khởi điểm của danh mục
 * - featured: Đánh dấu danh mục nổi bật
 * - image: Hình ảnh đại diện cho danh mục
 */

import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "range",
      type: "number",
      description: "Starting from",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});