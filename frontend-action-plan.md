# Frontend Completion Plan (nextjsdemodash)
_Source of truth for the shared implementation roadmap. All section numbers map directly to the client transcript in `client-frontend-review.md`._

## 1. Scheduling & Arrival Workflow
1. **Recurring cadence presets**  
   - Add an explicit “Every 4 Weeks” radio option inside `RecurringSchedule.tsx`, backed by a helper that sets `frequency="custom"` and `interval=4` automatically.  
   - Surface a “One-off / Deep Clean / Move-out” toggle on the recurring clients panel (`schedule/recurring/page.tsx`) so the owner can quickly drill into non-recurring work.
2. **Arrival confirmation loop**  
   - Inject a “Confirm ETA” modal into `UpcomingAppointments.tsx` (or a new component) that captures arrival window + crew count.  
   - Persist confirmations in local state for now, but expose the data to `AutomatedMessaging.tsx` so managers can preview what will be sent.

## 2. Messaging & Notifications
1. **Template extensions**  
   - Add “Arrival Confirmation” and “Lunch Delay” templates to `AutomatedMessaging.tsx` (mirroring the client’s described texts).  
   - Include cadence selectors (e.g., “send at 7:00 AM on service day”) and a checkbox for “Require manual approval before send.”
2. **Manual approval queue**  
   - Create a lightweight “Pending Messages” table that lists scheduled texts/emails waiting on manager approval; hook it up to the toggle above.

## 3. CRM & Client Insights
1. **One-off tracking widget**  
   - Extend `CleaningMetrics.tsx` with a new card showing one-off / deep clean counts pulled from the mock data.  
   - Add quick filters to `AllClients.tsx` (`One-off`, `Deep Clean`, `Move-out`) so the owner can isolate those clients.
2. **Billing preferences**  
   - In `ClientCard.tsx`, add a collapsible “Billing Preferences” section (auto-send invoices yes/no, preferred payment method: cash, check, bank transfer).  
   - Use that state in the billing queue (next section) to determine whether an invoice should auto-send or create a reminder task.

## 4. Billing, Payments, & Cash Workflow
1. **Manual payment emphasis**  
   - Update `InvoiceManagement.tsx` and `PaymentTracking.tsx` so the primary CTA is “Send Payment Reminder” (cash/check) with templates referencing bank transfer instructions.  
   - Add “Record Cash”, “Record Check”, and “Record Bank Transfer” buttons that capture reference numbers and notes.
2. **Reminder scheduling**  
   - Introduce a reminder scheduler (per client) that can send 3-day/1-day notices via the messaging module.

## 5. Staff Operations (Roster, Time Clock, Payroll)
1. **Team grouping**  
   - Add an optional `team` field to the mock data and expose a “Team” filter + badges inside `TeamOverview.tsx`.  
   - Allow assigning staff to teams directly from the UI (modal).
2. **Time clock enhancements**  
   - Implement the 30‑minute unpaid lunch deduction: if a shift exceeds X hours, automatically reduce the total hours.  
   - Add statuses (`pending`, `approved`, `flagged`) to each entry plus a manager approval queue with inline edit controls.  
   - Track break entries so we can eventually send lunch-delay notifications.
3. **Pay rate overrides**  
   - Extend `TeamOverview.tsx` with an “Adjust Rate This Period” dialog that stores temporary rates + reasons.  
   - Update `PayrollJournal.tsx` to show base vs override rate and include override metadata in exports.

## 6. Portals (Staff + Client)
1. **Staff portal**  
   - Build a dedicated `/staff` layout mirroring the admin design system.  
   - MVP sections: Today’s route, time clock buttons (hooked to the same mock data), briefing checklist, quick links to payroll history.  
   - Optionally borrow TailAdmin’s `/field` layout structure for mobile responsiveness, but restyle to match nextjsdemodash.
2. **Client portal**  
   - Create `/client` layout with authentication placeholder.  
   - MVP sections: Next service details (with arrival confirmation), payment history + “Record payment sent” CTA, service history, document downloads.  
   - Use the same Billing Preferences data to personalize actions (e.g., show bank transfer instructions for cash/check clients).

## 7. Readiness Tasks Before Backend
1. **Mock data parity**  
   - Ensure all new fields (teams, overrides, billing prefs, confirmations) have seed data so the demo is consistent.  
2. **Dark-mode & accessibility audit**  
   - Run a quick pass on the new widgets to maintain the existing polish (button focus states, aria labels).  
3. **Documentation**  
   - Update the project README with a “frontend completion status” checklist tied to the transcript so backend work can reference the same requirements.

> **Collaboration hook:** Once the other agent publishes their markdown plan, we’ll reconcile both documents into a single canonical checklist (likely by merging into this file) and start execution in priority order.

