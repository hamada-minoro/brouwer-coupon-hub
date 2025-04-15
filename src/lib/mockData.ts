
import { Coupon, Store, CouponRule, CouponType, CouponTypeAnalytics, StoreAnalytics, TimeAnalytics, RedeemCouponResponse } from './types';

// Helper to create dates relative to today
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Mock Coupons
export const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME25',
    type: 'FIRST_PURCHASE',
    discount: 25,
    description: 'Cupom de primeira compra - 25% de desconto',
    expiresAt: daysFromNow(30),
    isUsed: false,
    createdAt: daysFromNow(-5),
  },
  {
    id: '2',
    code: 'BDAY2023',
    type: 'BIRTHDAY',
    discount: 15,
    description: 'Cupom de aniversário - 15% de desconto',
    expiresAt: daysFromNow(10),
    isUsed: true,
    usedAt: daysFromNow(-2),
    usedByStore: '1',
    createdAt: daysFromNow(-10),
  },
  {
    id: '3',
    code: 'LOYAL10',
    type: 'LOYALTY',
    discount: 10,
    description: 'Cupom de fidelidade - 10% de desconto',
    expiresAt: daysFromNow(60),
    isUsed: false,
    createdAt: daysFromNow(-15),
  },
  {
    id: '4',
    code: 'SUMMER30',
    type: 'SPECIAL_PROMOTION',
    discount: 30,
    description: 'Promoção especial de verão - 30% de desconto',
    expiresAt: daysFromNow(45),
    isUsed: true,
    usedAt: daysFromNow(-1),
    usedByStore: '2',
    createdAt: daysFromNow(-8),
  },
  {
    id: '5',
    code: 'FRIEND20',
    type: 'REFERRAL',
    discount: 20,
    description: 'Indicação de amigo - 20% de desconto',
    expiresAt: daysFromNow(20),
    isUsed: false,
    createdAt: daysFromNow(-3),
  },
  {
    id: '6',
    code: 'SUMMER25',
    type: 'SPECIAL_PROMOTION',
    discount: 25,
    description: 'Promoção especial de verão - 25% de desconto',
    expiresAt: daysFromNow(25),
    isUsed: true,
    usedAt: daysFromNow(-4),
    usedByStore: '3',
    createdAt: daysFromNow(-12),
  },
  {
    id: '7',
    code: 'WELCOME20',
    type: 'FIRST_PURCHASE',
    discount: 20,
    description: 'Cupom de primeira compra - 20% de desconto',
    expiresAt: daysFromNow(30),
    isUsed: true,
    usedAt: daysFromNow(-7),
    usedByStore: '1',
    createdAt: daysFromNow(-20),
  },
];

// Mock Stores
export const mockStores: Store[] = [
  {
    id: '1',
    name: 'Pet Shop Patinhas',
    token: 'PATINHAS001',
    location: 'São Paulo, SP',
    couponsRedeemed: 2,
  },
  {
    id: '2',
    name: 'Agropecuária Mundo Animal',
    token: 'ANIMAL002',
    location: 'Rio de Janeiro, RJ',
    couponsRedeemed: 1,
  },
  {
    id: '3',
    name: 'Casa dos Bichos',
    token: 'BICHOS003',
    location: 'Belo Horizonte, MG',
    couponsRedeemed: 1,
  },
  {
    id: '4',
    name: 'Amigos Pet',
    token: 'AMIGOS004',
    location: 'Curitiba, PR',
    couponsRedeemed: 0,
  },
  {
    id: '5',
    name: 'Clínica Veterinária Saúde Pet',
    token: 'SAUDE005',
    location: 'Brasília, DF',
    couponsRedeemed: 0,
  },
];

// Mock Coupon Rules
export const mockCouponRules: CouponRule[] = [
  {
    id: '1',
    name: 'Cadastro de Novo Cliente',
    description: 'Emite um cupom de 25% para novos clientes',
    type: 'FIRST_PURCHASE',
    discount: 25,
    triggerType: 'REGISTRATION',
    isActive: true,
    createdAt: daysFromNow(-30),
  },
  {
    id: '2',
    name: 'Aniversário do Cliente',
    description: 'Emite um cupom de 15% no mês de aniversário do cliente',
    type: 'BIRTHDAY',
    discount: 15,
    triggerType: 'BIRTHDAY',
    isActive: true,
    createdAt: daysFromNow(-25),
  },
  {
    id: '3',
    name: 'Cliente Frequente',
    description: 'Emite um cupom de 10% após 5 compras',
    type: 'LOYALTY',
    discount: 10,
    triggerType: 'PURCHASE_COUNT',
    isActive: true,
    createdAt: daysFromNow(-20),
  },
  {
    id: '4',
    name: 'Promoção de Verão',
    description: 'Cupom de 30% para a promoção de verão',
    type: 'SPECIAL_PROMOTION',
    discount: 30,
    triggerType: 'MANUAL',
    isActive: false,
    createdAt: daysFromNow(-15),
  },
  {
    id: '5',
    name: 'Programa de Indicação',
    description: 'Cupom de 20% quando um cliente indica um amigo',
    type: 'REFERRAL',
    discount: 20,
    triggerType: 'MANUAL',
    isActive: true,
    createdAt: daysFromNow(-10),
  },
];

