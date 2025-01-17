import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import NavHeader from '../NavHeader'
import NavLink from '../NavLink'

const Navbar = () => {
    const [state, setState] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const menuBtnEl = useRef()

    const navigation = [
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Testimonials", href: "/#testimonials" },
        { name: "FAQs", href: "/#faqs" },
    ]

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        document.onclick = (e) => {
            const target = e.target;
            if (!menuBtnEl.current?.contains(target)) setState(false);
        };
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
            <div className="custom-screen md:hidden">
                <NavHeader menuBtnEl={menuBtnEl} state={state} onClick={() => setState(!state)} />
            </div>
            <nav className={`pb-5 md:text-sm md:static md:block ${state ? "bg-gray-900 absolute z-20 top-0 inset-x-0 rounded-b-2xl shadow-xl md:bg-transparent" : "hidden"}`}>
                <div className="custom-screen items-center md:flex">
                    <NavHeader state={state} onClick={() => setState(!state)} />
                    <div className={`flex-1 items-center mt-8 text-gray-300 md:font-medium md:mt-0 md:flex ${state ? 'block' : 'hidden'}`}>
                        <ul className="flex-1 justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                            {navigation.map((item, idx) => (
                                <li key={idx} className="hover:text-gray-50 relative group">
                                    <Link href={item.href} className="block py-2 transition-colors duration-300">
                                        {item.name}
                                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
                            <Link href="/login" className="block hover:text-gray-50 transition-colors duration-300">
                                Sign in
                            </Link>
                            <NavLink href="/pricing" className="flex items-center justify-center gap-x-1 text-sm text-white font-medium custom-btn-bg border border-gray-500 hover:bg-gray-800 active:bg-gray-900 transition-colors duration-300 md:inline-flex">
                                Start now
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar