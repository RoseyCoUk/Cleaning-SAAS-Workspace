import { redirect } from "next/navigation";

// This route has been consolidated into the main Staff Portal
// Redirect to /staff where the Today tab contains all clock-in/job functionality
export default function StaffClockPage() {
  redirect("/staff");
}
