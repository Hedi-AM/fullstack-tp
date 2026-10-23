"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ContactContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <>
      <div>Contact page</div>
      <p>Ref: {ref ?? "none"}</p>
    </>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ContactContent />
    </Suspense>
  );
}