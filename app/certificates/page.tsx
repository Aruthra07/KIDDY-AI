import { redirect } from "next/navigation";

export default function CertificatesRedirect() {
  redirect("/learn?tab=certificates");
}
