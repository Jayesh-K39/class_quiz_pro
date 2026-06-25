import {useState, useEffect} from 'react'
import {useNavigate, Navigate} from 'react-router-dom'
function GuestRoute({children}){
	const [status, setStatus] = useState('checking')
	useEffect(()=>{
		(async ()=>{
			const token = localStorage.getItem('token')
			if(!token){
				setStatus('unauth')
				localStorage.removeItem('token')
				return
			}
			try{
				const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`, {
					method:'GET',
					headers:{'Authorization':`Bearer ${token}`}
				})
				if(!response.ok){
					setStatus('unauth')
					localStorage.removeItem('token')
					return
				}
				setStatus('authenticated')
			}
			catch{
				setStatus('unauth')
				localStorage.removeItem('token')
			}
		})()
	})

	if(status === 'checking')return null
	if(status === 'unauth') return children
	return <Navigate to='/controlroom' replace/>
}
export default GuestRoute
