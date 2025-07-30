import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuizBollen",
  description: "Svenska fotbollsquiz – varje dag!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body
        className={`
          ${inter.className}
           h-full
        `}
      >
        <div className="min-h-screen flex flex-col
          text-gray-100">
          <header className="sticky top-0 z-50 bg-gray-800/70 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
              <a
                href="/"
                className="text-2xl font-bold text-white flex items-center gap-2"
              >
                ⚽ QuizBollen
              </a>
              <nav className="flex gap-4 text-sm text-gray-300">
                <a href="/quizzes" className="hover:text-indigo-400 transition">
                  Alla quiz
                </a>
              </nav>
            </div>
          </header>


          <main className="max-w-6xl mx-auto px-6 py-12 flex-grow">{children}</main>

          <footer className="py-4 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} QuizBollen. Alla rättigheter förbehållna.
          </footer>
        </div>
      </body>
    </html>
  );
}
