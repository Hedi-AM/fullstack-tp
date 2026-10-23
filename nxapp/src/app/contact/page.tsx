"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ContactContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [emailTouched, setEmailTouched] = useState(false);

  // Exercise 7: simple email validation
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page reload
    console.log("Form submitted:", formData);
  }

  return (
    <>
      <div className="p-4">Contact page</div>
      <p className="px-4">Ref: {ref ?? "none"}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => setEmailTouched(true)}
          placeholder="Email"
          required
        />
        {emailTouched && !emailValid && (
          <small className="text-red-600">Please enter a valid email address</small>
        )}
        <button type="submit" disabled={!formData.name || !formData.email}>
          Submit
        </button>
      </form>
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
