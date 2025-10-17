"use client";

import { useSession } from "next-auth/react";

export default function DebugSession() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Session Debug Info
        </h1>

        <div className="card mb-4">
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
            Status: {status}
          </h2>
        </div>

        {session ? (
          <>
            <div className="card mb-4">
              <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                User Object
              </h2>
              <pre className="text-sm overflow-auto" style={{ color: "var(--text-secondary)" }}>
                {JSON.stringify(session.user, null, 2)}
              </pre>
            </div>

            <div className="card mb-4">
              <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                Full Session
              </h2>
              <pre className="text-sm overflow-auto" style={{ color: "var(--text-secondary)" }}>
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div className="card mb-4">
              <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                ID Check
              </h2>
              <div style={{ color: "var(--text-secondary)" }}>
                <p><strong>Your ID:</strong> {session.user?.id}</p>
                <p><strong>ID Type:</strong> {typeof session.user?.id}</p>
                <p><strong>Expected ID:</strong> 105664089</p>
                <p><strong>String Match:</strong> {String(session.user?.id) === "105664089" ? "✅ YES" : "❌ NO"}</p>
                <p><strong>Number Match:</strong> {Number(session.user?.id) === 105664089 ? "✅ YES" : "❌ NO"}</p>
                <p><strong>Is Admin:</strong> {session.user?.isAdmin ? "✅ YES" : "❌ NO"}</p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                Environment Check
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Check your server console for ADMIN_GITHUB_ID value
              </p>
            </div>
          </>
        ) : (
          <div className="card">
            <p style={{ color: "var(--text-secondary)" }}>Not logged in</p>
          </div>
        )}
      </div>
    </div>
  );
}
