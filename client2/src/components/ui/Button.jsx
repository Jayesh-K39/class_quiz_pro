const variants = {
	primary: 'bg-violet-600 hover:bg-violet-500 text-white',
	secondary: 'border border-slate-600 hover:bg-slate-800 text-white',
	danger: 'bg-rose-600 hover:bg-rose-500 text-white',
	success: 'bg-emerald-500 hover:bg-emerald-400 text-white',
	ghost: 'hover:bg-white/10 text-white',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
	return (
		<button
			className={`rounded-xl px-5 py-3 font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-none ${variants[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}
