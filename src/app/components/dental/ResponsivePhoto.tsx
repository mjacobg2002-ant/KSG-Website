import type { Photo } from "./westparkMedia";

/*
 * <picture> with AVIF → WebP fallback. Pass `art` to swap to a different crop
 * at a breakpoint (art direction), e.g. a portrait crop on desktop and a wide
 * crop on phones.
 */
export function ResponsivePhoto({
  photo,
  sizes,
  className = "",
  eager = false,
  art,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  eager?: boolean;
  art?: { media: string; photo: Photo; sizes: string };
}) {
  const set = (p: Photo, fmt: "avif" | "webp") => p.sources.map((s) => `${s[fmt]} ${s.w}w`).join(", ");
  const largest = photo.sources[photo.sources.length - 1];
  return (
    <picture className="block w-full h-full">
      {art ? (
        <>
          <source media={art.media} type="image/avif" srcSet={set(art.photo, "avif")} sizes={art.sizes} />
          <source media={art.media} type="image/webp" srcSet={set(art.photo, "webp")} sizes={art.sizes} />
        </>
      ) : null}
      <source type="image/avif" srcSet={set(photo, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set(photo, "webp")} sizes={sizes} />
      <img
        src={largest.webp}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        {...(eager ? { fetchpriority: "high" } : {})}
        className={className}
      />
    </picture>
  );
}
