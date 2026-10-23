"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Child from "@/components/Child";

export default function Home() {
  const router = useRouter();
  const [states, setStates] = useState(["Tozeur", "Gafsa", "Tunis"]);
  const [chosen, setChosen] = useState("");
  const [newState, setNewState] = useState("");

  function gotoLogin() {
    router.push("/login");
  }

  function gotoContact() {
    router.push("/contact/123");
  }

  function goBack() {
    router.back();
  }

  // Exercise 5: add a new state to the list
  function addState() {
    const value = newState.trim();
    if (!value) return;
    setStates((prev) => [...prev, value]);
    setNewState("");
  }

  return (
    <>
      <div className="flex gap-2 p-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={gotoLogin}
        >
          Login Page
        </button>
        <button
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={gotoContact}
        >
          Contact Page
        </button>
        <button
          className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
          onClick={goBack}
        >
          Back
        </button>
      </div>

      <div className="p-4">
        <Child states={states} onSelect={setChosen} />
        <p>Selected: {chosen}</p>
        <div className="mt-2 flex gap-2">
          <input
            className="border px-2 py-1"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            placeholder="New state"
          />
          <button
            className="rounded bg-blue-500 px-4 py-1 text-white"
            onClick={addState}
          >
            Add state
          </button>
        </div>
      </div>
    </>
  );
}
