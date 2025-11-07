'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    nameKo: '',
    nameEn: '',
    nameAr: '',
    descriptionKo: '',
    descriptionEn: '',
    descriptionAr: '',
    category: 'TAPE_ADHESIVE',
    brand: '',
    price: '',
    currency: 'KRW',
    stock: '0',
    isAvailable: true,
    thumbnail: '',
    status: 'ACTIVE',
    featured: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        stock: parseInt(formData.stock),
        images,
        tags,
        specifications: Object.keys(specifications).length > 0 ? specifications : null,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('제품이 성공적으로 등록되었습니다.');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        alert(error.error || '제품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('제품 등록 오류:', error);
      alert('제품 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addImage = () => {
    const url = prompt('이미지 URL을 입력하세요:');
    if (url) setImages((prev) => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = prompt('태그를 입력하세요:');
    if (tag) setTags((prev) => [...prev, tag]);
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    const key = prompt('사양 이름을 입력하세요:');
    if (!key) return;
    const value = prompt('사양 값을 입력하세요:');
    if (value) setSpecifications((prev) => ({ ...prev, [key]: value }));
  };

  const removeSpecification = (key: string) => {
    setSpecifications((prev) => {
      const newSpecs = { ...prev };
      delete newSpecs[key];
      return newSpecs;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
        <h1 className="text-3xl font-bold">신규 제품 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">기본 정보</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TAPE_ADHESIVE">3M 테이프 및 접착제</option>
                <option value="ABRASIVE">3M 연마재</option>
                <option value="SAFETY_EQUIPMENT">3M 안전보호구</option>
                <option value="PIPE_CUTTING">EXACT 파이프 커팅</option>
                <option value="POWER_TOOLS">전동공구</option>
                <option value="INDUSTRIAL_FILM">산업용 필름</option>
                <option value="OTHER">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                브랜드 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="예: 3M, EXACT, DeWALT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 다국어 이름 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">제품명</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              한국어 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nameKo"
              value={formData.nameKo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              영어 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아랍어
            </label>
            <input
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* 다국어 설명 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">제품 설명</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">한국어</label>
            <textarea
              name="descriptionKo"
              value={formData.descriptionKo}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">영어</label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아랍어</label>
            <textarea
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* 가격 및 재고 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">가격 및 재고</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">통화</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="KRW">KRW (₩)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 이미지 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">이미지</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지 URL</label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">추가 이미지</label>
            <Button type="button" onClick={addImage} variant="outline" size="sm">
              이미지 추가
            </Button>
            <div className="mt-2 space-y-2">
              {images.map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={img}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button type="button" onClick={() => removeImage(index)} variant="outline" size="sm">
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 태그 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">태그</h2>
          <Button type="button" onClick={addTag} variant="outline" size="sm">
            태그 추가
          </Button>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
              >
                {tag}
                <button type="button" onClick={() => removeTag(index)} className="hover:text-indigo-900">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 사양 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">제품 사양</h2>
          <Button type="button" onClick={addSpecification} variant="outline" size="sm">
            사양 추가
          </Button>
          <div className="mt-2 space-y-2">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <input
                  type="text"
                  value={key}
                  readOnly
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <input
                  type="text"
                  value={value}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <Button type="button" onClick={() => removeSpecification(key)} variant="outline" size="sm">
                  삭제
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 상태 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">상태</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제품 상태</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="OUT_OF_STOCK">품절</option>
              <option value="DISCONTINUED">단종</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">판매 가능</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">추천 제품</span>
            </label>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '등록 중...' : '제품 등록'}
          </Button>
        </div>
      </form>
    </div>
  );
}
