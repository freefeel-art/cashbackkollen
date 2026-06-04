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
