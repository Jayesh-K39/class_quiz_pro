function Toast({ message }) {
	return (
		<div className="absolute bottom-5 flex w-[70vw] max-w-sm self-center justify-center rounded-xl border border-emerald-500/30 bg-slate-900 p-3 text-center font-semibold text-white shadow-xl shadow-black/30">
			{message}
		</div>
	)
}
export default Toast
