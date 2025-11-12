/**
 * SEO設定の定数定義
 * サイト全体で使用するSEO関連の情報を一元管理
 */

export const SEO_CONFIG = {
  // サイト基本情報
  siteName: "ポケスリ個体値比較",
  siteNameEn: "Pokémon Sleep IV Comparator",
  siteUrl: "https://pokesleep-iv-comparator.vercel.app",

  // デフォルトのメタ情報
  defaultTitle: "ポケスリ個体値比較 - Pokémon Sleep IV Comparator",
  defaultDescription:
    "ポケモンスリープの個体値を簡単に比較できるツールです。複数のポケモンの個体値を一度に比較し、最適な育成を支援します。",

  // キーワード
  keywords: [
    "ポケモンスリープ",
    "Pokémon Sleep",
    "ポケスリ",
    "個体値",
    "IV",
    "比較",
    "ツール",
    "育成",
    "攻略",
  ],

  // 作成者情報
  author: "Asaki256",
  twitterHandle: "@Asaki256",

  // Open Graph画像
  ogImage: {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "ポケスリ個体値比較",
  },

  // Google Site Verification
  googleSiteVerification: "DVy7jur6OcUHxGHsiFBOh-eDqXQfSPK3odti0T0pR7w",
} as const;

/**
 * ページごとのSEO設定を生成するヘルパー関数
 */
export function generatePageSEO(options: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}) {
  const { title, description, path = "", image } = options;

  const fullUrl = `${SEO_CONFIG.siteUrl}${path}`;
  const pageTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;
  const pageDescription = description || SEO_CONFIG.defaultDescription;
  const pageImage = image
    ? `${SEO_CONFIG.siteUrl}${image}`
    : `${SEO_CONFIG.siteUrl}${SEO_CONFIG.ogImage.url}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: fullUrl,
      siteName: SEO_CONFIG.siteName,
      images: [
        {
          url: pageImage,
          width: SEO_CONFIG.ogImage.width,
          height: SEO_CONFIG.ogImage.height,
          alt: title || SEO_CONFIG.ogImage.alt,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: SEO_CONFIG.twitterHandle,
    },
  };
}
