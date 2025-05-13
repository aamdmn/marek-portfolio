import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import logo from "../assets/logo.svg";

export default function MobileHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const menuVariants = {
		initial: {
			opacity: 0,
		},
		animate: {
			opacity: 1,
			transition: {
				duration: 0.2,
				when: "beforeChildren",
				staggerChildren: 0.1,
			},
		},
		exit: {
			opacity: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	const linkVariants = {
		initial: {
			opacity: 0,
			y: 5,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: [0.22, 1, 0.36, 1], // Custom ease for smooth fade
			},
		},
	};

	const menuLinks = [
		{ href: "/archive", text: "Archive" },
		{ href: "/about", text: "About" },
		{ href: "/contact", text: "Contact" },
	];

	return (
		<div className="md:hidden">
			{/* Mobile Header - fixed height to prevent layout shift */}
			<header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 bg-background">
				<a href="/" className="z-50">
					<img src={logo.src} alt="Logo" className="w-8 h-8" />
				</a>

				<button
					type="button"
					onClick={toggleMenu}
					className="z-50 text-white focus:outline-none text-base font-normal"
				>
					{isMenuOpen ? "X" : "Menu"}
				</button>
			</header>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial="initial"
						animate="animate"
						exit="exit"
						variants={menuVariants}
						className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm"
					>
						<nav className="flex flex-col items-center justify-center space-y-8 text-white">
							{menuLinks.map((link, i) => (
								<motion.a
									key={link.href}
									href={link.href}
									className="text-xl font-normal text-white hover:text-gray-300 transition-colors"
									onClick={() => setIsMenuOpen(false)}
									variants={linkVariants}
								>
									{link.text}
								</motion.a>
							))}
						</nav>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Fixed height spacer to prevent layout shift */}
			<div className="h-16" />
		</div>
	);
}
