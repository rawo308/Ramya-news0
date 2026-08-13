"use client";

import { useEffect, useId, useRef } from "react";

const BANNER_SCRIPT_URL =
	"https://www.highperformanceformat.com/6d8558c951c213402c54fab70f55e8c8/invoke.js";

export function AdBanner() {
	const containerRef = useRef<HTMLDivElement>(null);
	const instanceId = useId();

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const options = {
			key: "6d8558c951c213402c54fab70f55e8c8",
			format: "iframe",
			height: 60,
			width: 468,
			params: {},
		};
		(window as Window & { atOptions?: typeof options }).atOptions = options;

		const script = document.createElement("script");
		script.src = BANNER_SCRIPT_URL;
		script.async = true;
		container.appendChild(script);

		return () => {
			container.innerHTML = "";
		};
	}, []);

	return (
		<div className="flex min-h-[60px] items-center justify-center overflow-hidden" ref={containerRef} id={instanceId} />
	);
}

