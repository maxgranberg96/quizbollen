import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const cookieStore = await cookies(); // 👈 måste awaitas
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) console.error(error);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="inline-block text-6xl mb-4 animate-bounce text-indigo-400">⚽</div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3">
          Välkommen till QuizBollen
        </h2>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
          Utmana dig själv och dina vänner med våra fotbollsquiz! Testa dina
          kunskaper i svensk och internationell fotboll direkt i webbläsaren.
        </p>
      </section>

      {/* Quiz List */}
      <section className="px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold mb-6 text-indigo-300 text-center">
          Tillgängliga quiz
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {quizzes?.map((q) => (
                    <a
                        key={q.id}
                        href={`/quiz/${q.id}`}
                        className="group flex flex-col justify-between h-[160px] rounded-xl bg-gray-800/70 backdrop-blur-sm shadow hover:shadow-lg transition-transform duration-300 hover:scale-[1.02] overflow-hidden"
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
                ))}
          {(!quizzes || quizzes.length === 0) && (
            <p className="text-gray-400 col-span-full text-center py-8">
              Inga quiz ännu. Kom tillbaka snart!
            </p>
          )}
        </div>
        <div className="text-center mt-8">
          <a
            href="/quizzes"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition shadow-md"
          >
            🔍 Se alla quiz →
          </a>
        </div>
      </section>
    </div>
  );
}
