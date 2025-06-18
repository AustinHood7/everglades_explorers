"use client"; // Required for client-side hooks like `useRouter`

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navigateToQuiz = () => {
    router.push("/question"); // Navigate to the 'question' page
  };

  return (
    <div
      className="font-poppins h-[100dvh] bg-cover bg-center flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: "url('/backdrop.png')", 
      }}
    >
      <div className="flex flex-col gap-4 rounded-lg absolute top-[30%] left-[30%]">
        <div className="backdrop-blur-md rounded-lg p-2">
        <div className="text-6xl font-bold text-zinc-100">
          <h1>Minds In</h1>
          <h1>Motion</h1>
        </div>
        <span className="text-xl text-zinc-400 pt-4">Use your skills to fix this brain! </span>
        </div>


        <button
          onClick={navigateToQuiz} // Attach the navigation function
          className="rounded-xl bg-accent text-white w-max py-2 px-4 font-semibold text-lg mt-3"
        >
          Take the Quiz
        </button>
      </div>
    </div>
  );
}
