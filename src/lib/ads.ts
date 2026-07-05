const IDEVELOPIT_URL = "https://idevelopit.agency";

export function idevelopitLink(utmMedium: string, utmContent: string) {
  const params = new URLSearchParams({
    utm_source: "ramyanews",
    utm_medium: utmMedium,
    utm_campaign: "sponsorship",
    utm_content: utmContent,
  });
  return `${IDEVELOPIT_URL}?${params.toString()}`;
}

export const AD_BANNER = {
  key: "6d8558c951c213402c54fab70f55e8c8",
  width: 468,
  height: 60,
  invokeSrc:
    "https://www.highperformanceformat.com/6d8558c951c213402c54fab70f55e8c8/invoke.js",
};

export const NATIVE_BAR = {
  src: "https://pl30210030.effectivecpmnetwork.com/ff81d04a8be0dcae95c0bc10987ddd89/invoke.js",
  containerId: "container-ff81d04a8be0dcae95c0bc10987ddd89",
};

export const SMART_LINK_URL =
  "https://www.effectivecpmnetwork.com/vpe6gx93k1?key=91e723d283c4f5b779d906ccc3e9fe3d";

const AD_GATE_STORAGE_KEY = "rn-ad-gate-clicks";
const AD_GATE_CLICKS_REQUIRED = 3;

/**
 * Opens the smart link for the first N clicks across the whole site, then
 * lets `action` through and resets the counter for the next cycle.
 */
export function triggerAdGate(action: () => void) {
  const clicks = Number(window.localStorage.getItem(AD_GATE_STORAGE_KEY) ?? "0");

  if (clicks < AD_GATE_CLICKS_REQUIRED) {
    window.localStorage.setItem(AD_GATE_STORAGE_KEY, String(clicks + 1));
    window.open(SMART_LINK_URL, "_blank", "noopener,noreferrer");
    return;
  }

  window.localStorage.setItem(AD_GATE_STORAGE_KEY, "0");
  action();
}
