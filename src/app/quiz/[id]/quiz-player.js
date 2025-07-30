"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizPlayer({ quiz, questions }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const router = useRouter();

  if (!questions.length) {
    return <div className="text-gray-300">Inga frågor finns i detta quiz.</div>;
  }

  const question = questions[idx];
  const correctOpt = question.options.find((o) => o.is_correct);

  function submitAnswer(opt) {
    if (picked) return;
    const isCorrect = opt.is_correct;
    setPicked(opt.id);
    setScore((s) => s + (isCorrect ? 1 : 0));
    setHistory((h) => [
      ...h,
      {
        question: question.text,
        chosen: opt.text,
        correct: correctOpt?.text || "",
        isCorrect,
      },
    ]);
  }

  function goNext() {
    if (idx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  }

  if (finished) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="p-6 rounded-xl border border-gray-700 bg-gray-800 text-center shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-white">Klart!</h2>
          <p className="text-lg text-gray-300">
            Du fick <strong>{score}/{questions.length}</strong> poäng.
          </p>
        </div>
        <div className="space-y-4">
          {history.map((h, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border text-sm ${
                h.isCorrect
                  ? "bg-green-900/20 border-green-500 text-green-300"
                  : "bg-red-900/20 border-red-500 text-red-300"
              }`}
            >
              <p className="font-medium text-white">{i + 1}. {h.question}</p>
              <p className="mt-1">
                Ditt svar: <span className="font-semibold">{h.chosen}</span>
              </p>
              {!h.isCorrect && (
                <p className="mt-1">
                  Rätt svar: <span className="font-semibold text-green-300">{h.correct}</span>
                </p>
              )}
              <p className="mt-1 font-semibold">
                {h.isCorrect ? '✅ Rätt!' : '❌ Fel'}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            🔁 Spela fler quiz
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.floor(((idx + 1) / questions.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Fråga {idx + 1}/{questions.length}</span>
        <span>Poäng: {score}</span>
      </div>

      <div className="p-6 rounded-xl border border-gray-700 bg-gray-800 shadow-md">
        <h3 className="font-semibold text-xl mb-4 text-white">{question.text}</h3>
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isPicked = picked === opt.id;
            const correct = isPicked && opt.is_correct;
            const wrong = isPicked && !opt.is_correct;
            return (
              <button
                key={opt.id}
                onClick={() => submitAnswer(opt)}
                disabled={!!picked}
                className={`w-full text-left px-4 py-3 rounded-lg border transition text-white ${
                  !picked
                    ? 'hover:bg-gray-700 border-gray-600'
                    : correct
                    ? 'bg-green-900/20 border-green-500 text-green-300'
                    : wrong
                    ? 'bg-red-900/20 border-red-500 text-red-300'
                    : 'opacity-50 border-gray-600'
                }`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className="mt-4 space-y-2 text-center">
            {picked === correctOpt?.id ? (
              <p className="text-green-300 font-semibold">✅ Rätt!</p>
            ) : (
              <p className="text-red-300 font-semibold">
                ❌ Fel. Rätt svar: <span className="font-semibold">{correctOpt?.text}</span>
              </p>
            )}
            <button
              onClick={goNext}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {idx + 1 === questions.length ? 'Visa resultat' : 'Nästa fråga'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
