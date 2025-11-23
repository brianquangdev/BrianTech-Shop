/**
 * Author Type Schema
 * 
 * Schema này định nghĩa cấu trúc cho tác giả blog (Blog Authors).
 * Mỗi bài viết blog có thể được gắn với một tác giả.
 * 
 * Fields:
 * - name: Tên tác giả
 * - slug: URL-friendly identifier
 * - image: Ảnh đại diện của tác giả
 * - bio: Tiểu sử tác giả (rich text)
 */

import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});