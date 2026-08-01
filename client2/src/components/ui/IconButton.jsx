const tones = {
	neutral: 'hover:bg-white/10 hover:text-white',
	danger: 'hover:bg-rose-500/20 hover:text-rose-300',
	accent: 'hover:bg-violet-500/20 hover:text-violet-300',
	success: 'hover:bg-emerald-500/20 hover:text-emerald-300',
}

export default function IconButton({ tone = 'neutral', className = '', children, ...props }) {
	return (
		<button
			type="button"
			className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition ${tones[tone]} ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}
