import ExitIcon from '../icons/ExitIcon'
import DeleteIcon from '../icons/delIcon'
import Panel from './ui/Panel'
import Button from './ui/Button'

export default function LogOut({ setModal, email, logout, Delete }) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal(false)}>
			<Panel tone="solid" className="w-[80vw] max-w-xl text-center" onClick={e => e.stopPropagation()}>
				<div className="mb-4 font-bold">Logged in as: {email}</div>
				<div className="flex flex-col gap-3">
					<Button variant="secondary" className="flex items-center justify-center gap-3" onClick={() => logout()}>
						Logout <ExitIcon />
					</Button>

					<Button variant="danger" className="flex items-center justify-center gap-3" onClick={Delete}>
						Delete Account <DeleteIcon />
					</Button>
				</div>
			</Panel>
		</div>
	)
}
