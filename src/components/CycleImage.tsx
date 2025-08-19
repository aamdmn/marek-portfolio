import type React from "react";
import { useCallback, useMemo, useState } from "react";

export type CycleImageItem = {
	title: string;
	src: string;
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
	const current = images[total > 0 ? currentIndex % total : 0] ?? {
		title: "",
		src: "",
	};

	const handleNext = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (total === 0) return;
			setCurrentIndex((prev) => (prev + 1) % total);
		},
		[total],
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
			<img
				src={current.src}
				alt={current.title}
				loading="lazy"
				decoding="async"
				width={current.width}
				height={current.height}
				className={`${className} ${cursorClassName}`}
				onClick={handleNext}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
				style={{
					maxWidth: "100%",
					height: "auto",
					objectFit: "contain",
				}}
			/>
			<div>
				<p className={captionClassName}>{current.title}</p>
			</div>
		</div>
	);
}
