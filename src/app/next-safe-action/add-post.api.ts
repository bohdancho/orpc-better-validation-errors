"use server";

import {
  createSafeActionClient,
  flattenValidationErrors,
} from "next-safe-action";
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

const action = createSafeActionClient();
export const addPost = action
  .schema(addPostActionSchema, {
    handleValidationErrorsShape: async (validationErrors) =>
      flattenValidationErrors(validationErrors).fieldErrors,
  })
  .action(async ({ parsedInput: { text, title } }) => {
    // Form action
    console.log("new post:", title, text);
  });
