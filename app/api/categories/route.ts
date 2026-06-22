import { NextResponse } from 'next/server';
import { SHOP_CATEGORIES } from '@/lib/categories';

export function GET() {
  return NextResponse.json({ categories: SHOP_CATEGORIES });
}
