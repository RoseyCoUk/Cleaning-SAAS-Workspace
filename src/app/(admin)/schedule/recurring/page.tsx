import { redirect } from "next/navigation";

// This route has been consolidated into the main Schedule page
// Redirect to /schedule where users can toggle between Calendar View and Bookings Manager
export default function RecurringSchedulePage() {
  redirect("/schedule");
}
