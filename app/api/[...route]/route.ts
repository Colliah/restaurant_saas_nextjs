import app from "@/server/hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

export const GET = handle(app);
