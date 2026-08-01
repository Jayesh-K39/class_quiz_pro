const tones = {
	neutral: 'bg-white/5 text-slate-300 border-white/10',
	accent: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
	success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
	danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
}

export default function Badge({ children, tone = 'neutral', className = '' }) {
	return (
		<span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium ${tones[tone]} ${className}`}>
			{children}
		</span>
	)
}
