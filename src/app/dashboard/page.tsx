import React from "react";
import requireUser from "../lib/hook";
import { notFound } from "next/navigation";
import prisma from "../lib/db";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ExternalLink,
  Link2,
  Pen,
  PlusCircle,
  Settings,
  Trash,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CopyLinkMenu from "@/components/CopyLinkMenu";

async function fetchData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      eventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      username: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function Dashboard() {
  const session = await requireUser();
  const data = await fetchData(session.user?.id as string);

  return (
    <>
      {data.eventType.length === 0 ? (
        <EmptyState
          title="You have no event types"
          description="You can create event types by clicking the button below"
          buttonText="Create Event Type"
          href="/dashboard/new"
        />
      ) : (
        <>
          <div className="flex justify-between items-center px-2">
            <div className="hidden sm:grid gap-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold">
                Event Types
              </h1>
              <p className="text-muted-foreground text-sm">
                Create and manage your events right here
              </p>
            </div>
            <Button asChild variant={"outline"}>
              <Link href="/dashboard/new">
                <PlusCircle />
                Create Event Type
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.eventType.map((val) => (
              <div
                key={val.id}
                className="overflow-hidden border shadow rounded-lg relative"
              >
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Settings className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Event</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={`/${data.username}/${val.url}`}>
                            <ExternalLink />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CopyLinkMenu
                            meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.username}/${val.url}`}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/event/${val.id}`}>
                            <Pen className="mr-2 size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash className="mr-2 size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link href={"/"} className="flex items-center p-5">
                  <div className="flex-shrink-0">
                    <FaUsers className="size-6" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-muted-foreground">
                        {val.duration} minutes meeting
                      </dt>
                      <dd className="text-lg font-medium">{val.title}</dd>
                    </dl>
                  </div>
                </Link>
                <div className="bg-muted px-5 py-3 flex justify-between items-center">
                  <Switch className="border border-black" />
                  <Button>Edit event</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
