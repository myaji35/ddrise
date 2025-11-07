import Image from 'next/image';

export function LogoMarquee() {
  const brands = [
    {
      name: '3M',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/3M_wordmark.svg/200px-3M_wordmark.svg.png',
      width: 80,
      height: 40,
    },
    {
      name: 'EXACT',
      text: 'EXACT',
      width: 120,
      height: 40,
    },
  ];

  return (
    <div className="py-8 bg-white border-y border-slate-200">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-slate-500 mb-6 uppercase tracking-wider">
          공식 파트너 브랜드
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="relative grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
              style={{ width: brand.width, height: brand.height }}
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={`${brand.name} 로고`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-4xl font-bold text-orange-600 tracking-wider">
                    {brand.text}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
