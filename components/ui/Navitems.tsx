"use client";
import { cn } from "@/lib/utils";
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems =[
{label: "Home", href:'/'},
{label: "Padii Learn", href:'/companions'},
{label: "My Journey", href:'my-journey'},
]
const Navitems = () => {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-5">
      {navItems.map(({label, href}) =>(
        <Link 
        href={href} 
        key={label}
        className={cn(pathname === href && 'text-primary font-semibold')}>
          {label}
       
        </Link>
      ))}
    </nav>
  )
}

export default Navitems