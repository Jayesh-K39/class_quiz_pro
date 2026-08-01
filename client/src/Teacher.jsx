import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Shell from './components/ui/Shell'
import Panel from './components/ui/Panel'

function Teacher() {
	useEffect(() => {
		document.title = 'Class Quiz Pro | Teacher'
	}, [])

	return (
		<Shell>
			<Panel className="w-[90vw] max-w-md text-center">
				<div className="mb-2 font-bold text-lg">Class Quiz Pro — Teacher</div>
				<p className="mb-6 text-sm text-slate-400">
					Sign in to manage your quizzes, or create a new account.
				</p>

				<div className="flex flex-col gap-3">
					<Link
						to="/register"
						className="w-full rounded-xl border border-slate-600 p-3 text-center font-semibold transition hover:bg-slate-800"
					>
						Create account
					</Link>

					<Link
						to="/login"
						className="w-full rounded-xl bg-violet-600 p-3 text-center font-semibold transition hover:bg-violet-500"
					>
						Login
					</Link>
				</div>
			</Panel>
		</Shell>
	)
}

export default Teacher
