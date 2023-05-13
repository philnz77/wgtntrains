"use client";
import Link from "next/link";

interface IProps {
  href: string,
  last: boolean,
  selected: boolean,
  children: React.ReactNode
}

export default function LinkToggle({
  href,
  last,
  selected,
  children
}: IProps) {
  const classes = [
    "w-full dark:border-gray-600 rounded-lg",
    !last && "border-b border-gray-200 sm:border-b-0 sm:border-r",
    selected && "bg-blue-500"
  ].filter(Boolean).join(" ");
  
  return (
    <li className={classes}>
        <div className="flex items-center pl-3">
          <Link href={href} style={{width: '100%', pointerEvents: selected ? 'none' : undefined}}>
              {children}
          </Link>
        </div>
    </li>
  );
}
