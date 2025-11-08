"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  const [isLoading, setIsLoading] = useState(!!pokemonNumber);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // pokemonNumberがない場合は何もしない
    if (!pokemonNumber) {
      return;
    }

    // キャンセルフラグ
    let cancelled = false;

    // 状態をリセット（非同期で行い、レンダリング中のsetStateを回避）
    queueMicrotask(() => {
      if (!cancelled) {
        setIsLoading(true);
        setHasError(false);
        setImageUrl(null);
      }
    });

    // 画像を取得
    fetchPokemonImage(pokemonNumber)
      .then((url) => {
        if (!cancelled) {
          if (url) {
            setImageUrl(url);
          } else {
            setHasError(true);
          }
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to load Pokemon image:", error);
          setHasError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
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
    <Image
      src={imageUrl}
      alt={`Pokemon #${pokemonNumber}`}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      loading="lazy"
    />
  );
}
