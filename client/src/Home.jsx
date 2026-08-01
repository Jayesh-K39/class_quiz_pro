import {useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import Bolt from './icons/Bolt'

export default function Home() {
  useEffect(()=>{
  	document.title = 'Class Quiz Pro | Home'
  })
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-between px-8">

        {/* Left Side */}
        <section className="max-w-xl">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-sm text-violet-300">
            ⚡ Real-time Quiz Platform
          </span>

          <h1 className="mt-6 text-6xl font-black tracking-tight">
            Class Quiz Pro
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Create engaging live quizzes for your classroom.
            Students join instantly using a room code while teachers
            control every question in real time.
          </p>

          <div className="mt-10 flex gap-4">
            <Link to='/teacher' className="rounded-xl bg-violet-600 px-8 py-4 font-semibold transition hover:bg-violet-500">
              Continue as Teacher
            </Link>

            <Link to='/join' className="rounded-xl border border-slate-600 px-8 py-4 font-semibold transition hover:bg-slate-800">
              Join Quiz
            </Link>
          </div>
        </section>

        {/* Right Side - Hidden on smaller screens*/}
        <section className="hidden lg:block">
          <div className="w-[430px] rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

            <div className="rounded-2xl bg-slate-900 p-5 shadow-xl">

              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">
                  Current Quiz
                </h2>

                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                  Live
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-400">
                  Question 4 of 10
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  Which data structure uses FIFO?
                </h3>
              </div>

              <div className="space-y-3">
                {["Stack", "Queue", "Tree", "Graph"].map((option) => (
                  <button
                    key={option}
                    className="w-full rounded-xl border border-slate-700 p-4 text-left transition hover:border-violet-500 hover:bg-violet-500/10"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
