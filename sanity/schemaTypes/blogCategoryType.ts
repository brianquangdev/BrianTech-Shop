/**
 * Blog Category Type Schema
 * 
 * Schema này định nghĩa cấu trúc cho danh mục blog (Blog Categories).
 * Giúp phân loại các bài viết blog theo chủ đề.
 * 
 * Fields:
 * - title: Tên danh mục blog
 * - slug: URL-friendly identifier
 * - description: Mô tả danh mục
 */

import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const blogCategoryType = defineType({
  name: "blogcategory",
  title: "Blog Category",
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
    }),
    defineField({
      name: "description",
      type: "text",
    }),
  ],
});