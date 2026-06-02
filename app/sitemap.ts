import { MetadataRoute } from "next";
import { getGuideSlugs } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cashbackkollen.se";

  const guides = getGuideSlugs().map((slug) => ({
    url: `${baseUrl}/guider/${slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/guider`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/recensioner`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/butiker`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kampanjer`,
      lastModified: new Date(),
    },
    ...guides,
  ];
}
