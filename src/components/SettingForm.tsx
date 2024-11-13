"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitButton } from "./SubmitButtons";
import { useFormState } from "react-dom";
import { settingAction } from "@/app/actions";
import { any } from "zod";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingSchema } from "@/app/lib/zodeSchemas";
import Image from "next/image";
import { Button } from "./ui/button";
import { icons, X } from "lucide-react";
import { UploadButton, UploadDropzone } from "@/app/lib/uploadthing";

interface iAppType {
  name: string;
  email: string;
  username: string;
  image: string;
}
export default function settingForm({
  email,
  name,
  username,
  image,
}: iAppType) {
  const [lastResult, action] = useFormState(settingAction, undefined);
  const [currntProfileImage, setCurrentProfileImage] = useState(image);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handledeleteImage = () => {
    setCurrentProfileImage("");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account setting here</CardDescription>
      </CardHeader>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className=" flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Name</Label>
            <Input
              name={fields.name.name}
              key={fields.name.key}
              defaultValue={name}
              placeholder="Manminder singh"
            />
            <p className="text-xs text-red-900">{fields.name.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              disabled
              defaultValue={email}
              placeholder="mannu@gmail.com"
            />
          </div>
          <div>
            <Label className="grid gap-y-5">Profile Image</Label>
            <input
              type="hidden"
              name={fields.image.name}
              key={fields.image.key}
              value={currntProfileImage}
            />
            {currntProfileImage ? (
              <div className="relative">
                <img
                  src={currntProfileImage}
                  alt="profile image"
                  className="size-16 rounded-lg "
                />
                <Button
                  onClick={handledeleteImage}
                  size="icon"
                  className=" absolute -top-3 -left-3"
                >
                  <X />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Profil Image uploaded");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
                endpoint="imageUploader"
              />
            )}
            <p className="text-xs text-red-900">{fields.image.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="save changes" clasName="w-full " />
        </CardFooter>
      </form>
    </Card>
  );
}
