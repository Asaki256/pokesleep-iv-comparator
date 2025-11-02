"use client";

import React, { useEffect, useState } from "react";
import { fetchPokemonImage } from "@/services/pokeApi";

interface PokemonImageProps {
  /** ポケモン図鑑番号 */
  pokemonNumber?: number;
  /** 画像のサイズ（px）デフォルトは40 */
  size?: number;
  /** CSSクラス名 */
  className?: string;
}

/**
 * ポケモンの画像を表示するコンポーネント
 * PokeAPIから画像を取得して表示します
 */
export default function PokemonImage({
  pokemonNumber,
  size = 40,
  className = "",
}: PokemonImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // pokemonNumberがない場合は何もしない
    if (!pokemonNumber) {
      setIsLoading(false);
      return;
    }

    // 状態をリセット
    setIsLoading(true);
    setHasError(false);
    setImageUrl(null);

    // 画像を取得
    fetchPokemonImage(pokemonNumber)
      .then((url) => {
        if (url) {
          setImageUrl(url);
        } else {
          setHasError(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load Pokemon image:", error);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pokemonNumber]);

  // ローディング中またはエラー時はスケルトンローダーを表示
  if (isLoading || hasError || !imageUrl) {
    return (
      <div
        className={`bg-gray-200 rounded animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // 画像を表示
  return (
    <img
      src={imageUrl}
      alt={`Pokemon #${pokemonNumber}`}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
}
