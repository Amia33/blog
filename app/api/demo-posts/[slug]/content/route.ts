import { cookies } from "next/headers";
import {
  demoContentCookieName,
  handleDemoContent,
} from "@/lib/demo-content-handler";
import {
  demoSigningSecret,
  getDemoPost,
  validDemoToken,
} from "@/lib/demo-gate.server";

type Context = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const token = (await cookies()).get(demoContentCookieName(slug))?.value;
  return handleDemoContent(slug, token, demoSigningSecret(), {
    getPost: getDemoPost,
    verifyToken: validDemoToken,
  });
}
