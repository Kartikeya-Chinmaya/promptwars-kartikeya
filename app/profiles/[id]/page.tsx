import { Suspense } from "react";
import { ProfileDetail } from "./ProfileDetail";

export default function ProfileDetailPage() {
  return (
    <Suspense fallback={<main className="flex-1 max-w-5xl mx-auto px-6 py-12" />}>
      <ProfileDetail />
    </Suspense>
  );
}
