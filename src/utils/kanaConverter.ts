/**
 * カタカナをひらがなに変換する
 * @param str 変換元の文字列
 * @returns ひらがなに変換された文字列
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

/**
 * ひらがなをカタカナに変換する
 * @param str 変換元の文字列
 * @returns カタカナに変換された文字列
 */
export function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

/**
 * 2つの文字列がカタカナ・ひらがなを区別せずに一致するかチェックする
 * @param str1 文字列1
 * @param str2 文字列2
 * @returns 一致する場合はtrue
 */
export function kanaInsensitiveMatch(str1: string, str2: string): boolean {
  const normalized1 = katakanaToHiragana(str1.toLowerCase());
  const normalized2 = katakanaToHiragana(str2.toLowerCase());
  return normalized1.includes(normalized2) || normalized2.includes(normalized1);
}

/**
 * 検索文字列が対象文字列に含まれるかをカタカナ・ひらがなを区別せずにチェックする
 * @param target 対象文字列
 * @param search 検索文字列
 * @returns 含まれる場合はtrue
 */
export function kanaInsensitiveIncludes(
  target: string,
  search: string,
): boolean {
  const normalizedTarget = katakanaToHiragana(target.toLowerCase());
  const normalizedSearch = katakanaToHiragana(search.toLowerCase());
  return normalizedTarget.includes(normalizedSearch);
}
