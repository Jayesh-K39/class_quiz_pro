import { useNavigate } from 'react-router-dom'
import { socket } from '../socket.js'
import { useModal } from '../wrappers/ModalProvider'
import Shell from './ui/Shell'
import Panel from './ui/Panel'
import Button from './ui/Button'
import Badge from './ui/Badge'

function Waiting() {
	const { confirm } = useModal()
	const navigate = useNavigate()
	async function leave() {
		const confirmation = await confirm('Are you sure you want to leave the quiz?')
		if (!confirmation) return;
		socket.disconnect()
		sessionStorage.clear()
		navigate('/join', { replace: true })
	}

	return (
		<Shell>
			<Panel className="w-[90vw] max-w-md text-center">
				<Badge tone="accent" className="mx-auto">⏳ Sit tight</Badge>
				<div className="mt-6 animate-pulse text-2xl font-bold">
					Waiting for the quiz to start...
				</div>
				<p className="mt-2 text-sm text-slate-400">
					Your teacher will start the first question shortly.
				</p>
				<Button variant="danger" className="mt-8 w-full" onClick={leave}>
					Leave Quiz
				</Button>
			</Panel>
		</Shell>
	)
}
export default Waiting
