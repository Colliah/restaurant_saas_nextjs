import z from "zod";

export const organizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  logo: z.string().url("Must be a valid URL"),
  keepCurrentActiveOrganization: z.boolean(),
});

export type organizationFormValue = z.infer<typeof organizationSchema>;
