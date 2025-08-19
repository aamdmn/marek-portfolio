import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

export type CycleImageItem = {
	title: string;
	src: string;
	srcSet?: string;
	sizes?: string;
	width?: number;
	height?: number;
};

type CycleImageProps = {
	images: CycleImageItem[];
	startIndex?: number;
	className?: string;
	captionClassName?: string;
	wrapperClassName?: string;
	cursorClassName?: string;
};

export default function CycleImage(props: CycleImageProps) {
	const {
		images,
		startIndex = 0,
		className = "w-full h-auto select-none",
		captionClassName = "font-mono text-palette-brightest-white text-sm",
		wrapperClassName = "relative overflow-hidden cycle-image-container",
		cursorClassName = "cursor-default hover:cursor-e-resize",
	} = props;

	const total = images.length;
	const initialIndex = useMemo(() => {
		if (total === 0) return 0;
		return Math.min(Math.max(startIndex, 0), total - 1);
	}, [startIndex, total]);

	const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
	
	const current = images[total > 0 ? currentIndex % total : 0] ?? {
		title: "",
		src: "",
	};

	// Smooth transition handling
	useEffect(() => {
		if (isTransitioning) {
			const timer = setTimeout(() => {
				setIsTransitioning(false);
			}, 200); // Match CSS transition duration
			return () => clearTimeout(timer);
		}
	}, [isTransitioning]);

	const handleNext = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			// Prevent default behavior but don't interfere with Lenis smooth scroll
			e.preventDefault();
			e.stopPropagation();
			
			// Prevent any potential scrolling from the click
			if (e.type === 'click') {
				(e as React.MouseEvent).currentTarget.blur();
			}
			
			if (total === 0 || isTransitioning) return;
			
			setIsTransitioning(true);
			setCurrentIndex((prev) => (prev + 1) % total);
		},
		[total, isTransitioning],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLImageElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				handleNext(e);
			}
		},
		[handleNext],
	);

	return (
		<div className={wrapperClassName}>
			<div
				className="relative w-full"
				style={{
					aspectRatio: current.width && current.height ? `${current.width}/${current.height}` : "1",
					minHeight: "200px", // Prevent container from being too small
				}}
			>
				<img
					src={current.src}
					srcSet={current.srcSet}
					sizes={current.sizes}
					alt={current.title}
					loading="lazy"
					decoding="async"
					width={current.width}
					height={current.height}
					className={`${className} ${cursorClassName} absolute inset-0 ${isTransitioning ? "opacity-80" : "opacity-100"}`}
					onClick={handleNext}
					onKeyDown={handleKeyDown}
					role="button"
					tabIndex={0}
					draggable={false}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "contain",
						objectPosition: "center",
						transition: "opacity 0.2s ease-in-out",
					}}
				/>
			</div>
			<div>
				<p className={captionClassName}>{current.title}</p>
			</div>
		</div>
	);
}
