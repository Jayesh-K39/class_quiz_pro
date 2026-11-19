import {useState, useEffect} from 'react'
import { useModal } from '../wrappers/ModalProvider'
import {questionApi} from '../api/questions'
import IconButton from './ui/IconButton'
import Button from './ui/Button'
import AddQuestionModal from './AddQuestionModal'
import Dropdown from './Dropdown'
import EditIcon from '../icons/EditIcon'
import DeleteIcon from '../icons/delIcon'
import {toast} from 'react-hot-toast'
import ChevDown from '../icons/ChevDown'
import ChevUp from '../icons/ChevUp'

export default function Questions({quiz}){
	const [loading, setLoading] = useState(true)
	const [questions, setQuestions] = useState([])
	const [isAddOpen, setIsAddOpen] = useState(false)
	const [expandedQid, setExpandedQid] = useState(null)
	const {confirm, prompt} = useModal()

	useEffect(()=>{
		if(!quiz?.id)return;

		let isMounted = true;
		setLoading(true)
		questionApi.getQuestions(quiz.id)
		.then(data => {
			if(isMounted) setQuestions(data.questions || [])
		})
		.catch(console.error)
		.finally(()=>{
			if(isMounted)setLoading(false);
		})
		return ()=> {isMounted = false;}
	}, [quiz?.id])

	async function editQuestion(qid, title){
		const newTitle = await prompt('Enter the updated question title here: ', title)
		if(typeof newTitle !== 'string' || !newTitle?.trim())return;
		try{
			await questionApi.updateTitle(qid, newTitle.trim())
			setQuestions(prev => prev.map(q => q.id === qid ? {...q, question_text:newTitle.trim()} : q))
		}catch(err){toast.error(err.message)}
	}

	async function deleteQuestion(qid, title){
		const confirmation = await confirm('Are you sure you want to delete this question? ', title)
		if(!confirmation)return;
		try{
			await questionApi.Delete(qid)
			setQuestions(prev => prev.filter(q => q.id !== qid))
		}catch(err){toast.error(err.message)}
	}

	function dropdown(qid){
		setExpandedQid((prevId)=> (prevId === qid ? null : qid))
	}
	
	return(
		<div className='flex flex-col gap-2 overflow-y-auto'>
			{questions.map((question, index)=>{
				const isOpen = expandedQid === question.id
				return(
					<div  key={question.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
						<div className="flex items-center gap-3">
					
							<span className="font-bold text-slate-400">Q.{index+1}</span>
							<span className="min-w-0 flex-1 break-words">{question.question_text}</span>
		
							<IconButton tone="danger" onClick={() => deleteQuestion(question.id, question.question_text)}>
								<DeleteIcon />
							</IconButton>
							
							<IconButton tone="accent" onClick={() => editQuestion(question.id, question.question_text)}>
								<EditIcon />
							</IconButton>
		
							<IconButton tone='accent' onClick={()=> dropdown(question.id)}
							aria-expanded={isOpen}>
								{isOpen ? <ChevUp/> : <ChevDown/>}
							</IconButton>
						</div>
						{isOpen && (
							<Dropdown question={question}/>
						)}
					</div>
				)

			})}
			<Button className="w-full" onClick={() => { setIsAddOpen(true) }}>+ Add a new question</Button>
			<AddQuestionModal
				quizId={quiz.id}
				isOpen={isAddOpen}
				onClose={()=>setIsAddOpen(false)}
				onQuestionCreated={(newQ) => setQuestions(prev => [...prev, newQ])}
			/>
		</div>
	)
}
