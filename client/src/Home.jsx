import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Badge from './components/ui/Badge'
import Panel from './components/ui/Panel'

function Home() {
	useEffect(() => {
		document.title = 'Class Quiz Pro | Home'
	}, [])

	return (
		<main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white">
			<div className="mx-auto flex min-h-screen max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:justify-between lg:py-0">

				{/* Left side */}
				<section className="max-w-xl text-center lg:text-left">
					<Badge tone="accent">⚡ Real-time Quiz Platform</Badge>

					<h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
						Class Quiz Pro
					</h1>

					<p className="mt-6 text-lg leading-8 text-slate-300">
						Create engaging live quizzes for your classroom.
						Students join instantly using a room code while teachers
						control every question in real time.
					</p>

					<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
						<Link
							to="/teacher"
							className="rounded-xl bg-violet-600 px-8 py-4 text-center font-semibold transition hover:bg-violet-500"
						>
							Continue as Teacher
						</Link>

						<Link
							to="/join"
							className="rounded-xl border border-slate-600 px-8 py-4 text-center font-semibold transition hover:bg-slate-800"
						>
							Join Quiz
						</Link>
					</div>
				</section>

				{/* Right side - preview card, hidden on smaller screens */}
				<section className="hidden lg:block">
					<Panel tone="glass" className="w-[430px] p-6">
						<div className="rounded-2xl bg-slate-900 p-5 shadow-xl">
							<div className="mb-5 flex items-center justify-between">
								<h2 className="font-semibold">Current Quiz</h2>
								<Badge tone="success">Live</Badge>
							</div>

							<div className="mb-6">
								<p className="text-sm text-slate-400">Question 4 of 10</p>
								<h3 className="mt-2 text-xl font-bold">
									Which data structure uses FIFO?
								</h3>
							</div>

							<div className="space-y-3">
								{['Stack', 'Queue', 'Tree', 'Graph'].map((option) => (
									<button
										key={option}
										type="button"
										className="w-full rounded-xl border border-slate-700 p-4 text-left transition hover:border-violet-500 hover:bg-violet-500/10"
									>
										{option}
									</button>
								))}
							</div>
						</div>
					</Panel>
				</section>

			</div>
		</main>
	)
}

export default Home
