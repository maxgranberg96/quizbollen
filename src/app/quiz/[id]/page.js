import { supabase } from "@/lib/supabase";
import QuizPlayer from "./quiz-player";

export default async function QuizPage({ params }) {
  const { id } = await params;

  const { data: quiz, error: qErr } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (!quiz) {
    return (
      <div className="text-center py-12 text-gray-400 text-lg">
        Quizet hittades inte.
      </div>
    );
  }

  const { data: questions, error: qsErr } = await supabase
    .from("questions")
    .select("*, options(*)")
    .eq("quiz_id", id)
    .order("order", { ascending: true });

  if (qsErr) {
    console.error(qsErr);
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            {quiz.description}
          </p>
        )}
      </div>
      <QuizPlayer quiz={quiz} questions={questions || []} />
    </div>
  );
}
