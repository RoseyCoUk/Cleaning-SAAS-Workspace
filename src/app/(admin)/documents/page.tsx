import type { Metadata } from "next";
import { DocumentsManager } from "@/components/cleaning/DocumentsManager";
import React from "react";

export const metadata: Metadata = {
  title: "Documents & Files | CleanPro",
  description: "Manage company documents and files",
};

export const dynamic = "force-dynamic";

export default function DocumentsPage() {
  return <DocumentsManager />;
}
