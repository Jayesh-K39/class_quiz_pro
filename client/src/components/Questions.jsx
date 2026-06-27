import {useState, useEffect} from 'react'
import DeleteIcon from '../icons/delIcon'
import BackIcon from '../icons/BackIcon'
import EditIcon from '../icons/EditIcon'
import {useModal} from '../wrappers/ModalProvider'

function Questions({quiz, onBack}){
	const {confirm, prompt} = useModal()
	const [form, setForm] = useState({question_text:'',option_a:'',option_b:'',option_c:'',option_d:'',correct_option:'A'})
	const [questions, setQuestions] = useState([])
	const [show, setShow] = useState(false)
	const holder = `w-[90vw] max-w-2xl bg-white rounded-md flex flex-col gap-2 p-6`
	const divStyle = `flex items-center gap-3 bg-gray-300 hover:bg-gray-400 rounded-md p-3 cursor-pointer`
	const btnStyle = `w-full p-3 bg-green-500 rounded-md cursor-pointer hover:bg-green-600`
	const helpBtn = 'w-8 h-8 rounded-md flex items-center justify-center shrink-0 cursor-pointer'
	const Input = `border-b border-b-blue-500 outline-none p-3`
	
	async function getQuestions(){
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${quiz.id}/questions`,{
			method:'GET',
			headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
		})
		if(!response.ok)return;
		const data = await response.json()
		setQuestions(data.questions)
	}

	async function addQuestion(e){
		e.preventDefault()
		const response = await fetch(`${import.meta.env.VITE_API_URL}/quizzes/${quiz.id}/questions`, {
			method:'POST',
			headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`},
			body:JSON.stringify({question_text:form.question_text, option_a:form.option_a, option_b:form.option_b, 
			option_c:form.option_c, option_d:form.option_d, correct_option:form.correct_option})
		})
		if(!response.ok)return;
		await getQuestions()
		setForm({question_text:'',option_a:'',option_b:'',option_c:'',option_d:'',correct_option:'A'})
		setShow(false)
	}

	async function deleteQuestion(id, title){
		const confirmation = await confirm(`Are you sure you want to delete this question: '${title}' ?`)
		if(!confirmation)return;
		const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/${id}`, {
			method:'DELETE',
			headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
		})
		if(!response.ok)return;
		getQuestions()
	}

	async function editQuestion(id){
		const question = questions.find(q => q.id === id)
		const update = await prompt('Enter the updated question title here: ', question.question_text)
		if(!update?.trim())return
		const response = await fetch(`${import.meta.env.VITE_API_URL}/questions/${id}`, {
			method:'PUT',
			headers:{'Content-Type':'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`},
			body:JSON.stringify({update})
		})
		if(!response.ok)return;
		getQuestions()
	}

	function handler(e){ setForm({...form, [e.target.name]:e.target.value}) }
	useEffect(()=>{getQuestions()},[])

	return(
		<div className={holder}>
			<div className='text-center font-bold p-3 relative'>
				{quiz.title}
				<button onClick={onBack} className='absolute left-2 cursor-pointer'><BackIcon/></button>
			</div>
			{questions.map((question, index)=>(
				<div key={question.id} className={divStyle}>
					<span className='font-bold'>Q{index+1}.</span>
					<span className='flex-1 break-words'>{question.question_text}</span>
					<button className={`${helpBtn} hover:bg-red-500`} onClick={()=>deleteQuestion(question.id, question.question_text)}>
						<DeleteIcon/>
					</button>

					<button className={`${helpBtn} hover:bg-blue-400`} onClick={()=>editQuestion(question.id)}>
						<EditIcon/>
					</button>

				</div>
			))}
			<button className={btnStyle} onClick={()=>{setShow(true)}}>+ Add a new question</button>


			{show && (
			  <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
	  		    <form className='bg-white rounded-xl p-6 w-[90vw] max-w-lg flex flex-col gap-3' 
	  		    onSubmit={async (e)=>await addQuestion(e)}>
			    	<div className='text-center font-bold'>Adding a new question</div>
			    	<input value={form.question_text} name='question_text' className={Input} placeholder='Enter question text here'required onChange={handler}/>
			    	<input value={form.option_a} name='option_a' className={Input} placeholder='Enter option A' required 
			    	onChange={handler}/>

			    	<input value={form.option_b} name='option_b' className={Input} placeholder='Enter option B' required 
			    	onChange={handler}/>

			    	<input value={form.option_c} name='option_c' className={Input} placeholder='Enter option C' required 
			    	onChange={handler}/>

			    	<input value={form.option_d} name='option_d' className={Input} placeholder='Enter option D' required 
			    	onChange={handler}/>


					<div className='flex justify-between items-center p-3'>
						<label htmlFor='selector'>Select the correct option here:</label>
			    		<select id='selector' name='correct_option' className='outline-none' value={form.correct_option} onChange={handler} required>
			    			<option value='A'>A</option>
			    			<option value='B'>B</option>
			    			<option value='C'>C</option>
			    			<option value='D'>D</option>
			    		</select>
			    	</div>

			    	<button type='submit' className={btnStyle}>Done</button>
			    </form>
			  </div>
			)}
		</div>
	)
}
export default Questions
