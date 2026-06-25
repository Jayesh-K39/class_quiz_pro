import {useState, useEffect} from 'react'
import {Navigate} from 'react-router-dom'

function Protection({children}){
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
				const response = await fetch(`${import.meta.env.VITE_API_URL}/verify`,
				{
					method:'GET',
					headers:{'Authorization':`Bearer ${token}`}
				})
				if(!response.ok){
					localStorage.removeItem('token')
					setStatus('unauth')
					return
				}
				setStatus('authenticated')
			}catch{
				localStorage.removeItem('token')
				setStatus('unauth')
			}
		})()
	}, [])

	if(status === 'checking') return null
	if(status === 'unauth') return <Navigate to='/' replace />
	return children
}

export default Protection
