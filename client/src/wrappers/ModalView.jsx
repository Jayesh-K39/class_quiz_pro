import { useState } from 'react'
import Panel from '../components/ui/Panel'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function ModalView({ modal, onClose }) {
	const [value, setValue] = useState(modal.defaultValue ?? '');
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
			<Panel tone="solid" className="flex w-[80vw] max-w-md flex-col gap-4">
				<p className="min-w-0 break-words font-bold text-gray-300">{modal.message}</p>
				{modal.type === 'prompt' && (
					<Input
						name="promptInput"
						value={value}
						onChange={(e) => setValue(e.target.value)} autoFocus
						onKeyDown={e => {
							if (e.key === 'Enter') {
								onClose(value)
							}
						}} />
				)}
				<div className="flex gap-3">
					<Button variant="secondary" className="flex-1" onClick={() => onClose(false)}>Cancel</Button>
					<Button variant="primary" className="flex-1" onClick={() => onClose(modal.type === 'prompt' ? value : true)}>
						OK
					</Button>
				</div>
			</Panel>
		</div>
	);
}
export default ModalView
