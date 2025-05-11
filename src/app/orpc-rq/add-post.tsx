/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useORPC } from "./orpc-provider";

export function AddPost() {
  const orpc = useORPC();
  const { mutate, status, error } = useMutation(orpc.addPost.mutationOptions());

  return (
    <form
      action={async (form) => {
        const title = form.get("title") as any;
        const text = form.get("text") as any;
        mutate({ text, title });
      }}
      className="flex flex-col gap-2"
    >
      <FormField error={getValidationError(error, "title")}>
        <input
          name="title"
          placeholder="Title"
          className="border border-white p-2 rounded-2xl"
        />
      </FormField>
      <FormField error={getValidationError(error, "text")}>
        <textarea
          name="text"
          placeholder="Text"
          className="border border-white p-2 rounded-2xl"
        />
      </FormField>
      <button type="submit">Add post</button>
      {status === "success" && <p>Post added successfully!</p>}
    </form>
  );
}

interface FormFieldProps {
  children: React.ReactNode;
  error?: string | string[];
}

function FormField({ children, error }: FormFieldProps) {
  return (
    <div>
      {children}
      {error && typeof error === "string" && <p>{error}</p>}
      {error && Array.isArray(error) && error.map((e) => <p key={e}>{e}</p>)}
    </div>
  );
}

import { StandardBracketNotationSerializer } from "@orpc/openapi-client/standard";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeFormData(form: FormData): any {
  const serializer = new StandardBracketNotationSerializer();
  return serializer.deserialize(Array.from(form.entries()));
}

import type { SchemaIssue } from "@orpc/contract";
import { ORPCError, safe } from "@orpc/client";
import { isObject } from "@orpc/shared";
export function getValidationError(
  error: unknown,
  field: string,
): string | undefined {
  if (!isObject(error) && !(error instanceof ORPCError)) {
    return undefined;
  }

  if (!isObject(error.data) || !isStandardSchemaIssues(error.data.issues)) {
    return undefined;
  }

  const serializer = new StandardBracketNotationSerializer();

  for (const issue of error.data.issues) {
    if (issue.path === undefined) {
      return field === "" ? issue.message : undefined;
    }

    const issuePath = serializer.stringifyPath(
      issue.path.map((path) =>
        typeof path !== "object" ? path.toString() : path.key.toString(),
      ),
    );

    if (issuePath === field) {
      return issue.message;
    }
  }
}

function isStandardSchemaIssues(issues: unknown): issues is SchemaIssue[] {
  const isPropertyKey = (value: unknown): value is PropertyKey => {
    const type = typeof value;
    return type === "string" || type === "number" || type === "symbol";
  };

  const isPathSegment = (value: unknown) => {
    return isObject(value) && "key" in value && isPropertyKey(value.key);
  };

  if (!Array.isArray(issues)) {
    return false;
  }

  return issues.every((issue): issue is SchemaIssue => {
    if (!isObject(issue)) {
      return false;
    }

    if (!("message" in issue && typeof issue.message === "string")) {
      return false;
    }

    if ("path" in issue && issue.path !== undefined) {
      const path = issue.path;

      if (!Array.isArray(path)) {
        return false;
      }

      if (!path.every(isPropertyKey) && !path.every(isPathSegment)) {
        return false;
      }
    }

    return true;
  });
}
