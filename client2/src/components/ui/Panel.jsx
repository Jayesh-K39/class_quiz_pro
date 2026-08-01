// tone='glass' -> translucent frosted panel, for hero-adjacent / lightweight content
// tone='solid' -> opaque slate surface, for dense content (lists, forms, tables)
export default function Panel({ children, tone = 'glass', className = '', ...props }) {
	const tones = {
		glass: 'border border-white/10 bg-white/5 backdrop-blur-xl',
		solid: 'border border-white/10 bg-slate-900',
	}

	return (
		<div className={`w-full rounded-3xl ${tones[tone]} p-6 shadow-xl shadow-black/20 ${className}`} {...props}>
			{children}
		</div>
	)
}
