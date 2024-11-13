import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { BUILD_ID_FILE } from "next/dist/shared/lib/constants";
import { signIn } from "@/app/lib/auth";
import { GithubSignInButton, GoogleSignInButton } from "./SubmitButtons";

export default function AuthModel() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try for free</Button>
      </DialogTrigger>
      <DialogContent className="sm:mx-w-[360px]">
        <DialogHeader>
          <h1 className="text-3xl font-semibold">calze</h1>
        </DialogHeader>
        <div className="flex flex-col mt-5 gap-2">
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <GoogleSignInButton />
          </form>
          <form
            action={async () => {
              "use server";

              await signIn("github");
            }}
          >
            <GithubSignInButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
