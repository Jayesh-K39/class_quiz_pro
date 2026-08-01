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
			<div className="mx-auto flex min-h-screen max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 py-16 ">

				<section className="max-w-xl text-center">
					<Badge tone="accent">⚡ Real-time Quiz Platform</Badge>

					<h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
						Class Quiz Pro
					</h1>

					<p className="mt-6 text-lg leading-8 text-slate-300">
						Create engaging live quizzes for your classroom.
						Students join instantly using a room code while teachers
						control every question in real time.
					</p>

					<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center ">
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
			</div>
		</main>
	)
}

export default Home
