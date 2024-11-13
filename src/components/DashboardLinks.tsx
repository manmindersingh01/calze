"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaHome, FaUsers } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { IconType } from "react-icons/lib";

interface iAppsProps {
  id: number;
  name: string;
  href: string;
  icon: IconType;
}
export const dashboradLinks: iAppsProps[] = [
  {
    id: 1,
    name: "Events types",
    href: "/dashboard",
    icon: FaHome,
  },
  {
    id: 2,
    name: "Meetings",
    href: "/dashboard/meetings",
    icon: FaUsers,
  },
  {
    id: 3,
    name: "Availability",
    href: "/dashboard/availability",
    icon: FaListCheck,
  },
  {
    id: 4,
    name: "Settings",
    href: "/dashboard/settings",
    icon: IoIosSettings,
  },
];
export default function DashboardLinks() {
  const pathname = usePathname();
  return (
    <>
      {dashboradLinks.map((link) => (
        <Link
          className={cn(
            pathname == link.href
              ? " bg-primary"
              : "text-muted-foreground hover:text-foreground",
            "flex  p-3 rounded-lg justify-start items-center gap-2 transition-all "
          )}
          key={link.id}
          href={link.href}
        >
          <link.icon className="size-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
}
