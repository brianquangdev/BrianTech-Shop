/**
 * Order Type Schema
 * 
 * Schema này định nghĩa cấu trúc cho đơn hàng (orders) trong hệ thống e-commerce.
 * Tích hợp với Stripe để xử lý thanh toán và Clerk để quản lý user.
 * 
 * Fields:
 * - orderNumber: Mã đơn hàng
 * - invoice: Thông tin hóa đơn từ Stripe
 * - stripeCheckoutSessionId: ID phiên checkout Stripe
 * - stripeCustomerId: ID khách hàng trên Stripe
 * - clerkUserId: ID người dùng từ Clerk
 * - customerName: Tên khách hàng
 * - email: Email khách hàng
 * - stripePaymentIntentId: ID thanh toán Stripe
 * - products: Danh sách sản phẩm trong đơn (với số lượng)
 * - totalPrice: Tổng giá trị đơn hàng
 * - currency: Loại tiền tệ
 * - amountDiscount: Số tiền giảm giá
 * - address: Địa chỉ giao hàng
 * - status: Trạng thái đơn hàng (pending/processing/paid/shipped/delivered/cancelled)
 * - orderDate: Ngày đặt hàng
 */

import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    {
      name: "invoice",
      type: "object",
      fields: [
        { name: "id", type: "string" },
        { name: "number", type: "string" },
        { name: "hosted_invoice_url", type: "url" },
      ],
    },
    defineField({
      name: "stripeCheckoutSessionId",
      title: "Stripe Checkout Session ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              const formattedPrice = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(select.price * select.quantity);
              
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: formattedPrice,
                media: select.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ name: "state", title: "Tỉnh/Thành phố", type: "string" }),
        defineField({ name: "zip", title: "Mã bưu điện", type: "string" }),
        defineField({ name: "city", title: "Quận/Huyện", type: "string" }),
        defineField({ name: "address", title: "Địa chỉ", type: "string" }),
        defineField({ name: "name", title: "Tên người nhận", type: "string" }),
      ],
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId.slice(0, 5)}...${select.orderId.slice(-5)}`;
      const formattedAmount = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(select.amount);
      
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${formattedAmount}, ${select.email}`,
        media: BasketIcon,
      };
    },
  },
});