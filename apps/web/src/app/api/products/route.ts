import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductCategory, ProductStatus } from '../../../generated/prisma';

// GET /api/products - 제품 목록 조회 (필터링, 페이지네이션 포함)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') as ProductCategory | null;
    const brand = searchParams.get('brand');
    const status = searchParams.get('status') as ProductStatus | null;
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // 필터 조건 구성
    const where: any = {};

    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    // 검색어가 있으면 이름으로 검색
    if (search) {
      where.OR = [
        { nameKo: { contains: search } },
        { nameEn: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    // 총 개수와 제품 목록 조회
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // JSON 필드 파싱
    const productsWithParsedFields = products.map((product) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
    }));

    return NextResponse.json({
      products: productsWithParsedFields,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('제품 조회 오류:', error);
    return NextResponse.json(
      { error: '제품을 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/products - 새 제품 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 필수 필드 검증
    if (!body.sku || !body.nameKo || !body.nameEn || !body.category || !body.brand) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // JSON 필드를 문자열로 변환
    const productData = {
      ...body,
      images: body.images ? JSON.stringify(body.images) : null,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      specifications: body.specifications ? JSON.stringify(body.specifications) : null,
    };

    // 제품 생성
    const product = await prisma.product.create({
      data: productData,
    });

    // JSON 필드 파싱하여 응답
    const productWithParsedFields = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
    };

    return NextResponse.json(productWithParsedFields, { status: 201 });
  } catch (error: any) {
    console.error('제품 생성 오류:', error);

    // SKU 중복 오류 처리
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '이미 존재하는 SKU입니다.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '제품을 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
