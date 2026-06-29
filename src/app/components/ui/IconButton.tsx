"use client"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function IconButton({ children, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      className={
        "p-2 md:p-2.5 rounded-lg border transition-all duration-200 shrink-0 cursor-pointer " +
        className
      }
    >
      {children}
    </button>
  );
}
