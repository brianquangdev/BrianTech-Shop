import { VNPay, ignoreLogger, HashAlgorithm } from 'vnpay';

export const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE || '8Y7XLN27',
  secureSecret: process.env.VNPAY_HASH_SECRET || 'QUQFI462XHL1BBBUCZLKVEUSL3ZLVFP4',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true, // Use true for sandbox
  hashAlgorithm: 'SHA512' as HashAlgorithm,
  enableLog: true,
  loggerFn: ignoreLogger,
});
