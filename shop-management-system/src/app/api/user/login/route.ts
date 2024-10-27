import { createSession } from "@/app/lib/session";

export async function GET(username: string, password: string) {
  console.log(username, password);

  const user = {};
  await createSession(user);
  return true;
}
