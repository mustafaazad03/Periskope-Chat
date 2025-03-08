import type React from "react"
import Image from "next/image"
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb"
import { BsArrowRepeat } from "react-icons/bs";
import { LuPencilLine } from "react-icons/lu";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import { LuLayoutList } from "react-icons/lu";
import { FaHubspot } from "react-icons/fa";
import { MdGroups, MdAlternateEmail } from "react-icons/md";
import { RiFolderImageFill, RiListSettingsLine } from "react-icons/ri";


export default function RightNavigationMenu() {
  return (
    <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4">
      <nav className="flex flex-col items-center gap-2 flex-1 text-gray-400">
        <NavItem icon={<TbLayoutSidebarRightExpandFilled className="h-5 w-5" />} active={false} />
        <NavItem icon={<BsArrowRepeat className="h-5 w-5" />} active={false} />
        <NavItem icon={<LuPencilLine className="h-5 w-5" />} active={false} />
        <NavItem icon={<HiOutlineBars3CenterLeft className="h-5 w-5" />} active={false} />
        <NavItem icon={<LuLayoutList className="h-5 w-5" />} active={false} />
        <NavItem icon={<FaHubspot className="h-5 w-5" />} active={false} />
        <NavItem icon={<MdGroups className="h-5 w-5" />} active={false} />
        <NavItem icon={<MdAlternateEmail className="h-5 w-5" />} active={false} />
        <NavItem icon={<RiFolderImageFill className="h-5 w-5" />} active={false} />
        <NavItem icon={<RiListSettingsLine className="h-5 w-5" />} active={false} />
      </nav>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  active: boolean
}

function NavItem({ icon, active }: NavItemProps) {
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center rounded-xl ${
        active ? "bg-gray-100/80 text-gray-600" : "text-gray-300 hover:bg-gray-100"
      }`}
    >
      {icon}
    </button>
  )
}

