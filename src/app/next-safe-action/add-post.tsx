// AddPost.tsx

"use client";

import { useAction } from "next-safe-action/hooks";

import { addPost } from "./add-post.api";

export function AddPost() {
  const { execute: executeAddPost, result, hasSucceeded } = useAction(addPost);

  return (
    <form action={executeAddPost} className="flex flex-col gap-2">
      <FormField error={result.validationErrors?.title}>
        <input
          name="title"
          placeholder="Title"
          className="border border-white p-2 rounded-2xl"
        />
      </FormField>
      <FormField error={result.validationErrors?.text}>
        <textarea
          name="text"
          placeholder="Text"
          className="border border-white p-2 rounded-2xl"
        />
      </FormField>
      <button type="submit">Add post</button>
      {hasSucceeded && <p>Post added successfully!</p>}
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
