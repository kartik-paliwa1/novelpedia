'use client';

import { useState } from 'react';
import { BookOpen, Library, Trophy, Users } from 'lucide-react';
import clsx from 'clsx';

// Tabs configuration with labels and icons
const tabs = [
	{ label: 'Novels', icon: BookOpen },
	{ label: 'Fanfiction', icon: Library },
	{ label: 'Rankings', icon: Trophy },
	{ label: 'For You', icon: Users },
];

export default function NavTabs() {
	// State to track the currently active tab
	const [activeTab, setActiveTab] = useState('Novels');

	return (
		<nav
			className={clsx(
				'sticky top-[60px] left-0 right-0 z-30 bg-[#131826] transition-transform duration-300'
			)}
		>
			<div
				className="relative px-1 sm:px-8 pt-1.5 sm:pt-3 pb-1.5 sm:pb-3 border-b-2 border-[#5F4167] flex bg-[#131A2A]"
				style={{ minHeight: 52 }}
			>
				<div className="flex w-full justify-between sm:justify-center gap-1 sm:gap-12">
					{tabs.map(({ label, icon: Icon }) => {
						const isActive = activeTab === label;
						return (
							<button
								key={label}
								onClick={() => setActiveTab(label)}
								className={clsx(
									'relative flex flex-col items-center justify-center flex-1',
									'px-1.5 py-1 sm:px-8 sm:py-4 min-w-0 min-h-[40px] sm:min-h-[72px] rounded-[10px] sm:rounded-[28px] border transition-all duration-200',
									isActive
										? 'bg-[#36244F] border-[#39254A] text-[#BFA6E2] font-semibold z-10'
										: 'border-transparent text-[#A6A6B9] hover:text-purple-200 bg-transparent z-0'
								)}
								style={
									isActive
										? {
												boxShadow: '0 0 4px 0 rgba(185, 122, 255, 0.18)',
												flex: '1 1 0%',
										  }
										: { flex: '1 1 0%' }
								}
							>
								<div className="flex items-center justify-center gap-1 sm:gap-4 w-full">
									{/* Render the tab icon */}
									<Icon
										className={clsx(
											'w-5 h-5 sm:w-10 sm:h-10',
											isActive ? 'text-[#BFA6E2]' : 'text-[#A6A6B9]'
										)}
									/>
									{/* Render the tab label */}
									<span
										className="text-xs sm:text-2xl leading-none"
										style={{ fontWeight: isActive ? 600 : 500 }}
									>
										{label}
									</span>
								</div>
								{isActive && (
									<svg
										width="70"
										height="2"
										viewBox="0 0 40 2"
										fill="none"
										className="absolute left-1/2 -translate-x-1/2 w-[70px] h-[2px] sm:w-[120px] sm:h-[6px]"
										style={{ bottom: 5 }}
									>
										<rect
											x="0"
											y="0"
											width="40"
											height="2"
											rx="1"
											fill="url(#grad)"
										/>
										<defs>
											<linearGradient
												id="grad"
												x1="0"
												y1="0"
												x2="40"
												y2="0"
												gradientUnits="userSpaceOnUse"
											>
												<stop stopColor="#B97AFF" />
												<stop offset="1" stopColor="#A084E8" />
											</linearGradient>
										</defs>
									</svg>
								)}
							</button>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
