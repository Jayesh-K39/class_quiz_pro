import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'

function Register(){
	const navigate = useNavigate()
	useEffect(()=>{
		document.title = 'Class Quiz Pro | Register'
	}, [])
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirm] = useState('')
	const [email, setEmail] = useState('') 
	const bodyStyle = `min-h-screen flex justify-center items-center 
	bg-[#ca38cf]`
	const inputStyle = `p-3 outline-none w-full border-b border-b-blue-500`
	const card = `bg-white flex flex-col gap-4 w-[90vw] max-w-md rounded-xl p-6`

	const btnStyle = `w-full bg-green-500 p-3 rounded-lg cursor-pointer`

	async function handler(e){
		e.preventDefault()
		const cleanedPassword = password.trim()
		const cleanedConfirm = confirmPassword.trim()
		const cleanedEmail = email.trim().toLowerCase()
		if(cleanedPassword !== cleanedConfirm)return toast.error('Passwords do not match');
		const response = await fetch(`${import.meta.env.VITE_API_URL}/register`,{
			method:'POST',
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({email:cleanedEmail, password:cleanedPassword})
		})
		const data = await response.json()
		if(data.error){toast.error(data.error);return;}
		navigate('/login', {replace:true})
	}
	return(
		<div className={bodyStyle}>
			<form className={card} onSubmit={async e=> await handler(e)}>
				<div className='text-center font-bold'>Create Account</div>
				<input type='email'
				id='email' 
				autoComplete='ON'
				required
				value={email}
				onChange={e=>setEmail(e.target.value)}
				className={inputStyle}
				placeholder='Enter your E-mail address here'/>

				<input type='password' 
				id='password' 
				required
				onChange={e=>setPassword(e.target.value)}
				className={inputStyle}
				placeholder='Set a strong password for your account'/>

				<input type='password' 
				id='recheck' 
				required
				onChange={e=>setConfirm(e.target.value)}
				className={inputStyle}
				placeholder='Confirm your password'/>

				<button type='submit' className={btnStyle}>Confirm</button>
			</form>
		</div>
	)
}
export default Register