// Helper to calculate coupon type analytics
const calculateCouponTypeAnalytics = (): CouponTypeAnalytics[] => {
  const usedCoupons = mockCoupons.filter(coupon => coupon.isUsed);
  const total = usedCoupons.length;
  
  const types: CouponType[] = ['FIRST_PURCHASE', 'BIRTHDAY', 'LOYALTY', 'SPECIAL_PROMOTION', 'REFERRAL'];
  
  return types.map(type => {
    const count = usedCoupons.filter(coupon => coupon.type === type).length;
    return {
      type,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    };
  }).sort((a, b) => b.count - a.count);
};

// Helper to calculate store analytics
const calculateStoreAnalytics = (): StoreAnalytics[] => {
  const total = mockCoupons.filter(coupon => coupon.isUsed).length;
  
  return mockStores.map(store => {
    const couponsRedeemed = mockCoupons.filter(coupon => coupon.usedByStore === store.id).length;
    return {
      storeId: store.id,
      storeName: store.name,
      couponsRedeemed,
      percentage: total > 0 ? (couponsRedeemed / total) * 100 : 0,
    };
  }).sort((a, b) => b.couponsRedeemed - a.couponsRedeemed);
};

// Helper to calculate time analytics
const calculateTimeAnalytics = (): TimeAnalytics[] => {
  const result: TimeAnalytics[] = [];
  
  for (let i = -6; i <= 0; i++) {
    const date = daysFromNow(i);
    const dateString = date.toISOString().split('T')[0];
    
    const count = mockCoupons.filter(coupon => {
      if (!coupon.usedAt) return false;
      const couponDate = coupon.usedAt.toISOString().split('T')[0];
      return couponDate === dateString;
    }).length;
    
    result.push({
      date: dateString,
      count,
    });
  }
  
  return result;
};

// Mock Analytics
export const mockAnalytics = {
  couponTypes: calculateCouponTypeAnalytics(),
  stores: calculateStoreAnalytics(),
  timeline: calculateTimeAnalytics(),
  totalRedeemed: mockCoupons.filter(coupon => coupon.isUsed).length,
  totalActive: mockCoupons.filter(coupon => !coupon.isUsed).length,
};

// Mock data service to simulate API calls
export const mockDataService = {
  getCoupons: () => Promise.resolve([...mockCoupons]),
  
  getCouponByCode: (code: string) => {
    const coupon = mockCoupons.find(c => c.code === code);
    return Promise.resolve(coupon || null);
  },
  
  validateStoreToken: (token: string) => {
    const store = mockStores.find(s => s.token === token);
    return Promise.resolve(store || null);
  },
  
  redeemCoupon: (couponCode: string, storeId: string): Promise<RedeemCouponResponse> => {
    const couponIndex = mockCoupons.findIndex(c => c.code === couponCode);
    if (couponIndex === -1) return Promise.resolve({ success: false, message: 'Cupom não encontrado' });
    
    const coupon = mockCoupons[couponIndex];
    if (coupon.isUsed) return Promise.resolve({ success: false, message: 'Cupom já utilizado' });
    if (coupon.expiresAt < new Date()) return Promise.resolve({ success: false, message: 'Cupom expirado' });
    
    // Update coupon
    const updatedCoupon = {
      ...coupon,
      isUsed: true,
      usedAt: new Date(),
      usedByStore: storeId,
    };
    
    mockCoupons[couponIndex] = updatedCoupon;
    
    // Update store
    const storeIndex = mockStores.findIndex(s => s.id === storeId);
    if (storeIndex !== -1) {
      mockStores[storeIndex] = {
        ...mockStores[storeIndex],
        couponsRedeemed: mockStores[storeIndex].couponsRedeemed + 1,
      };
    }
    
    return Promise.resolve({ 
      success: true, 
      message: 'Cupom resgatado com sucesso', 
      coupon: updatedCoupon 
    });
  },
  
  getStores: () => Promise.resolve([...mockStores]),
  
  getCouponRules: () => Promise.resolve([...mockCouponRules]),
  
  getAnalytics: () => Promise.resolve({
    couponTypes: calculateCouponTypeAnalytics(),
    stores: calculateStoreAnalytics(),
    timeline: calculateTimeAnalytics(),
    totalRedeemed: mockCoupons.filter(coupon => coupon.isUsed).length,
    totalActive: mockCoupons.filter(coupon => !coupon.isUsed).length,
  }),
  
  saveCouponRule: (rule: Omit<CouponRule, 'id' | 'createdAt'>) => {
    const newRule: CouponRule = {
      ...rule,
      id: (mockCouponRules.length + 1).toString(),
      createdAt: new Date(),
    };
    
    mockCouponRules.push(newRule);
    return Promise.resolve({ success: true, rule: newRule });
  },
  
  toggleRuleStatus: (ruleId: string) => {
    const ruleIndex = mockCouponRules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) return Promise.resolve({ success: false });
    
    mockCouponRules[ruleIndex] = {
      ...mockCouponRules[ruleIndex],
      isActive: !mockCouponRules[ruleIndex].isActive,
    };
    
    return Promise.resolve({ success: true, rule: mockCouponRules[ruleIndex] });
  },
};
