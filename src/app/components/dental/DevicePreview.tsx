/*
 * Desktop + phone presentation of real Kind Supply website work.
 * Screenshots are rendered from the client's own site build (no stock or
 * generated imagery) and served as AVIF with a WebP fallback.
 */

export type Shot = {
  avif: string;
  webp: string;
  /** Intrinsic width of each source, matching the order of avif/webp sets. */
  w: number;
};

export type ShotSet = {
  desktop: { small: Shot; large: Shot; width: number; height: number };
  mobile: { small: Shot; large: Shot; width: number; height: number };
};

function Picture({
  set,
  alt,
  sizes,
  eager,
  width,
  height,
  className,
}: {
  set: { small: Shot; large: Shot };
  alt: string;
  sizes: string;
  eager?: boolean;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${set.small.avif} ${set.small.w}w, ${set.large.avif} ${set.large.w}w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${set.small.webp} ${set.small.w}w, ${set.large.webp} ${set.large.w}w`} sizes={sizes} />
      <img
        src={set.large.webp}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        {...(eager ? { fetchpriority: "high" } : {})}
        className={className}
      />
    </picture>
  );
}

export function DevicePreview({
  shots,
  desktopAlt,
  mobileAlt,
  url,
  eager = false,
}: {
  shots: ShotSet;
  desktopAlt: string;
  mobileAlt: string;
  url?: string;
  eager?: boolean;
}) {
  return (
    <div className="relative pb-10 sm:pb-14 pr-6 sm:pr-14">
      {/* Browser frame */}
      <div className="border border-white/10 bg-[#131d32] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-3 px-4 h-9 border-b border-white/[0.07]" aria-hidden="true">
          <span className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/15" />
            <span className="w-2 h-2 rounded-full bg-white/15" />
            <span className="w-2 h-2 rounded-full bg-white/15" />
          </span>
          <span
            className="flex-1 max-w-[18rem] mx-auto text-center truncate text-white/45 bg-white/[0.04] px-3 py-0.5"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.02em" }}
          >
            {url}
          </span>
          <span className="w-10" />
        </div>
        <Picture
          set={shots.desktop}
          alt={desktopAlt}
          sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 92vw"
          eager={eager}
          width={shots.desktop.width}
          height={shots.desktop.height}
          className="block w-full h-auto"
        />
      </div>

      {/* Phone frame */}
      <div className="absolute right-0 bottom-0 w-[26%] min-w-[96px] max-w-[176px] rounded-[1.4rem] border border-white/15 bg-[#0a1120] p-[5px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="overflow-hidden rounded-[1.05rem]">
          <Picture
            set={shots.mobile}
            alt={mobileAlt}
            sizes="176px"
            eager={eager}
            width={shots.mobile.width}
            height={shots.mobile.height}
            className="block w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
