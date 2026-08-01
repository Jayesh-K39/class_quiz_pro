import Tick from '../icons/Tick'
import Cross from '../icons/Cross'
import MinusIcon from '../icons/MinusIcon'
import Panel from './ui/Panel'

function LeaderBoard({ students, answers, correctOption, onlineCount }) {
	if (!correctOption) return;
	const correctCount = Object.values(answers).filter(answer => answer === correctOption).length
	const wrongCount = Object.values(answers).filter(answer => answer !== correctOption).length
	const unansweredCount = onlineCount - (correctCount + wrongCount)
	return (

		<Panel tone="solid" className="w-[90vw] max-w-2xl transition-all duration-[400ms] ease-in-out">
			<div className="mb-4 grid grid-cols-3 gap-3">
				<div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-3 text-emerald-300">
					<Tick />
					<div className="text-lg font-bold">{correctCount}</div>
					<div className="text-sm">Correct</div>
				</div>

				<div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3 text-rose-300">
					<Cross />
					<div className="text-lg font-bold">{wrongCount}</div>
					<div className="text-sm">Wrong</div>
				</div>

				<div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300">
					<MinusIcon />
					<div className="text-lg font-bold">{unansweredCount}</div>
					<div className="text-sm">No Answer</div>
				</div>
			</div>

			<div className="mb-2 flex items-center justify-between border-b border-white/10 p-2 font-bold text-slate-400">
				<div>Status</div>
				<div>Name</div>
				<div>Score</div>
			</div>

			<div className="flex flex-col gap-2">
				{
					Object.entries(students).sort((a, b) => b[1].score - a[1].score)
						.map(([studentId, student]) => {
							const answer = answers[studentId]
							const tone = answer ? (answer === correctOption ? 'border-emerald-500/30 bg-emerald-500/15' : 'border-rose-500/30 bg-rose-500/15') : 'border-white/10 bg-white/5'
							return (
								<div key={studentId}
									className={`flex items-center justify-between rounded-xl border p-3 ${tone}`}>
									<span>{answer ? answer === correctOption ? <Tick /> : <Cross /> : <MinusIcon />}</span>
									<span className="font-medium">{student.name}</span>
									<span className="font-bold">{student.score}</span>
								</div>
							)
						})
				}
			</div>
		</Panel>
	)
}

export default LeaderBoard
