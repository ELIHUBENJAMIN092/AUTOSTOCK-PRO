"use client"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function Button({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={"px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-semibold shadow-xl shadow-cyan-500/20 transition hover:opacity-95 " + className}
    >
      {children}
    </button>
  )
}
