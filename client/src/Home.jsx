import {useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

function Home(){
 	const navigate = useNavigate()
    useEffect(()=>{
		document.title = 'Class Quiz Pro | Home'
	}, [])


	const bodyStyle = `min-h-screen bg-[#ca38cf] flex justify-center items-center`
	const card = `bg-white flex flex-col gap-2 rounded-xl p-6 w-[90vw] max-w-md`

	const divStyle = `w-full p-3 rounded-md text-center text-white font-bold cursor-pointer `
	return(
		<div className={bodyStyle}>
			<div className={card}>
				<div className='text-center font-bold'>Continue As:</div>
				<Link to='/teacher' className={`${divStyle} bg-blue-500  hover:bg-blue-600`}>
					Teacher
				</Link>

				<Link to='/join' className={`${divStyle} bg-green-500 hover:bg-green-600`}>
					Student
				</Link>
			</div>
		</div>
        )
}
export default Home
