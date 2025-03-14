import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Mainsection } from "./main-section";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logosaas.png";
export const HomeSideBar = () => {
  return (
    <Sidebar
      className=" z-40  border-r-2 pt-18 " // Changed background color here
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="bg-[#EAEEFE]">
        <Link href={"/"} className="flex space-x-3">
          <Image src={Logo} alt="Saas logo" height={40} width={40} />
          <span className="pt-2  text-xl">NextStep AI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-[#EAEEFE]">
        {" "}
        <Mainsection />
        <Separator />
      </SidebarContent>
    </Sidebar>
  );
};
