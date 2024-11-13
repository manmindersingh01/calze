"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface iAppType {
  text: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;

  clasName?: string;
}

export function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button className="w-full" disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-loader-circle animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Signing in...
        </Button>
      ) : (
        <Button
          variant={"outline"}
          className="w-full flex items-center justify-center"
        >
          <FaGoogle /> Sign in with google
        </Button>
      )}
    </>
  );
}

export function GithubSignInButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button className="w-full" disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-loader-circle animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Signing in...
        </Button>
      ) : (
        <Button
          variant={"outline"}
          className="w-full flex items-center justify-center"
        >
          <FaGithub /> Sign in with Github
        </Button>
      )}
    </>
  );
}

export function SubmitButton({ text, variant, clasName }: iAppType) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button className={cn("w-fit", clasName)} variant={variant}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-loader-circle animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          wait...
        </Button>
      ) : (
        <Button className={cn("w-fit", clasName)} variant={variant}>
          {text}
        </Button>
      )}
    </>
  );
}
