export function renderCryptoIcon(params) {
  const symbol =
    params?.data?.symbol?.replace(/USDT$/i, "") ||
    params?.data?.symbol ||
    "CR";
  const encodedSymbol = encodeURIComponent(symbol);
  const placeholder = `https://ui-avatars.com/api/?name=${encodedSymbol}&background=111827&color=ffffff&bold=true`;
  const localIcon = `/icons/crypto_${params?.data?.id}.svg`;
  const src = params?.value || localIcon;
  return `<img class="cryptoIcon" src="${src}" onerror="this.onerror=null;this.src='${placeholder}'">`;
}
