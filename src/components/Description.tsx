function Description() {
  return (
    <div className="px-4 pt-6 pb-2 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto">
      <div className="text-sm text-muted-foreground text-center">
        <p>
          ポケモンスリープの個体値を比較することを目的としたアプリです。
          <br />
          計算方法や推定値は
          <a
            href="https://wikiwiki.jp/poke_sleep/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            ポケモンスリープ攻略・検証Wiki
          </a>
          を参考にしています。
        </p>
      </div>
    </div>
  );
}

export default Description;
