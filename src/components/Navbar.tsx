import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import AuthModel from "./AuthModel";

export default function Navbar() {
  return (
    <div className="w-full  p-3 flex items-center justify-between px-6 ">
      <h1 className="text-3xl font-semibold">calze</h1>
      <div className=" flex justify-center items-center gap-2">
        <AuthModel />

        <ModeToggle />
      </div>
    </div>
  );
}
