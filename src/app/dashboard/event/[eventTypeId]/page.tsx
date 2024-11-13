import prisma from "@/app/lib/db";
import EditEventTypeForm from "@/components/EditEventTypeForm";
import { log } from "console";
import { notFound } from "next/navigation";
import React from "react";
async function GetData(eventTypeId: string) {
  const data = await prisma.eventType.findUnique({
    where: {
      id: eventTypeId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      url: true,
      videoCallingSoftware: true,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}
export default async function EditRoute({
  params,
}: {
  params: {
    eventTypeId: string;
  };
}) {
  const data = await GetData(params.eventTypeId);
  console.log("hgashdj", data);

  return (
    <>
      <EditEventTypeForm
        id={data.id}
        description={data.description}
        url={data.url}
        title={data.title}
        videoCallingSoftware={data.videoCallingSoftware}
        duration={data.duration}
      />
    </>
  );
}
