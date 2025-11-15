/**
 * PokeAPI関連のサービス関数
 */

// 画像URLをキャッシュするためのMap（メモリキャッシュ）
const imageCache = new Map<number, string | null>();

/**
 * PokeAPIのレスポンス型定義（必要な部分のみ）
 */
interface PokeAPIResponse {
  sprites: {
    front_default: string | null;
  };
}

/**
 * ポケモン番号から画像URLを取得する
 * @param pokemonNumber ポケモン図鑑番号
 * @returns 画像URL。取得できない場合はnull
 */
export async function fetchPokemonImage(
  pokemonNumber: number,
): Promise<string | null> {
  // キャッシュをチェック
  if (imageCache.has(pokemonNumber)) {
    return imageCache.get(pokemonNumber) ?? null;
  }

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`,
    );

    if (!response.ok) {
      console.error(`PokeAPI error: ${response.status} ${response.statusText}`);
      imageCache.set(pokemonNumber, null);
      return null;
    }

    const data: PokeAPIResponse = await response.json();
    const imageUrl = data.sprites.front_default;

    // キャッシュに保存
    imageCache.set(pokemonNumber, imageUrl);

    return imageUrl;
  } catch (error) {
    console.error(
      `Failed to fetch Pokemon image for #${pokemonNumber}:`,
      error,
    );
    // エラーの場合もキャッシュして、再試行を防ぐ
    imageCache.set(pokemonNumber, null);
    return null;
  }
}
