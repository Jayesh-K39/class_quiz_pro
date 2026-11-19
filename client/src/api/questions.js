const API_URL = import.meta.env.VITE_API_URL
const authHeader = () => ({
	'Authorization': `Bearer ${localStorage.getItem('token')}`,
	'Content-Type':'application/json'
})

export const questionApi = {
	getQuestions: async (quizId) => {
		const response = await fetch(`${API_URL}/quizzes/${quizId}/questions`,{
			headers:authHeader()
		})
		if(!response.ok)throw new Error("Server Error. Please Stand By...")
		return response.json()
	},

	updateTitle: async (id, update)=>{
		try{
			const response = await fetch(`${API_URL}/questions/${id}`,{
				method:'PUT',
				headers:authHeader(),
				body:JSON.stringify({update})
			})
			if(!response.ok)throw new Error('Server Error. Please Stand By...')
		}catch(err){
			if(err.name === 'TypeError' || err.message === 'Failed to fetch')
				throw new Error('Server Error. Please Stand By...')
			throw err
		}
	},

	Delete:async (id)=>{
		try{
			const response = await fetch(`${API_URL}/questions/${id}`, {
				method:'DELETE',
				headers:authHeader()
			})
			if(!response.ok)throw new Error('Failed to delete the question')
		}catch(err){
			if(err.name === 'TypeError' || err.message === 'Failed to fetch')
				throw new Error('Server Error. Please Stand By...')
			throw err
		}
	},

	add: async (quizId, form)=>{
		try{
			const response = await fetch(`${API_URL}/quizzes/${quizId}/questions`, {
				method:'POST',
				headers:authHeader(),
				body:JSON.stringify(form)
			})
			const data = await response.json().catch(()=>null)
			if(!response.ok) throw new Error(data?.error || "Server Error. Please Stand By...")
			return data
		}catch(err){
			if(err.name === 'TypeError' || err.message === 'Failed to fetch') 
				throw new Error('Server Error. Please Stand By...')
			throw err
		}
	}
}
