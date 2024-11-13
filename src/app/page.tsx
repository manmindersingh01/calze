import Image from "next/image";
import { auth } from "./lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Logos } from "@/components/Logos";
import { Features } from "@/components/Features";
import { Testimonial } from "@/components/Testimonial";
import { CTA } from "@/components/Cta";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div>
      <Navbar />
      <Hero />
      <Logos />
      <Features />
      <Testimonial />
      <CTA />
    </div>
  );
}
