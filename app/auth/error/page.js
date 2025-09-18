"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error) => {
    switch (error) {
      case "AccessDenied":
        return "Access denied. Only the Grand Goblin Merchant may enter these halls.";
      case "Configuration":
        return "Authentication configuration error.";
      default:
        return "An unexpected error occurred during authentication.";
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4 border border-red-800">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-300 mb-2">
          Access Forbidden
        </h1>
        <p className="text-red-400">
          {getErrorMessage(error)}
        </p>
      </div>

      <div className="text-center space-y-4">
        <p className="text-emerald-400 text-sm">
          These sacred archives are protected by ancient goblin magic.
        </p>

        <div className="space-y-2">
          <Link
            href="/"
            className="block bg-emerald-700 hover:bg-emerald-600 text-emerald-100 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Return to Chronicles
          </Link>

          <Link
            href="/auth/signin"
            className="block bg-slate-600 hover:bg-slate-500 text-emerald-100 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-800 flex items-center justify-center">
      <Suspense fallback={
        <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4 border border-red-800">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-300 mb-2">Access Forbidden</h1>
            <p className="text-red-400">Loading...</p>
          </div>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}