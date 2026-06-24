import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://j4sistema.com.br";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/servicos`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/servicos/desenvolvimento-web`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/servicos/aplicativos-mobile`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/servicos/sistemas-sob-medida`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/servicos/consultoria-ti`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const blogPosts = [
    { url: `${baseUrl}/blog/como-escolher-empresa-desenvolvimento-software`, lastModified: new Date("2026-06-15"), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog/tendencias-desenvolvimento-web-2026`, lastModified: new Date("2026-06-10"), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog/quanto-custa-desenvolver-aplicativo-mobile`, lastModified: new Date("2026-06-05"), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  return [...staticPages, ...blogPosts];
}