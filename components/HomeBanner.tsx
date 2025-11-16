import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_1 } from "@/images";

const HomeBanner = () => {
	return (
		<div className="py-16 md:py-0 bg-shop_light_pink rounded-lg px-10 lg:px-24 flex items-center justify-between">
			<div className="space-y-5">
				<Title>
					Giảm giá lên đến 50% <br />
					Tai nghe cao cấp
				</Title>
				<Link
					href={"/shop"}
					className="bg-shop_dark_green/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop_dark_green hoverEffect"
				>
					Mua ngay
				</Link>
			</div>
			<div>
				<Image
					src={banner_1}
					alt="banner_1"
					className="hidden sm:inline-flex w-80 md-60 "
				/>
			</div>
		</div>
	);
};

export default HomeBanner;
