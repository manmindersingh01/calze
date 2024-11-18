import { updateAvailabilityAction } from "@/app/actions";
import prisma from "@/app/lib/db";
import requireUser from "@/app/lib/hook";
import { times } from "@/app/lib/times";
import { SubmitButton } from "@/components/SubmitButtons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";
import React from "react";

const getData = async (id: string) => {
  const data = await prisma.availability.findMany({
    where: {
      user_id: id,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
};
export default async function Availability() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  console.log("data", data);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>
            Check your availability and book your calendar slots.
          </CardDescription>
        </CardHeader>
        <form action={updateAvailabilityAction}>
          <CardContent className="flex flex-col gap-y-4">
            {data.map((item) => (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
                key={item.id}
              >
                <input type="hidden" name={`id-${item.id}`} value={item.id} />
                <div className="flex items-center gap-x-3">
                  <Switch
                    name={`isActive-${item.id}`}
                    defaultChecked={item.isActive}
                  />
                  <p>{item.day}</p>
                </div>
                <Select
                  name={`fromTime-${item.id}`}
                  defaultValue={item.fromtime}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="From Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  name={`tillTime-${item.id}`}
                  defaultValue={item.tillTime}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="To Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <SubmitButton clasName="w-full" text="Save Changes" />
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
