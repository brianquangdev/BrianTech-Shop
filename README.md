# 🛍️ BrianTech Shop

Một nền tảng thương mại điện tử hiện đại được xây dựng với Next.js, Sanity CMS, và tích hợp thanh toán VNPay/MoMo.

## 🌟 Tính năng

- ✅ **Quản lý sản phẩm**: Hiển thị sản phẩm theo danh mục với hình ảnh và mô tả chi tiết
- 🛒 **Giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm
- ❤️ **Danh sách yêu thích**: Lưu sản phẩm yêu thích
- 🔐 **Xác thực người dùng**: Đăng nhập/Đăng ký với Clerk
- 💳 **Thanh toán**: Tích hợp VNPay và MoMo
- 📱 **Responsive**: Giao diện tối ưu cho mọi thiết bị
- 🎨 **Dark Mode**: Hỗ trợ chế độ sáng/tối
- 📰 **Blog/Tin tức**: Quản lý và hiển thị bài viết
- 📦 **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS 4, Motion (Framer Motion)
- **CMS**: Sanity.io
- **Authentication**: Clerk
- **State Management**: Zustand
- **Payment**: VNPay, MoMo
- **UI Components**: Radix UI, Lucide Icons
- **Carousel**: Embla Carousel

## 📋 Yêu cầu

- Node.js 20+

## 🛠️ Cài đặt

1. **Cài đặt dependencies**
```bash
npm install
```

2. **Chạy development server**
```bash
npm run dev
```

Mở [https://brian-tech-shop.vercel.app](https://brian-tech-shop.vercel.app) để xem kết quả.

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Kiểm tra linting
- `npm run format` - Format code với Prettier
- `npm run format:check` - Kiểm tra format
- `npm run typegen` - Generate Sanity types

## 🗂️ Cấu trúc thư mục

```
BrianTech-Shop/
├── app/                      # Next.js App Router
│   ├── (client)/            # Client-facing pages (blog, cart, orders, product, shop, wishlist...)
│   ├── api/                 # API routes (payment callbacks, VNPay IPN)
│   ├── studio/              # Sanity Studio
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── not-found.tsx        # 404 page
├── components/              # React components
│   ├── shop/               # Shop-specific components
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── actions/                 # Server actions (createMoMoPayment, createVNPayPayment)
├── sanity/                  # Sanity CMS
│   ├── schemaTypes/        # Content schemas (product, category, order...)
│   ├── queries/            # GROQ queries
│   ├── helpers/            # Helper functions (orders, products)
│   ├── lib/                # Sanity clients (read/write)
│   └── components/         # Sanity Studio components
├── lib/                     # Utilities & configs (momo, vnpay, utils)
├── hooks/                   # Custom React hooks
├── constants/               # App constants
├── images/                  # Image assets (banner, brands, products)
├── public/                  # Static files
└── store.ts                 # Zustand global state
```

## 💳 Tích hợp thanh toán

### VNPay
- Đăng ký tài khoản sandbox tại: [http://sandbox.vnpayment.vn/devreg/](http://sandbox.vnpayment.vn/devreg/)
- Cấu hình `VNPAY_TMN_CODE` và `VNPAY_HASH_SECRET` trong `.env`
- Return URL: `https://brian-tech-shop.vercel.app/payment/vnpay-return`

### MoMo
- Đăng ký tài khoản test tại: [https://developers.momo.vn/](https://developers.momo.vn/)
- Cấu hình `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, và `MOMO_SECRET_KEY`
- Return URL: `https://brian-tech-shop.vercel.app/api/payment/momo/return`
- Callback URL: `https://brian-tech-shop.vercel.app/api/payment/momo/callback`

## 🎨 Customization

Dự án sử dụng TailwindCSS với custom theme. Xem `globals.css` để tùy chỉnh màu sắc và styles.

## 📦 Deployment

### Vercel

Ứng dụng đang được deploy tại: [https://brian-tech-shop.vercel.app](https://brian-tech-shop.vercel.app)

## 🔧 Sanity Studio

Để chạy Sanity Studio:

```bash
npx sanity dev
```

Hoặc truy cập: `https://brian-tech-shop.vercel.app/studio`

## 📚 Tài liệu

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [VNPay Documentation](http://sandbox.vnpayment.vn/apis/)
- [MoMo Documentation](https://developers.momo.vn/)

## 🤝 Contributing

Contributions, issues và feature requests đều được chào đón!

## 📄 License

This project is private.

## 👨‍💻 Author

**Brian Quang**

---

Made with ❤️ by Brian Quang
