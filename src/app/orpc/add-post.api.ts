"use server";

import { os } from "@orpc/server";
import { z } from "zod";
import { zfd } from "zod-form-data";

const addPostActionSchema = zfd.formData({
  title: zfd.text(
    z
      .string()
      .min(5, "Title must be at least 5 characters long.")
      .max(50, "Title can be at most 50 characters long."),
  ),
  text: zfd.text(
    z
      .string()
      .min(10, "Text must be at least 10 characters long.")
      .max(500, "Text can be at most 500 characters long."),
  ),
});

export const addPost = os
  .errors({
    RATE_LIMIT_EXCEEDED: {
      data: z.object({ retryAfter: z.number() }),
    },
  })
  .input(addPostActionSchema)
  .handler(async ({ input: { title, text } }) => {
    console.log("orpc new post:", title, text);
    return "success";
  })
  .actionable();
