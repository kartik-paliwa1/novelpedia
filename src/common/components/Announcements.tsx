'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Calendar } from 'lucide-react';

const announcements = [
	{
		id: 1,
		title: "KarmicSphere Media's 10 year anniversary!",
		timeAgo: '23 days ago',
		tag: 'celebration',
		icon: '🎉',
	},
	{
		id: 2,
		title: 'New Feature: Scroll-based Discovery System is live!',
		timeAgo: '5 days ago',
		tag: 'feature',
		icon: '🚀',
	},
];

export default function Announcements() {
	// State to track the currently active slide in the announcements carousel
	const [currentSlide, setCurrentSlide] = useState(0);
	// Reference to the container for controlling scroll behavior
	const containerRef = useRef<HTMLDivElement>(null);
	// State to pause/resume the auto-scroll functionality
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		// Automatically scrolls to the next slide every 3.5 seconds unless paused
		const interval = setInterval(() => {
			if (!isPaused && containerRef.current) {
				const nextIndex = (currentSlide + 1) % announcements.length;
				const cardWidth =
					containerRef.current.querySelector('.announcement-card')?.clientWidth || 320;
				containerRef.current.scrollTo({
					left: cardWidth * nextIndex,
					behavior: 'smooth',
				});
				setCurrentSlide(nextIndex);
			}
		}, 3500);

		return () => clearInterval(interval);
	}, [currentSlide, isPaused]);

	return (
		<section className="px-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-2">
					<Bell className="w-6 h-6 text-[#8E7DD9]" />
					<h2 className="text-xl font-bold text-white">Announcements</h2>
				</div>
				<button className="text-purple-400 text-sm font-medium hover:underline">
					View All
				</button>
			</div>

			<div
				ref={containerRef}
				className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-2"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
				onTouchStart={() => setIsPaused(true)}
				onTouchEnd={() => setIsPaused(false)}
			>
				{announcements.map((a) => (
					<div
						key={a.id}
						className="announcement-card snap-center shrink-0 w-[85vw] max-w-[380px] bg-[#1e253b] rounded-xl p-4"
					>
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-[#34274A] rounded-xl flex items-center justify-center">
								<span className="text-xl">{a.icon}</span>
							</div>
							<div className="flex-1">
								<h3 className="text-white font-semibold mb-2">{a.title}</h3>
								<div className="flex items-center space-x-4 text-sm">
									<div className="flex items-center text-gray-400 space-x-1">
										<Calendar className="w-4 h-4" />
										<span>{a.timeAgo}</span>
									</div>
									<span className="bg-[#34274A] text-[#C572DE] px-3 py-1 rounded-full text-xs font-medium capitalize">
										{a.tag}
									</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="flex justify-center gap-1.5 mt-1">
				{announcements.map((_, idx) => (
					<div
						key={idx}
						onClick={() => setCurrentSlide(idx)}
						className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
							currentSlide === idx ? 'bg-[#8664F4] scale-140 shadow-sm' : 'bg-gray-500/60'
						}`}
					/>
				))}
			</div>
		</section>
	);
}
