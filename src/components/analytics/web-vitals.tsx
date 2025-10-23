"use client";

import { useEffect } from "react";
import type { Metric } from "web-vitals";

// Small client to send Web Vitals to /api/rum with sampling
const SAMPLE_RATE = 0.5; // 50% sampling

/**
 * Send a single Web Vitals metric to the RUM endpoint.
 * @param metric Web Vitals metric
 */
function sendToAnalytics(metric: Metric): void {
  if (Math.random() > SAMPLE_RATE) return;

  type ConnectionLike = { effectiveType?: string };
  const nav: Navigator & { connection?: ConnectionLike } = navigator as Navigator & { connection?: ConnectionLike };

  const payload = {
    name: metric.name,
    id: metric.id,
    value: metric.value,
    label: "web-vital" as const,
    path: window.location.pathname,
    url: window.location.href,
    connection: nav.connection?.effectiveType,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    ua: navigator.userAgent,
    sampleRate: SAMPLE_RATE,
  };

  // Fire-and-forget; ignore failures
  navigator.sendBeacon?.(
    "/api/rum",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );
}

export function WebVitals(): null {
  useEffect(() => {
    (async () => {
      // web-vitals v5 removes FID in favor of INP. Support v5+ while staying
      // compatible if a future environment re-introduces or polyfills FID.
      interface WebVitalsAPI {
        onCLS(cb: (m: Metric) => void): void;
        onLCP(cb: (m: Metric) => void): void;
        onINP(cb: (m: Metric) => void): void;
        onTTFB(cb: (m: Metric) => void): void;
        onFID?: (cb: (m: Metric) => void) => void; // optional for backwards-compat
      }
      const mod = (await import("web-vitals")) as unknown as WebVitalsAPI;
      mod.onCLS(sendToAnalytics);
      if (typeof mod.onFID === "function") mod.onFID(sendToAnalytics);
      mod.onLCP(sendToAnalytics);
      mod.onINP(sendToAnalytics);
      mod.onTTFB(sendToAnalytics);
    })();
  }, []);

  return null;
}
