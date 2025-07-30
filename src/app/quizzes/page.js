// app/quizzes/page.js
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function QuizzesPage({ searchParams }) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const params = await searchParams
  const category = params?.category || null;

  const { data: quizzes = [], error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) console.error(error);

  // Unika kategorier
  const categories = [...new Set(quizzes.map((q) => q.category || "Allmänt"))];

  // Filtrera om category finns i URL
  const filteredQuizzes = category
    ? quizzes.filter((q) => (q.category || "Allmänt") === category)
    : quizzes;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Titel + intro */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-indigo-300">Alla quiz</h1>
        <p className="text-gray-400 text-sm">
          Här hittar du hela vårt quizbibliotek.
        </p>
      </div>

      {/* Filtermeny */}
      <div className="flex flex-wrap gap-2 justify-center">
        <a
          href="/quizzes"
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            !category
              ? "bg-indigo-600 text-white"
              : "border-gray-600 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Alla kategorier
        </a>
        {categories.map((cat) => (
          <a
            key={cat}
            href={`/quizzes?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              category === cat
                ? "bg-indigo-600 text-white"
                : "border-gray-600 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {/* Quizkort: statisk 3-kolumners grid */}
      <div
        className="grid gap-6 sm:gap-8 lg:gap-12 justify-start"
        style={{ gridTemplateColumns: "repeat(3, 280px)" }}
      >
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((q) => (
            <a
              key={q.id}
              href={`/quiz/${q.id}`}
              className="group flex flex-col justify-between h-[160px] rounded-xl bg-gray-800/70 backdrop-blur-sm shadow hover:shadow-lg transition-transform duration-300 hover:scale-[1.02] overflow-hidden"
              style={{ width: "100%" }}
            >
              <div className="px-5 py-4">
                <h4 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {q.title}
                </h4>
                {q.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2 leading-snug">
                    {q.description}
                  </p>
                )}
              </div>
              <div className="bg-gray-700/80 px-5 py-3 mb-4 flex justify-between items-center text-xs text-gray-300">
                <span className="truncate">{q.category || "Allmänt"}</span>
                <span className="flex items-center gap-1">
                  {new Date(q.created_at).toLocaleDateString("sv-SE")}
                  <ArrowRight className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </div>
            </a>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-8">
            Inga quiz ännu. Kom tillbaka snart!
          </p>
        )}
      </div>
    </div>
  );
}
