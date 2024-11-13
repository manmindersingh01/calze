import DashboardLinks from "@/components/DashboardLinks";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { IoLogOut } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";
import requireUser from "../lib/hook";
import { auth, signOut } from "../lib/auth";
import Link from "next/link";
import prisma from "../lib/db";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
      grandId: true,
    },
  });
  if (!data?.username) {
    return redirect("/onboarding");
  }
  if (!data.grandId) {
    return redirect("/onboarding/grantid");
  }
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireUser();

  const data = await getData(session?.user?.id as string);
  return (
    <>
      <div className=" min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden md:block border-r  bg-muted/40">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <h1 className="text-2xl font-semibold text-primary">calze</h1>
            </div>
            <div className="flex-1">
              <nav className="grid items-start px-2 lg:px-4">
                <DashboardLinks />
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <header className="h-14 bg-muted/40 flex items-center justify-end gap-4 border-b lg:h-[60px] lg:px-6 p-2 md:p-0 ">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"outline"} className="md:hidden shrink-0">
                  <IoMenu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col" side={"left"}>
                <nav className="grid gap-2 mt-10">
                  <DashboardLinks />
                </nav>
              </SheetContent>
            </Sheet>

            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"secondary"}
                  size={"icon"}
                  className="rounded-full"
                >
                  <img
                    src={session?.user?.image as string}
                    alt="profile"
                    height={20}
                    width={20}
                    className="w-full h-full rounded-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={"/dashboard/settings"}>Setting</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form
                    action={async () => {
                      "use server";

                      await signOut();
                    }}
                    className="w-full"
                  >
                    <button className="w-full text-left  bg-transparent">
                      Logout
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 Lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
