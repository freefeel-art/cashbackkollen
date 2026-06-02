import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import {
  getGuideContent,
  getGuideSlugs,
  guideExists,
} from "@/lib/guides";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({
    slug,
  }));
}

export default async function GuidePage({
  params,
}: PageProps) {
  const { slug } = await params;

  if (!guideExists(slug)) {
    notFound();
  }

  const content = getGuideContent(slug);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <article>
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
