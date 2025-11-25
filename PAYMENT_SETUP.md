# Cấu hình Payment Gateway

## Môi trường Test/Sandbox

Để test payment integration, cần thêm các environment variables sau vào file `.env`:

```bash
# MoMo Configuration (Test Environment)
MOMO_PARTNER_CODE=your_partner_code_here
MOMO_ACCESS_KEY=your_access_key_here
MOMO_SECRET_KEY=your_secret_key_here
MOMO_ENDPOINT=https://test-payment.momo.vn

# VNPay Configuration (Sandbox Environment)
VNPAY_TMN_CODE=your_tmn_code_here
VNPAY_HASH_SECRET=your_hash_secret_here
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Đăng ký tài khoản Test

### MoMo
1. Truy cập: https://business.momo.vn/
2. Đăng ký tài khoản M4B (Merchant for Business)
3. Lấy credentials từ dashboard

### VNPay
1. Truy cập: https://sandbox.vnpayment.vn/
2. Đăng ký tài khoản sandbox
3. Lấy Terminal Code và Hash Secret

## Test Payment

### MoMo Test App
- Download MoMo test app từ MoMo developers portal
- Sử dụng test credentials để thanh toán

### VNPay Test Cards
```
Card Number: 9704198526191432198
Card Holder: NGUYEN VAN A
Issue Date: 07/15
OTP: 123456
```

## Payment Logos

Bạn cần thêm 2 file logo vào thư mục `public/`:
- `public/momo-logo.png` - Logo MoMo
- `public/vnpay-logo.png` - Logo VNPay

Kích thước khuyến nghị: 200x200px (PNG với background trong suốt)
