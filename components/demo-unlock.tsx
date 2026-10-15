"use client";

import { useState } from "react";

export function DemoUnlock({ slug }: { slug: string }) {
  const [answer, setAnswer] = useState("");
  const [body, setBody] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function unlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    try {
      const response = await fetch(`/api/demo-posts/${slug}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("unlock");

      const contentResponse = await fetch(`/api/demo-posts/${slug}/content`, {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!contentResponse.ok) throw new Error("content");

      const content: { body: string } = await contentResponse.json();
      setBody(content.body);
      setAnswer("");
    } catch {
      setMessage("回答を確認できませんでした。もう一度お試しください。");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-base-300 bg-base-200/60 p-5 sm:p-8">
      <p className="badge badge-warning badge-outline">
        公開デモ / 秘密の保護には使えません
      </p>
      {body === null ? (
        <form className="mt-5 space-y-4" onSubmit={unlock}>
          <label htmlFor="demo-answer" className="label">
            <span className="label-text text-base">サンプル質問への回答</span>
          </label>
          <input
            id="demo-answer"
            className="input input-bordered min-h-12 w-full text-base"
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            autoComplete="off"
            required
            maxLength={256}
          />
          <button
            className="btn btn-outline min-h-11 rounded-full px-6"
            type="submit"
            disabled={pending}
          >
            {pending ? "確認中…" : "サンプル本文を表示"}
          </button>
          <p
            className="text-sm text-base-content/65"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        </form>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">サンプル本文</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed">{body}</p>
        </div>
      )}
    </section>
  );
}
