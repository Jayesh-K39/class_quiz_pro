import { forwardRef } from 'react'

const Input = forwardRef(function Input({ trailing, className = '', ...props }, ref) {
	return (
		<div className={`flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/50 pr-2 transition focus-within:border-violet-500 ${className}`}>
			<input
				ref={ref}
				className="w-full flex-1 rounded-xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate-500"
				{...props}
			/>
			{trailing}
		</div>
	)
})
export default Input

