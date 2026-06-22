import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/lib/models';
import { isShopCategory } from '@/lib/categories';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const category = request.nextUrl.searchParams.get('category') || undefined;
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '12', 10));
    const featured = request.nextUrl.searchParams.get('featured') === 'true';

    const query: Record<string, any> = {};
    if (category) {
      if (!isShopCategory(category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }
      query.category = category;
    }

    if (featured) {
      query.discount = { $gt: 0 };
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
