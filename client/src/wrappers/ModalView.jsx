import {useState} from 'react'
function ModalView({ modal, onClose }) {
  const [value, setValue] = useState(modal.defaultValue ?? '');
  const btnStyle = `p-2 rounded-md w-[100px] cursor-pointer`
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-3 w-[80vw] max-w-md">
        <p className='font-bold'>{modal.message}</p>
        {modal.type === 'prompt' && (
          <input className='outline-none border-b border-b-blue-500'
          name='promptInput'
          value={value} onChange={(e) => setValue(e.target.value)} autoFocus 
          onKeyDown={e=>{
          	if(e.key === 'Enter'){
          		onClose(value)
          	}
          }}/>
        )}
        <div className="flex gap-3">
          <button className={`${btnStyle} bg-red-400 hover:bg-red-500`} onClick={() => onClose(false)}>Cancel</button>
          <button className={`${btnStyle} bg-green-400 hover:bg-green-500`} onClick={() => onClose(modal.type === 'prompt' ? value : true)}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
export default ModalView
