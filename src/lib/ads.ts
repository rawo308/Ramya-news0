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
