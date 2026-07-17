import ExitIcon from '../icons/ExitIcon'
import DeleteIcon from '../icons/delIcon'
export default function LogOut({setModal, email, logout, Delete}){
	const divStyle = `fixed inset-0 bg-black/60 flex items-center justify-center`
	const overlay = `bg-white rounded-md p-6 flex flex-col gap-3 w-[80vw] max-w-xl text-center`
	const btnStyle = `p-2 cursor-pointer border flex justify-center flex gap-3 hover:bg-red-500 transition duration-300 ease-in-out`
	return(
		<div className={divStyle} onClick={()=>setModal(false)}>
			<div className={overlay} onClick={e=>e.stopPropagation()}>
				<div className='font-bold'>Logged in as: {email}</div>
				<button  className={btnStyle} onClick={()=>logout()}>
					Logout <ExitIcon/>
				</button>

				<button className={btnStyle} onClick={Delete}> Delete Account <DeleteIcon/> </button>
			</div>
		</div>
	)
}
