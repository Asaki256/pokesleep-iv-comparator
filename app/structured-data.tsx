export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ポケスリ個体値比較",
    alternateName: "Pokémon Sleep IV Comparator",
    url: "https://pokesleep-iv-comparator.vercel.app",
    description:
      "ポケモンスリープの個体値を簡単に比較できるツールです。複数のポケモンの個体値を一度に比較し、最適な育成を支援します。",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    author: {
      "@type": "Person",
      name: "Asaki256",
    },
    inLanguage: "ja-JP",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
    featureList: [
      "ポケモンスリープ個体値比較",
      "複数ポケモン同時比較",
      "最適育成支援",
      "IV計算",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
