import {useContext, createContext, useState, useRef} from 'react'
import ModalView from './ModalView'
const ModalContext = createContext()

export default function ModalProvider({children}){
	const [modal, setModal] = useState(null)
	const resolver = useRef(null)

	function confirm(message){
		setModal({type:'confirm', message})
		return new Promise((resolve)=> {resolver.current = resolve})
	}

	function prompt(message, defaultValue=''){
		setModal({type:'prompt', message, defaultValue})
		return new Promise((resolve)=>{resolver.current = resolve})
	}

	function handleClose(result){
		resolver.current?.(result)
		setModal(null)
	}

	return(
		<ModalContext.Provider value={{confirm, prompt}}>
			{children}
			{modal && <ModalView modal={modal} onClose={handleClose}/>}
		</ModalContext.Provider>
	)
}
export const useModal = ()=> useContext(ModalContext)
