"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSkeleton />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
