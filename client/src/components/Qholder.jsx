import { useState, useEffect } from 'react'
import Questions from './Questions'
import Panel from './ui/Panel'
import { toast } from 'react-hot-toast'
import BackIcon from '../icons/BackIcon'

export default function Qholder({ quiz, onBack }) {
	return (
			<Panel tone='solid' className='flex max-h-[80vh] w-[90vw] max-w-2xl flex-col gap-3'>
					<div className="relative text-center font-bold">
						{quiz.title}
						<button onClick={onBack} className="absolute left-0 top-0 cursor-pointer text-slate-400 hover:text-white">
							<BackIcon />
						</button>
				   </div>
				   <Questions quiz={quiz}/>
			</Panel>
	)
}
