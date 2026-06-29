import Tick from '../icons/Tick'
import Cross from '../icons/Cross'
import MinusIcon from '../icons/MinusIcon'

function LeaderBoard({students,answers, correctOption, onlineCount}){
	const holder = `flex flex-col gap-3 p-3 bg-white rounded-md p-5 shadow 
	w-[90vw] max-w-2xl mx-auto text-black transition-all duration-[400ms] ease-in-out`
	if(!correctOption)return;
	const correctCount = Object.values(answers).filter(answer => answer === correctOption).length
	const wrongCount =  Object.values(answers).filter(answer => answer !== correctOption).length
	const unansweredCount = onlineCount - (correctCount + wrongCount)
	return(
		<div className={holder}>
			<div className='grid grid-cols-3 gap-3 mb-4'>
				<div className='flex flex-col items-center justify-center bg-green-300 rounded-md'>
					<div><Tick/></div>
					<div className='font-bold'>{correctCount}</div>
					<div>Correct</div>
				</div>

				<div className='flex flex-col items-center justify-center bg-red-300 rounded-md'>
					<div><Cross/></div>
					<div className='font-bold'>{wrongCount}</div>
					<div>Wrong</div>
				</div>

				<div className='flex flex-col items-center justify-center bg-gray-200 rounded-md'>
					<div><MinusIcon/></div>
					<div className='font-bold'>{unansweredCount}</div>
					<div>No Answer</div>
				</div>
			</div>

			<div className='flex justify-between items-center font-bold border-b mb-2 p-2'>
				<div>Status</div>
				<div>Name</div>
				<div>Score</div>
			</div>

			{
				Object.entries(students).sort((a,b) => b[1].score - a[1].score)
				.map( ([studentId, student]) =>{
					const answer = answers[studentId]
					return(
						<div key={studentId} 
						className={`flex justify-between items-center rounded-md p-2 
						${answer ? answer === correctOption ?'bg-green-300' :'bg-red-300' : 'bg-white'}`}>
							<span>{answer ? answer === correctOption ? <Tick/> : <Cross/>: <MinusIcon/>}</span>
							<span className='font-medium'>{student.name}</span>
							<span className='font-bold'>{student.score}</span>
						</div>
					)
				})
			}
		</div>
	)
}

export default LeaderBoard
