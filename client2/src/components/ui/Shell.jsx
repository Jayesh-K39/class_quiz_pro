// Full-page dark gradient canvas used by every screen in the app.
// align='center' -> single centered card (auth screens, waiting screens)
// align='top'    -> content starts near the top and can scroll (control room, live session)
export default function Shell({ children, align = 'center', className = '' }) {
	const alignment = align === 'top'
		? 'items-center justify-start pt-10 sm:pt-16'
		: 'items-center justify-center'

	return (
		<main className={`min-h-screen bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white flex flex-col gap-4 px-4 py-8 sm:px-8 ${alignment} ${className}`}>
			{children}
		</main>
	)
}
