import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({ className }: { className?: string }) => {
	return (
		<Link
			href={"/"}
			className="group flex items-center w-fit pointer-events-auto"
		>
			{" "}
			{/* w-fit:chỉ chiếm không gian cần thiết, pointer-events-auto:hạn chế hover */}
			<div className="relative w-[45px] h-[45px] overflow-hidden">
				{/* Logo mặc định */}
				<Image
					className="absolute top-0 left-0 w-full h-full object-contain group-hover:opacity-0 hoverEffect"
					src="/LogoBold.svg"
					alt="BrianTech Logo"
					width={45}
					height={45}
				/>
				{/* Logo khi hover */}
				<Image
					className="absolute top-0 left-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 hoverEffect"
					src="/Logo.svg"
					alt="BrianTech Logo"
					width={45}
					height={45}
				/>
			</div>
			{/* Text */}
			<h2
				className={cn(
					"text-2xl text-shop_dark_green font-black tracking-wider uppercase group-hover:text-shop_light_green hoverEffect group font-sans",
					className,
				)}
			>
				rianTech
			</h2>
		</Link>
	);
};

export default Logo;
