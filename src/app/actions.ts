"use server";

import prisma from "./lib/db";
import requireUser from "./lib/hook";
import { parseWithZod } from "@conform-to/zod";
import {
  eventTypeSchema,
  EventTypeServerSchema,
  onBoardingSchema,
  onBoardingSchemaValidation,
  settingSchema,
} from "./lib/zodeSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nylas } from "./lib/nylas";
export async function onboardAction(prev: any, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: onBoardingSchemaValidation({
      async isUsernameUnique() {
        const existingUserName = await prisma.user.findUnique({
          where: {
            username: formData.get("username") as string,
          },
        });
        return !existingUserName;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      username: submission.value.username,
      name: submission.value.fullName,
      availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              fromtime: "08:00",
              tillTime: "16:00",
            },
            {
              day: "Tuesday",
              fromtime: "08:00",
              tillTime: "16:00",
            },
            {
              day: "Wednesday",
              fromtime: "08:00",
              tillTime: "16:00",
            },
            {
              day: "Thursday",
              fromtime: "08:00",
              tillTime: "16:00",
            },
            {
              day: "Friday",
              fromtime: "08:00",
              tillTime: "16:00",
            },
            {
              day: "Saturday",
              fromtime: "08:00",
              tillTime: "16:00",
            },
            {
              day: "Sunday",
              fromtime: "08:00",
              tillTime: "16:00",
            },
          ],
        },
      },
    },
  });
  return redirect("/onboarding/grantid");
}

export async function settingAction(prevSatet: any, formData: FormData) {
  const session = await requireUser();
  const submission = parseWithZod(formData, {
    schema: settingSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const user = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.name,
      image: submission.value.image,
    },
  });

  return redirect("/dashboard");
}

export async function updateAvailabilityAction(formData: FormData) {
  const session = await requireUser();

  const rawData = Object.fromEntries(formData.entries());
  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");
      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        fromtime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            fromtime: item.fromtime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath("/dashboard/availability");
    //return { status: "success", message: "Availability updated successfully" };
  } catch (error) {
    console.error("Error updating availability:", error);
    // return { status: "error", message: "Failed to update availability" };
  }
}
export async function CreateEventTypeAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: EventTypeServerSchema({
      async isUrlUnique() {
        const data = await prisma.eventType.findFirst({
          where: {
            user_Id: session.user?.id,
            url: formData.get("url") as string,
          },
        });
        return !data;
      },
    }),

    async: true,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      user_Id: session.user?.id as string,
      videoCallingSoftware: submission.value.videoCallSoftware,
    },
  });

  return redirect("/dashboard");
}
export async function cancelMeetingAction(formData: FormData) {
  const session = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user?.id as string,
    },
    select: {
      grantEmail: true,
      grandId: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const data = await nylas.events.destroy({
    eventId: formData.get("eventId") as string,
    identifier: userData?.grandId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  revalidatePath("/dashboard/meetings");
}
export async function createMeetingAction(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      username: formData.get("username") as string,
    },
    select: {
      grantEmail: true,
      grandId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventTypeId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });

  const formTime = formData.get("fromTime") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const eventDate = formData.get("eventDate") as string;

  const startDateTime = new Date(`${eventDate}T${formTime}:00`);

  // Calculate the end time by adding the meeting length (in minutes) to the start time
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  await nylas.events.create({
    identifier: getUserData?.grandId as string,
    requestBody: {
      title: eventTypeData?.title,
      description: eventTypeData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: "Google Meet",
      },
      participants: [
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData?.grantEmail as string,
      notifyParticipants: true,
    },
  });

  return redirect(`/success`);
}
export async function editEventTypeAction(prevSatet: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: eventTypeSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.eventType.update({
    where: {
      id: formData.get("id") as string,
      user_Id: session.user?.id,
    },
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallingSoftware: submission.value.videoCallSoftware,
    },
  });
}
