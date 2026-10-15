import { checkBotId } from "botid/server";
import { cookies, headers } from "next/headers";
import { privateJson } from "@/lib/demo-gate";
import {
  allowDemoAttempt,
  demoSigningSecret,
  getDemoPost,
  verifyDemoAnswer,
} from "@/lib/demo-gate.server";
import { handleDemoUnlock } from "@/lib/demo-unlock-handler";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: Context) {
  const isBot = (await checkBotId()).isBot;
  if (isBot) return privateJson({ error: "Request denied." }, 403);

  const { slug } = await params;
  const secret = demoSigningSecret();
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const cookieStore = await cookies();

  return handleDemoUnlock(request, slug, {
    isBot,
    getPost: getDemoPost,
    allowAttempt: allowDemoAttempt,
    verifyAnswer: verifyDemoAnswer,
    signingSecret: secret,
    ip,
    setCookie: (name, value, options) => cookieStore.set(name, value, options),
  });
}
