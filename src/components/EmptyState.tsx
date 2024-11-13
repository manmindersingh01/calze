import { Ban, PlusCircle } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface iappprops {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}
export default function EmptyState({
  title,
  buttonText,
  href,
  description,
}: iappprops) {
  return (
    <div className="flex flex-col h-full items-center flex-1 justify-center rounded-md border border-dotted p-8 text-center animate-in fade-in-50">
      <div className=" flex justify-center items-center size-20 rounded-full bg-primary/10">
        <Ban className="size-10 text-primary " />
      </div>
      <h2 className="mt-4   text-sm">{title}</h2>
      <p className="mb-8 mt-2 text-sm text-muted-foreground mx-w-xs mx-auto">
        {description}
      </p>
      <Button asChild>
        <Link href={href}>
          <PlusCircle />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
}
