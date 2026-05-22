import { prisma } from './prisma.js';

/** Returns the singleton settings row, creating it with defaults if missing. */
export async function getSettings() {
  const existing = await prisma.setting.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  return prisma.setting.create({ data: { id: 1 } });
}

export function serializeSettings(s: Awaited<ReturnType<typeof getSettings>>) {
  return {
    storeName: s.storeName,
    supportEmail: s.supportEmail,
    supportPhone: s.supportPhone,
    address: s.address,
    facebook: s.facebook,
    instagram: s.instagram,
    twitter: s.twitter,
    announcement: s.announcement,
    freeShippingThreshold: Number(s.freeShippingThreshold),
    shippingFlat: Number(s.shippingFlat),
    taxRate: s.taxRate,
    currencyCode: s.currencyCode,
    currencySymbol: s.currencySymbol,
  };
}
