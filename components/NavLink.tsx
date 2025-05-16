import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className="relative inline-block px-2 py-1">
      <span
        className={clsx(
          'transition-colors duration-300',
          isActive ? 'text-blue-600 font-semibold whitespace-nowrap' : 'whitespace-nowrap text-text dark:text-dark-text hover:text-blue-500'
        )}
      >
        {children}
      </span>
      <span
        className={clsx(
          'absolute left-0 bottom-0 h-[2px] w-full transform scale-x-0 bg-blue-500 transition-transform duration-300 ease-in-out',
          isActive && 'scale-x-100',
          !isActive && 'group-hover:scale-x-100'
        )}
      />
    </Link>
  )
}
export default NavLink