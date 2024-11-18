import prisma from "@/app/lib/db";
import requireUser from "@/app/lib/hook";
import SettingForm from "@/components/SettingForm";
import { notFound } from "next/navigation";
import React from "react";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      username: true,
      image: true,
    },
  });

  if (!data) {
    return notFound();
  }
  console.log(data);

  return data;
}

export default async function Page() {
  const session = await requireUser(); // Get the user session
  const data = await getData(session.user?.id as string); // Fetch data using the user ID

  return (
    <>
      <SettingForm
        name={data.name as string}
        email={data.email as string}
        username={data.username as string}
        image={data.image as string}
      />
    </>
  );
}

// const session = await requireUser();
//   const data = await getData(session.user?.id as string);
