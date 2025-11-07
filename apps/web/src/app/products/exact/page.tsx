import Image from 'next/image';
import Link from 'next/link';
import { exactProducts, productCategories } from '@/data/exact-products';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';

export const metadata = {
  title: 'EXACT Tools Product Lineup - Daedong',
  description: 'Complete range of EXACT pipe cutting, beveling, and preparation tools. From 15mm to unlimited diameter.',
};

export default function ExactProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
              GERMAN PRECISION ENGINEERING
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              EXACT Tools
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-6">
              Professional Pipe Cutting & Beveling Systems
            </p>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Cut pipes up to 10x faster with German precision. From 15mm to unlimited diameter.
              Steel, Stainless, Plastic, Copper - All materials, All sizes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50"
                asChild
              >
                <Link href="#products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">10x</div>
              <div className="text-sm text-slate-600">Faster Cutting</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">15mm-∞</div>
              <div className="text-sm text-slate-600">Diameter Range</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">23</div>
              <div className="text-sm text-slate-600">Product Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">ISO</div>
              <div className="text-sm text-slate-600">Certified Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white py-6 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {productCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-700 whitespace-nowrap transition-colors text-sm font-medium"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <section id="products" className="py-12">
        <div className="container mx-auto px-4">
          {productCategories.map((category) => {
            const categoryProducts = exactProducts.filter(
              (product) => product.category === category.id
            );

            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id} id={category.id} className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    {category.name}
                  </h2>
                  <p className="text-lg text-slate-600">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/exact/${product.id}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-64 bg-slate-100 overflow-hidden">
                        <Image
                          src={product.images.main}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.videoUrl && (
                          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            VIDEO
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="text-sm text-orange-600 font-semibold mb-2">
                          {product.series}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Pipe Diameter:</span>
                            <span className="font-semibold text-slate-800">
                              {product.specifications.pipeDiameter}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Wall Thickness:</span>
                            <span className="font-semibold text-slate-800">
                              {product.specifications.wallThickness}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Choosing the Right Tool?
          </h2>
          <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
            Our AI system can recommend the perfect EXACT model based on your pipe diameter,
            material, and quantity.
          </p>
          <Button
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            asChild
          >
            <Link href="/contact">
              Get AI Recommendation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
