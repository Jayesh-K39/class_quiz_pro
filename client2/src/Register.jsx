import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import EyeIcon from './icons/Eye'
import EyeSlash from './icons/EyeSlash'
import Shell from './components/ui/Shell'
import Panel from './components/ui/Panel'
import Input from './components/ui/Input'
import Button from './components/ui/Button'

function Register() {
	const navigate = useNavigate()
	useEffect(() => {
		document.title = 'Class Quiz Pro | Register'
	}, [])

	const [showpass, setShowPass] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirm] = useState('')
	const [email, setEmail] = useState('')

	async function handler(e) {
		e.preventDefault()
		const cleanedPassword = password.trim()
		const cleanedConfirm = confirmPassword.trim()
		const cleanedEmail = email.trim().toLowerCase()
		if (cleanedPassword !== cleanedConfirm) return toast.error('Passwords do not match');
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: cleanedEmail, password: cleanedPassword })
			})
			const data = await response.json()
			if (data.error) { toast.error(data.error); return; }
			toast.success('Account Created!')
			navigate('/login', { replace: true })
		} catch {
			toast.error('Server Error. Please Stand By...')
		}
	}
	return (
		<Shell>
			<Panel tone="solid" className="w-[90vw] max-w-md">
				<form className="flex flex-col gap-4" onSubmit={async e => await handler(e)}>
					<div className="text-center font-bold text-lg">Create Account</div>

					<Input
						type="email"
						id="email"
						autoComplete="email"
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="Enter your E-mail address here"
					/>

					<Input
						type={showpass ? 'text' : 'password'}
						id="password"
						required
						autoComplete="new-password"
						onChange={e => setPassword(e.target.value)}
						placeholder="Set a strong password for your account"
						trailing={
							<button type="button" className="cursor-pointer p-2 text-slate-400 hover:text-white" onClick={() => setShowPass(s => !s)}>
								{password ? showpass ? <EyeIcon /> : <EyeSlash /> : null}
							</button>
						}
					/>

					<Input
						type={showConfirm ? 'text' : 'password'}
						id="recheck"
						autoComplete="new-password"
						required
						onChange={e => setConfirm(e.target.value)}
						placeholder="Confirm your password"
						trailing={
							<button type="button" className="cursor-pointer p-2 text-slate-400 hover:text-white" onClick={() => setShowConfirm(s => !s)}>
								{confirmPassword ? showConfirm ? <EyeIcon /> : <EyeSlash /> : null}
							</button>
						}
					/>

					<Button type="submit" className="w-full">Confirm</Button>
				</form>
			</Panel>
		</Shell>
	)
}
export default Register
