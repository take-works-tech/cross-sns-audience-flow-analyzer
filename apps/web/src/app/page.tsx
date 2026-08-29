import { redirect } from "next/navigation";

import { DEFAULT_PROJECT_ID } from "@/lib/mock/data";

export default function RootPage() {
  redirect(`/p/${DEFAULT_PROJECT_ID}`);
}
