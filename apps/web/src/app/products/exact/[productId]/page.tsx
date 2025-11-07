import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exactProducts } from '@/data/exact-products';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Download, Play } from 'lucide-react';

interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateStaticParams() {
  return exactProducts.map((product) => ({
    productId: product.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { productId } = await params;
  const product = exactProducts.find((p) => p.id === productId);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - EXACT Tools`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;
  const product = exactProducts.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  const relatedProducts = exactProducts
    .filter((p) => p.series === product.series && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-slate-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/products/exact" className="hover:text-orange-600">
              EXACT Tools
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Hero */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative h-96 bg-slate-100 rounded-2xl overflow-hidden mb-4">
                <Image
                  src={product.images.main}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.videoUrl && (
                  <Link
                    href={product.videoUrl}
                    target="_blank"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                      <Play className="h-10 w-10 text-white ml-1" />
                    </div>
                  </Link>
                )}
              </div>

              {product.images.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.images.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-24 bg-slate-100 rounded-lg overflow-hidden"
                    >
                      <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                  {product.series}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>

              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 flex-1" asChild>
                  <Link href="/contact">
                    Request Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  <Download className="mr-2 h-5 w-5" />
                  Download Spec Sheet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Technical Specifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Dimensions & Capacity</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Pipe Outer Diameter</span>
                  <span className="font-semibold text-slate-900">
                    {product.specifications.pipeDiameter}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Wall Thickness</span>
                  <span className="font-semibold text-slate-900">
                    {product.specifications.wallThickness}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Weight</span>
                  <span className="font-semibold text-slate-900">{product.specifications.weight}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Power & Performance</h3>
              <div className="space-y-3">
                {product.specifications.power && (
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Power</span>
                    <span className="font-semibold text-slate-900">{product.specifications.power}</span>
                  </div>
                )}
                {product.specifications.voltage && (
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Voltage</span>
                    <span className="font-semibold text-slate-900">{product.specifications.voltage}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Cutting Speed</span>
                  <span className="font-semibold text-slate-900">Up to 10x faster</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm md:col-span-2">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Compatible Materials</h3>
              <div className="flex flex-wrap gap-2">
                {product.specifications.materials.map((material, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {product.videoUrl && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Product in Action</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={product.videoUrl.replace('watch?v=', 'embed/')}
                  title={`${product.name} demonstration`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/exact/${relatedProduct.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 bg-slate-100">
                    <Image
                      src={relatedProduct.images.main}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{relatedProduct.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{relatedProduct.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Button */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Button variant="outline" asChild>
            <Link href="/products/exact">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Products
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
