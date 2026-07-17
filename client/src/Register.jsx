import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import EyeIcon from './icons/Eye'
import EyeSlash from './icons/EyeSlash'

function Register(){
	const navigate = useNavigate()
	useEffect(()=>{
		document.title = 'Class Quiz Pro | Register'
	}, [])

	const [showpass, setShowPass] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirm] = useState('')
	const [email, setEmail] = useState('') 
	const bodyStyle = `min-h-screen flex justify-center items-center bg-[#4c1d95]`
	const inputStyle = `p-3 outline-none border-b border-b-blue-500 flex-1`
	const card = `bg-white flex flex-col gap-4 w-[90vw] max-w-xl rounded-xl p-6`
	const divStyle = `flex items-center`
	const btnStyle = `w-full bg-green-500 p-3 rounded-lg cursor-pointer`

	async function handler(e){
		e.preventDefault()
		const cleanedPassword = password.trim()
		const cleanedConfirm = confirmPassword.trim()
		const cleanedEmail = email.trim().toLowerCase()
		if(cleanedPassword !== cleanedConfirm)return toast.error('Passwords do not match');
		try{
			const response = await fetch(`${import.meta.env.VITE_API_URL}/register`,{
				method:'POST',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify({email:cleanedEmail, password:cleanedPassword})
			})
			const data = await response.json()
			if(data.error){toast.error(data.error);return;}
			navigate('/login', {replace:true})
		}catch{
			toast.error('Server Error. Please Stand By...')
		}
	}
	return(
		<div className={bodyStyle}>
			<form className={card} onSubmit={async e=> await handler(e)}>
				<div className='text-center font-bold'>Create Account</div>
				<input type='email'
				id='email' 
				autoComplete='email'
				required
				value={email}
				onChange={e=>setEmail(e.target.value)}
				className={inputStyle}
				placeholder='Enter your E-mail address here'/>

				<div className={divStyle}>		
					<input 
					type={showpass ? 'text' : 'password'}
					id='password' 
					required
					autoComplete='new-password'
					onChange={e=>setPassword(e.target.value)}
					className={inputStyle}
					placeholder='Set a strong password for your account'
					/>

					<button type='button' className='p-2 cursor-pointer' onClick={()=>setShowPass(s => !s)}>
						{password ? showpass ? <EyeIcon/>: <EyeSlash/> : null}
					</button>
				</div>

				<div className={divStyle}>
					<input 
					type={showConfirm ?'text' : 'password'} 
					id='recheck' 
					autoComplete='new-password'
					required
					onChange={e=>setConfirm(e.target.value)}
					className={inputStyle}
					placeholder='Confirm your password'
					/>

					<button type='button' className='p-2 cursor-pointer' onClick={()=>setShowConfirm(s => !s)}>
						{confirmPassword ? showConfirm ? <EyeIcon/>: <EyeSlash/> : null}
					</button>
				</div>

				<button type='submit' className={btnStyle}>Confirm</button>
			</form>
		</div>
	)
}
export default Register
