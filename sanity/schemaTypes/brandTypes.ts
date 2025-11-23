/**
 * Brand Type Schema
 * 
 * Schema này định nghĩa cấu trúc cho thương hiệu sản phẩm (Product Brands).
 * Mỗi sản phẩm có thể được gắn với một thương hiệu.
 * 
 * Fields:
 * - title: Tên thương hiệu
 * - slug: URL-friendly identifier
 * - description: Mô tả thương hiệu
 * - image: Logo hoặc hình ảnh đại diện thương hiệu
 */

import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const brandType = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Brand Image",
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