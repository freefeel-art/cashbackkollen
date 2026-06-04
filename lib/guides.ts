import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type GuideMeta = {
  title: string;
  description: string;
};

export type GuideData = GuideMeta & {
  content: string;
};

export type GuideListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: Date;
};

export function getGuideSlugs() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""));
}

export function guideExists(slug: string) {
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.md`));
}

export function getGuideData(slug: string): GuideData {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    title: data.title ?? extractTitle(content, slug),
    description: data.description ?? extractDescription(content),
    content,
  };
}

// Category order controls both grouping and display sequence on /guider.
export const CATEGORY_ORDER = [
  "Cashback",
  "Butiker",
  "Kategoriöversikter",
  "Cashbackkort",
  "Recensioner",
  "Jämförelser",
  "Refunder",
  "Affiliate",
] as const;

export type Category = (typeof CATEGORY_ORDER)[number];

function inferCategory(slug: string, frontmatterCategory?: string): string {
  if (frontmatterCategory) return frontmatterCategory;
  if (slug.endsWith("-recension")) return "Recensioner";
  if (slug.includes("-vs-")) return "Jämförelser";
  if (slug.startsWith("cashback-pa-")) return "Kategoriöversikter";
  const storePatterns = [
    "zalando", "amazon", "apotea", "apotek-hjartat",
    "adlibris", "booking", "hotels-com", "cdon", "ellos", "lyko",
  ];
  if (storePatterns.some((p) => slug.startsWith(p) || slug.endsWith(p))) {
    return "Butiker";
  }
  if (slug.includes("refunder")) return "Refunder";
  const cardPatterns = [
    "cashbackkort", "kreditkort", "remember-flex",
    "bank-norwegian", "coop-mastercard", "basta-cashbackkort",
  ];
  if (cardPatterns.some((p) => slug.includes(p))) return "Cashbackkort";
  if (slug.includes("affiliate")) return "Affiliate";
  return "Cashback";
}

export function getAllGuides(): GuideListItem[] {
  const slugs = getGuideSlugs();

  const items: GuideListItem[] = slugs.map((slug) => {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    const date: Date = data.date
      ? new Date(data.date)
      : new Date(fs.statSync(filePath).mtime);

    return {
      slug,
      title: data.title ?? extractTitle(content, slug),
      excerpt: data.description ?? extractDescription(content),
      category: inferCategory(slug, data.category),
      date,
    };
  });

  // Newest first; alphabetical by title as tiebreaker.
  return items.sort((a, b) => {
    const timeDiff = b.date.getTime() - a.date.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.title.localeCompare(b.title, "sv");
  });
}

function extractTitle(content: string, slug: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractDescription(content: string): string {
  const lines = content.split("\n");
  let paragraph = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      if (paragraph) break;
      continue;
    }
    paragraph += (paragraph ? " " : "") + trimmed;
    if (paragraph.length >= 155) break;
  }

  const stripped = paragraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();

  return stripped.length > 155 ? stripped.slice(0, 154) + "…" : stripped;
}
