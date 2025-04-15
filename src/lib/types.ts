
// Coupon Types
export type CouponType = 'FIRST_PURCHASE' | 'BIRTHDAY' | 'LOYALTY' | 'SPECIAL_PROMOTION' | 'REFERRAL';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  discount: number; // Percentage discount
  description: string;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  usedByStore?: string;
  createdAt: Date;
}

// Store Types
export interface Store {
  id: string;
  name: string;
  token: string;
  location: string;
  couponsRedeemed: number;
}

// Rule Types
export interface CouponRule {
  id: string;
  name: string;
  description: string;
  type: CouponType;
  discount: number;
  triggerType: 'REGISTRATION' | 'MANUAL' | 'BIRTHDAY' | 'PURCHASE_COUNT';
  isActive: boolean;
  createdAt: Date;
}

// Analytics Types
export interface CouponTypeAnalytics {
  type: CouponType;
  count: number;
  percentage: number;
}

export interface StoreAnalytics {
  storeId: string;
  storeName: string;
  couponsRedeemed: number;
  percentage: number;
}

export interface TimeAnalytics {
  date: string;
  count: number;
}

// API Response Types
export interface RedeemCouponResponse {
  success: boolean;
  message: string;
  coupon?: Coupon;
}
