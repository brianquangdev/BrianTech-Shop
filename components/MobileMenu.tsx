"use client";

import React from "react";
import { AlignLeft } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";

const MobileMenu = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	return (
		<>
			<button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
				<AlignLeft className="hover:text-darkColor hoverEffect md:hidden hover:cusor-pointer" />
			</button>
			<div className="md:hidden">
				<SideMenu
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>
			</div>
		</>
	);
};

export default MobileMenu;
