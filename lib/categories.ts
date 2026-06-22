export const SHOP_CATEGORIES = [
  'Admission Counseling',
  'Academic Assistance',
  'Study Abroad',
  'Application Services',
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export function isShopCategory(value: string): value is ShopCategory {
  return (SHOP_CATEGORIES as readonly string[]).includes(value);
}

export function formatCategoryLabel(category: string): string {
  return category;
}
