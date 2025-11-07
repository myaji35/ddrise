'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, Package, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  sku: string;
  nameKo: string;
  nameEn: string;
  category: string;
  brand: string;
  price: number | null;
  stock: number;
  status: string;
  featured: boolean;
}

interface Stats {
  total: number;
  active: number;
  outOfStock: number;
  featured: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    outOfStock: 0,
    featured: 0,
  });

  // 제품 목록 로드
  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (search) params.append('search', search);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);

      // 통계 계산
      setStats({
        total: data.pagination.total,
        active: data.products.filter((p: Product) => p.status === 'ACTIVE').length,
        outOfStock: data.products.filter((p: Product) => p.status === 'OUT_OF_STOCK').length,
        featured: data.products.filter((p: Product) => p.featured).length,
      });
    } catch (error) {
      console.error('제품 로드 오류:', error);
      alert('제품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 제품 삭제
  const deleteProduct = async (id: string) => {
    if (!confirm('정말로 이 제품을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('제품이 삭제되었습니다.');
        loadProducts();
      } else {
        const error = await response.json();
        alert(error.error || '제품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('제품 삭제 오류:', error);
      alert('제품 삭제 중 오류가 발생했습니다.');
    }
  };

  // 검색 실행
  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  // 페이지 로드 시 제품 목록 불러오기
  useEffect(() => {
    loadProducts();
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">제품 관리</h1>
            <p className="text-slate-600 mt-1">전체 제품을 관리하고 새로운 제품을 등록하세요</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800">
              <Plus className="h-5 w-5" />
              신규 제품 등록
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">전체 제품</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">활성 제품</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">품절</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.outOfStock}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">추천 제품</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.featured}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="제품명 또는 SKU로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900 placeholder-slate-400"
              />
            </div>
            <Button onClick={handleSearch} className="bg-slate-900 hover:bg-slate-800 px-6">
              검색
            </Button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            <p className="mt-4 text-slate-600">제품을 불러오는 중...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">등록된 제품이 없습니다.</p>
            <p className="text-slate-500 text-sm mt-2">새로운 제품을 등록하여 시작하세요.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      제품명
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      브랜드
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      재고
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-slate-900">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{product.nameKo}</span>
                          {product.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              추천
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {product.price ? `₩${product.price.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            product.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'OUT_OF_STOCK'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              이전
            </Button>
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-md">
                {page} / {totalPages}
              </span>
            </div>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              다음
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
