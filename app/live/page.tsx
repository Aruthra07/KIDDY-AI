import { redirect } from "next/navigation";

export default function LiveRedirect() {
  redirect("/learn?tab=live");
}
