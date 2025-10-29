"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to expenses page with import modal parameter
    router.replace("/expenses?import=true");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to import...</p>
      </div>
    </div>
  );
}