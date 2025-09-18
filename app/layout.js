import "./globals.css";
import { Inter } from "next/font/google";
import GoblinNavbar from "@/components/GoblinNavbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Closet Goblin Chronicles",
  description:
    "Tales from a goblin merchant dwelling in the shadows of human closets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <GoblinNavbar />
          <main>{children}</main>
          <footer className="bg-slate-900 border-t border-emerald-800 py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-emerald-300">
                The Closet Goblin Chronicles - Documenting the art of shadow
                commerce since the dawn of wardrobes
              </p>
              <p className="text-emerald-400 text-sm mt-2">
                "Stay hidden, trade wisely, respect the dust bunnies"
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
