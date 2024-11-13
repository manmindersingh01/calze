"use client";
import React from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

export default function CopyLinkMenu({ meetingUrl }: { meetingUrl: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("Url has been copied");
    } catch (error) {
      toast.error("could not copy url");
    }
  };
  return (
    <>
      <DropdownMenuItem onSelect={handleCopy}>
        <Link2 className="mr-2 size-4" />
        Copy
      </DropdownMenuItem>
    </>
  );
}
