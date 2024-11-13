import prisma from "@/app/lib/db";
import requireUser from "@/app/lib/hook";
import { nylas, nylasConfig } from "@/app/lib/nylas";
import { redirect } from "next/navigation";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await requireUser();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.json("hey no code available ", {
      status: 400,
    });
  }

  try {
    const response = await nylas.auth.exchangeCodeForToken({
      code,
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId as string,
      redirectUri: nylasConfig.redirectUri,
    });

    const { grantId, email } = response;

    const data = await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        grandId: grantId,
        grantEmail: email,
      },
    });
  } catch (error) {
    console.log("error", error);
  }

  redirect("/dashboard");
}
