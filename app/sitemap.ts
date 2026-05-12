import type { MetadataRoute } from "next";

const SITE_URL = "https://artxpark.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Future routes — uncomment and extend when separate pages are added.
  // const routes = ["/about", "/products", "/team", "/contact"];
  // const additional: MetadataRoute.Sitemap = routes.map((path) => ({
  //   url: `${SITE_URL}${path}`,
  //   lastModified,
  //   changeFrequency: "monthly",
  //   priority: 0.7,
  // }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
