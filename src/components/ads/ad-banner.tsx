"use client";

import { useEffect, useRef, useState } from "react";
import { AD_BANNER } from "@/lib/ads";

export function AdBanner({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / AD_BANNER.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const srcDoc = `<!doctype html><html><head><style>*{margin:0;padding:0;overflow:hidden}</style></head><body><script>atOptions=${JSON.stringify(
    {
      key: AD_BANNER.key,
      format: "iframe",
      height: AD_BANNER.height,
      width: AD_BANNER.width,
      params: {},
    },
  )};</script><script src="${AD_BANNER.invokeSrc}"></script></body></html>`;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: AD_BANNER.height * scale,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: AD_BANNER.width,
          height: AD_BANNER.height,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <iframe
          title="إعلان"
          srcDoc={srcDoc}
          width={AD_BANNER.width}
          height={AD_BANNER.height}
          scrolling="no"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
}
