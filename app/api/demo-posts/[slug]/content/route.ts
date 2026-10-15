import { cookies } from "next/headers";
import { handleDemoContentRequest } from "@/lib/demo-content-handler";
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
  return handleDemoContentRequest(
    slug,
    async (cookieName) => (await cookies()).get(cookieName)?.value,
    demoSigningSecret(),
    {
      getPost: getDemoPost,
      verifyToken: validDemoToken,
    },
  );
}
