import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

function Login(){
	const navigate = useNavigate()
	useEffect(()=>{
		document.title = 'Class Quiz Pro | Teacher Login'
	}, [])

	const bodyStyle = `min-h-screen bg-[#ca38cf] flex flex-col items-center justify-center gap-4`
	const holderStyle = `bg-white flex flex-col gap-4 rounded-xl p-6 
	w-[90vw] max-w-md`

	const inputStyle = `w-full outline-none p-3 h-1/5`

	const btnStyle = `w-full bg-green-500 hover:bg-green-600 rounded-lg p-3 cursor-pointer`
	const [error, setError] = useState('')

	const [email,setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	async function login(e){
		e.preventDefault()
		try{
			const response = await fetch(`${import.meta.env.VITE_API_URL}/login`,
			{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify({email, password})
			})
			const data = await response.json()
			if(data.error){setError(data.error);return}
			localStorage.setItem('token', data.token)
			navigate('/controlroom', {replace:true})
		}
		catch{
			setError("Server Error.Please Stand By...")
		}
	}
	return(
		<div className={bodyStyle}>
			<form className={holderStyle} 
			onSubmit={async e=>await login(e)}>

				<div className='text-center font-bold'>LOGIN</div>

				<input name='email'
				value={email} 
				type='email' 
				autoComplete='on' 
				required
				onChange={e=>setEmail(e.target.value)}
				placeholder='Enter your e-mail ID here: ' 
				className={inputStyle} 
				/>


				<input name='password' 
				value={password}
				type='password'
				required
				onChange={e=>setPassword(e.target.value)}
				placeholder='Enter the password for this app: '
				className={inputStyle} 
				/>

				<button type='submit' className={btnStyle}>Enter</button>
			</form>

			<div className='text-white font-bold'>{error}</div>
		</div>
	)
}

export default Login
