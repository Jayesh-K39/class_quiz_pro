export default function Dropdown({question}){
	const options = [question.option_a, question.option_b, question.option_c, question.option_d]
	const correct = question.correct_option?.trim().toUpperCase()
	return(
		<div className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-300">
			<ol className='list-[upper-alpha] list-inside flex flex-col gap-1.5'>
			{options.map((opt, index)=>{
				const letter = String.fromCharCode(65+index)
				const isCorrect = letter === correct
					return(
						<li key={`${question.id}-${letter}-${index}`} 
						className={`flex items-center justify-between rounded-lg px-3 py-2 
						${isCorrect ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200': 'bg-black/20'}`}>
							<div className="flex min-w-0 items-center gap-2.5"> 
								<span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold  
								${isCorrect ? 'bg-emerald-500/20 text-emerald-300':'bg-white/10 text-slate-300'}`}>
									{letter}
								</span>
								<span className="break-words">{opt}</span>
							</div>
							{isCorrect && (
								<span className="shrink-0 text-xs font-medium text-emerald-400">
									Correct
								</span>
							)}
						</li>
					)
			})}
			</ol>
		</div>
	)
}
