import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/products/[id] - 단일 제품 조회
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // JSON 필드 파싱
    const productWithParsedFields = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
    };

    return NextResponse.json(productWithParsedFields);
  } catch (error) {
    console.error('제품 조회 오류:', error);
    return NextResponse.json(
      { error: '제품을 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - 제품 수정
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 제품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // JSON 필드를 문자열로 변환
    const updateData = {
      ...body,
      images: body.images ? JSON.stringify(body.images) : undefined,
      tags: body.tags ? JSON.stringify(body.tags) : undefined,
      specifications: body.specifications ? JSON.stringify(body.specifications) : undefined,
    };

    // undefined 값 제거 (수정하지 않을 필드)
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // 제품 수정
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    // JSON 필드 파싱하여 응답
    const productWithParsedFields = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
    };

    return NextResponse.json(productWithParsedFields);
  } catch (error: any) {
    console.error('제품 수정 오류:', error);

    // SKU 중복 오류 처리
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '이미 존재하는 SKU입니다.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '제품을 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - 제품 삭제
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // 제품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 제품 삭제
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: '제품이 삭제되었습니다.' });
  } catch (error) {
    console.error('제품 삭제 오류:', error);
    return NextResponse.json(
      { error: '제품을 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
