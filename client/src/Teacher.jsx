import {useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

function Home(){
	const navigate = useNavigate()
	useEffect(()=>{
		document.title = 'Class Quiz Pro | Teacher'
	}, [])


	const bodyStyle = `min-h-screen bg-[#4c1d95] flex justify-center items-center`
	const card = `bg-white flex flex-col gap-2 rounded-xl p-6 w-[90vw] max-w-lg`

	const divStyle = `w-full p-3 rounded-md text-center text-white font-bold cursor-pointer `
	return(
		<div className={bodyStyle}>
			<div className={card}>
				<div className='text-center font-bold'>Class Quiz Pro - Teacher</div>
				<Link to='/register' className={`${divStyle} bg-blue-500  hover:bg-blue-600`}>
					Create account
				</Link>

				<Link to='/login' className={`${divStyle} bg-green-500 hover:bg-green-600`}>
					Login
				</Link>
			</div>
		</div>
	)
}
export default Home
