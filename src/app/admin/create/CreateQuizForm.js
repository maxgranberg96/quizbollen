"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";
import { PlusSquare, Trash2, Loader2 } from "lucide-react";

function QuestionItem({ qi, control, register, errors, loading, lastRef }) {
  const { fields: opts, append: appendOpt, remove: removeOpt } = useFieldArray({
    control,
    name: `questions.${qi}.options`,
  });

  return (
    <div className="space-y-4 p-4 border border-gray-700 rounded bg-gray-800 text-white">
      {lastRef && <input ref={lastRef} type="hidden" />}

      <div>
        <label className="block text-sm font-medium">Frågetext *</label>
        <input
          {...register(`questions.${qi}.text`, { required: "Frågetext krävs" })}
          className={`mt-1 w-full border rounded px-3 py-2 bg-gray-900 text-white focus:outline-indigo-500 ${
            errors.questions?.[qi]?.text ? "border-red-500" : "border-gray-600"
          }`}
          disabled={loading}
        />
        {errors.questions?.[qi]?.text && (
          <p className="mt-1 text-red-400 text-sm">
            {errors.questions[qi].text.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Alternativ *</p>
        {opts.map((o, oi) => (
          <div key={o.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register(`questions.${qi}.options.${oi}.is_correct`)}
              disabled={loading}
            />
            <input
              {...register(`questions.${qi}.options.${oi}.text`, {
                required: "Alternativ krävs",
              })}
              placeholder={`Alternativ ${oi + 1}`}
              className={`flex-1 border rounded px-3 py-2 bg-gray-900 text-white focus:outline-indigo-500 ${
                errors.questions?.[qi]?.options?.[oi]?.text
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              disabled={loading}
            />
            {opts.length > 1 && (
              <button
                type="button"
                onClick={() => removeOpt(oi)}
                className="text-red-400 hover:text-red-600"
                disabled={loading}
                aria-label="Ta bort alternativ"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendOpt({ text: "", is_correct: false })}
          disabled={loading}
          className="flex items-center space-x-1 text-indigo-400 hover:underline mt-1"
        >
          <PlusSquare size={16} /> <span>Lägg till alternativ</span>
        </button>
      </div>
    </div>
  );
}

export default function CreateQuizForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [quizzesList, setQuizzesList] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      questions: [{ text: "", options: [{ text: "", is_correct: false }] }],
    },
  });

  const { fields: questions, append: appendQuestion, remove: removeQuestion } =
    useFieldArray({ control, name: "questions" });

  const lastQuestionRef = useRef(null);
  useEffect(() => { fetchQuizzes(); }, []);

  useEffect(() => {
    if (lastQuestionRef.current) {
      lastQuestionRef.current.focus();
    }
  }, [questions.length]);

  async function fetchQuizzes() {
    const { data, error } = await supabase
      .from("quizzes")
      .select("id, title, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    if (!error) setQuizzesList(data);
  }

  async function handleDelete(id) {
    if (!confirm("Är du säker på att du vill ta bort det här quizet?")) return;
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (!error) {
      setQuizzesList((prev) => prev.filter((q) => q.id !== id));
    } else {
      alert("Kunde inte ta bort quiz.");
    }
  }

  async function onSubmit(values) {
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");
    try {
      const { data: quiz, error: qErr } = await supabase
        .from("quizzes")
        .insert({
          title: values.title,
          description: values.description,
          category: values.category,
          is_public: true,
        })
        .select("id, title, created_at")
        .single();
      if (qErr) throw qErr;

      for (let i = 0; i < values.questions.length; i++) {
        const q = values.questions[i];
        const { data: question, error: quErr } = await supabase
          .from("questions")
          .insert({ quiz_id: quiz.id, text: q.text, order: i })
          .select("id")
          .single();
        if (quErr) throw quErr;

        const payload = q.options.map((o) => ({
          question_id: question.id,
          text: o.text,
          is_correct: Boolean(o.is_correct),
        }));
        const { error: oErr } = await supabase.from("options").insert(payload);
        if (oErr) throw oErr;
      }

      setSuccess(true);
      reset();
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      setErrorMsg("Kunde inte skapa quiz.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 p-6 bg-gray-900 text-white shadow rounded-lg border border-gray-700"
        noValidate
      >
        {success && (
          <div className="p-4 bg-green-800/40 text-green-300 rounded">
            Quiz skapades!
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-800/40 text-red-300 rounded">
            {errorMsg}
          </div>
        )}

        <fieldset className="space-y-4">
          <legend className="text-xl font-semibold">Quiz‑information</legend>
          <div>
            <label className="block text-sm font-medium">Titel *</label>
            <input
              {...register("title", { required: "Titel krävs" })}
              className={`mt-1 w-full border rounded px-3 py-2 bg-gray-800 text-white focus:outline-indigo-500 ${
                errors.title ? "border-red-500" : "border-gray-600"
              }`}
              disabled={loading}
            />
            {errors.title && (
              <p className="mt-1 text-red-400 text-sm">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Beskrivning</label>
            <textarea
              {...register("description")}
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-600 focus:outline-indigo-500"
              rows={2}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kategori</label>
            <input
              {...register("category")}
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-800 text-white border-gray-600 focus:outline-indigo-500"
              disabled={loading}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="text-xl font-semibold">Frågor</legend>
          {questions.map((q, qi) => (
            <QuestionItem
              key={q.id}
              qi={qi}
              control={control}
              register={register}
              errors={errors}
              loading={loading}
              lastRef={qi === questions.length - 1 ? lastQuestionRef : null}
            />
          ))}

          <button
            type="button"
            onClick={() => appendQuestion({ text: "", options: [{ text: "", is_correct: false }] })}
            disabled={loading}
            className="flex items-center space-x-1 text-indigo-400 hover:underline"
          >
            <PlusSquare size={20} /> <span>Lägg till fråga</span>
          </button>
        </fieldset>

        <div className="pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin mr-2" size={20} />}
            {loading ? "Skapar..." : "Skapa quiz"}
          </button>
        </div>
      </form>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Hantera befintliga quiz</h2>
        <ul className="space-y-2">
          {quizzesList.map((q) => (
            <li key={q.id} className="flex justify-between items-center p-4 bg-gray-800 text-white border border-gray-600 rounded">
              <span>{q.title}</span>
              <button
                onClick={() => handleDelete(q.id)}
                className="text-red-400 hover:text-red-600"
                disabled={loading}
              >
                Ta bort
              </button>
            </li>
          ))}
          {quizzesList.length === 0 && <p className="text-gray-400">Inga quiz att visa.</p>}
        </ul>
      </section>
    </div>
  );
}
