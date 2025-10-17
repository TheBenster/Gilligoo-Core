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
          <footer style={{
            background: "var(--bg-secondary)",
            borderTop: "1px solid var(--border-color)"
          }} className="py-8">
            <div className="container mx-auto px-4 text-center">
              <p style={{ color: "var(--text-secondary)" }}>
                the closet goblin chronicles - documenting the art of shadow
                commerce since the dawn of wardrobes
              </p>
              <p style={{ color: "var(--text-tertiary)" }} className="text-sm mt-2">
                "stay hidden, trade wisely, respect the dust bunnies"
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
