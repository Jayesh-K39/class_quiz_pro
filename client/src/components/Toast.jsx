function Toast({message}){
	return(
		<div className='text-white bg-black p-3 w-[70vw] max-w-sm flex self-center text-center justify-center absolute bottom-5 font-bold rounded-lg border-b-2 border-b-green-400'>
			{message}
		</div>
)
}
export default Toast
