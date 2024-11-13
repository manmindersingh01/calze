"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormState } from "react-dom";
import { onboardAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onBoardingSchema } from "../lib/zodeSchemas";
import { SubmitButton } from "@/components/SubmitButtons";
export default function OnBoarding() {
  const [lastResult, action] = useFormState(onboardAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onBoardingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <>
      <div className="h-screen w-full justify-center flex items-center">
        <Card>
          <CardHeader>
            <CardTitle>
              Welcome to <span className="text-primary">calzer</span>{" "}
            </CardTitle>
            <CardDescription>
              We need information to setup your profile
            </CardDescription>
          </CardHeader>
          <form
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
            noValidate
          >
            <CardContent className="grid gap-y-5">
              <div className="grid gap-y-2">
                <Label>Name</Label>
                <Input
                  name={fields.fullName.name}
                  defaultValue={fields.fullName.initialValue}
                  placeholder="Manminder singh"
                  key={fields.fullName.key}
                />
                <p className="text-xs text-red-900">{fields.fullName.errors}</p>
              </div>
              <div className="grid gap-y-2">
                <Label>Username</Label>
                <div className="flex rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                    calzer.com/
                  </span>
                  <Input
                    name={fields.username.name}
                    defaultValue={fields.username.initialValue}
                    key={fields.username.key}
                    placeholder="mannu01"
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-red-900">{fields.username.errors}</p>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton
                clasName="w-full"
                text="Continue"
                variant={"default"}
              />
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
