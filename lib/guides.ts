import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getGuideSlugs() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""));
}

export function getGuideContent(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  return fs.readFileSync(filePath, "utf8");
}

export function guideExists(slug: string) {
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.md`));
}
