import type { Metadata } from "next";

import { SeasonAdmin } from "@/components/admin/SeasonAdmin";

export const metadata: Metadata = {
  title: "Matchs & Stats — Admin",
  robots: { index: false, follow: false },
};

export default function AdminSeasonPage() {
  return <SeasonAdmin />;
}
