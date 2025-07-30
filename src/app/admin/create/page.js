import { redirect } from "next/navigation";
import CreateQuizForm from "./CreateQuizForm";

export default async function AdminCreatePage({ searchParams }) {
  const params = await searchParams;
  const secret = params.secret;

  if (secret !== process.env.ADMIN_SECRET) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-white ">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-300 mb-2">
          🛠️ Skapa ett quiz
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Fyll i formuläret nedan för att skapa ett nytt quiz.
        </p>
      </div>

      <CreateQuizForm />
    </div>
  );
}
