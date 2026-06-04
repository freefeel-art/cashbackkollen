import type { Metadata } from "next";
import { getAllGuides, CATEGORY_ORDER } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guider om cashback och återbäring",
  description:
    "Guider om cashback, cashbackkort, affiliate-marknadsföring och hur du får tillbaka pengar på dina köp.",
};

export default function GuiderPage() {
  const guides = getAllGuides();

  // Group into a Map keyed by CATEGORY_ORDER so the order is guaranteed.
  const grouped = new Map<string, typeof guides>(
    CATEGORY_ORDER.map((cat) => [cat, []])
  );
  for (const guide of guides) {
    const bucket = grouped.get(guide.category) ?? grouped.get("Cashback")!;
    bucket.push(guide);
  }

  // Remove empty categories so no headings appear without articles.
  const sections = CATEGORY_ORDER.filter(
    (cat) => (grouped.get(cat)?.length ?? 0) > 0
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Guider</h1>
      <p className="text-xl text-gray-600 mb-12">
        {guides.length} guider om cashback, cashbackkort, butiker och
        affiliate-marknadsföring.
      </p>

      <div className="space-y-16">
        {sections.map((category) => {
          const articles = grouped.get(category)!;
          return (
            <section key={category}>
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">
                {category}
                <span className="ml-2 text-base font-normal text-gray-400">
                  ({articles.length})
                </span>
              </h2>

              <ul className="space-y-8">
                {articles.map((guide) => (
                  <li key={guide.slug}>
                    <a
                      href={`/guider/${guide.slug}`}
                      className="text-lg font-medium hover:underline"
                    >
                      {guide.title}
                    </a>
                    <p className="mt-1 text-gray-600 text-sm leading-relaxed">
                      {guide.excerpt}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
