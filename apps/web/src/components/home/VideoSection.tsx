export function VideoSection() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
            PRODUCT DEMONSTRATION
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-triple">EXACT Tools in Action</span>
          </h2>
          <p className="text-lg text-slate-600">
            See how German precision engineering delivers the fastest, safest pipe cutting solution
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Main Product Video */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-slate-900">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/XTbAE3OSroE"
                title="EXACT Tools Complete Product Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Complete Product System Overview</h3>
              <p className="text-slate-600">Discover the full range of EXACT pipe cutting solutions</p>
            </div>
          </div>

          {/* PipeCut 170 */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-slate-900">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/pAEeO2KrdYI"
                title="EXACT PipeCut 170"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-3">
              <h4 className="text-lg font-bold text-slate-800">PipeCut 170 - Lightweight Champion</h4>
              <p className="text-sm text-slate-600">Perfect for on-site small pipe cutting</p>
            </div>
          </div>

          {/* PipeCut 280E */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-slate-900">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/-wBBVCXXy6U"
                title="EXACT PipeCut 280E"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-3">
              <h4 className="text-lg font-bold text-slate-800">PipeCut 280E - Professional Power</h4>
              <p className="text-sm text-slate-600">Heavy-duty performance for demanding applications</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 pt-10 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">10x</div>
              <div className="text-sm text-slate-600">Faster than traditional methods</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">15mm-∞</div>
              <div className="text-sm text-slate-600">Unlimited pipe diameter range</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">50+</div>
              <div className="text-sm text-slate-600">Product models available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">Red Dot</div>
              <div className="text-sm text-slate-600">Design Award Winner</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
