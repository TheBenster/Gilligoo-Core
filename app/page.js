import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-green-800 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-emerald-100 mb-6 drop-shadow-lg">
            The Closet Goblin Chronicles
          </h1>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto mb-8">
            Welcome, fellow creatures of shadow and commerce! Step into my
            humble closet kingdom where I document the sacred arts of goblin
            merchantry, the ancient codes we live by, and the delicate dance of
            staying hidden from human eyes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              Read My Chronicles
            </Link>
            <Link
              href="/lore"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              Explore Goblin Lore
            </Link>
            <Link
              href="/write"
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              New Chronicle
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-6 text-center border border-emerald-500">
            <h3 className="text-2xl font-bold text-emerald-300 mb-2">
              Merchant Level
            </h3>
            <p className="text-emerald-100 text-lg">Journeyman Trader</p>
            <p className="text-sm text-emerald-200 mt-2">
              47 successful closet transactions
            </p>
          </div>
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-6 text-center border border-amber-500">
            <h3 className="text-2xl font-bold text-amber-300 mb-2">
              Lore Mastery
            </h3>
            <p className="text-amber-100 text-lg">Ancient Keeper</p>
            <p className="text-sm text-amber-200 mt-2">
              Custodian of 127 sacred codes
            </p>
          </div>
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-6 text-center border border-purple-500">
            <h3 className="text-2xl font-bold text-purple-300 mb-2">
              Stealth Rating
            </h3>
            <p className="text-purple-100 text-lg">Shadow Master</p>
            <p className="text-sm text-purple-200 mt-2">
              Zero human detections this year!
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-6 border border-emerald-400">
            <h2 className="text-2xl font-bold text-emerald-300 mb-4">
              Latest Chronicles
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="text-emerald-200 font-semibold">
                  The Great Sock Heist of Tuesday
                </h4>
                <p className="text-emerald-100 text-sm">
                  A thrilling tale of midnight acquisitions...
                </p>
              </div>
              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="text-emerald-200 font-semibold">
                  Negotiating with Dust Bunnies
                </h4>
                <p className="text-emerald-100 text-sm">
                  Advanced diplomatic strategies for closet harmony...
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-6 border border-amber-400">
            <h2 className="text-2xl font-bold text-amber-300 mb-4">
              Sacred Wisdom
            </h2>
            <div className="space-y-3">
              <div className="border-l-4 border-amber-500 pl-4">
                <h4 className="text-amber-200 font-semibold">
                  Code #42: The Silent Footstep
                </h4>
                <p className="text-amber-100 text-sm">
                  Never let your footsteps echo in human halls...
                </p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4">
                <h4 className="text-amber-200 font-semibold">
                  Human Interference Protocol 7
                </h4>
                <p className="text-amber-100 text-sm">
                  What to do when they reorganize YOUR closet...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
