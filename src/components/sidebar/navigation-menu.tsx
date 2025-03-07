import type React from "react"
import { Settings, HelpCircle } from "lucide-react"
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { IoTicketSharp } from "react-icons/io5";
import { BsGraphUp } from "react-icons/bs";
import { TfiMenuAlt } from "react-icons/tfi";
import { HiSpeakerphone } from "react-icons/hi";
import { TiFlowMerge } from "react-icons/ti";
import { RiContactsBookFill } from "react-icons/ri";
import { RiFolderImageFill } from "react-icons/ri";
import { MdOutlineChecklist } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { TbStarsFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import Image from "next/image"

export default function NavigationMenu() {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mb-6">
        <Image src="/logo.jpeg" alt="Logo" width={32} height={32} />
      </div>

      <nav className="flex flex-col items-center gap-3 flex-1">
        <div>
          <NavItem icon={<AiFillHome className="h-5 w-5" />} active={false} />
          <hr className="w-full border-t border-gray-200" />
        </div>
        <NavItem icon={<AiFillMessage className="h-5 w-5" />} active={true} />
        <NavItem icon={<IoTicketSharp className="h-5 w-5" />} active={false} />
        <NavItem icon={<BsGraphUp className="h-5 w-5" />} active={false} />
        <div>
          <hr className="w-full border-t border-gray-200" />
          <NavItem icon={<TfiMenuAlt className="h-5 w-5" />} active={false} />
        </div>
        <NavItem icon={<HiSpeakerphone className="h-5 w-5" />} active={false} />
        <NavItem icon={<TiFlowMerge className="h-5 w-5" />} active={false} />
        <div>
          <hr className="w-full border-t border-gray-200" />
          <NavItem icon={<RiContactsBookFill className="h-5 w-5" />} active={false} />
        </div>
        <NavItem icon={<RiFolderImageFill className="h-5 w-5" />} active={false} />
        <div className="-mt-2">
          <hr className="w-full border-t border-gray-200" />
          <NavItem icon={<MdOutlineChecklist className="h-5 w-5" />} active={false} />
        </div>
        <NavItem icon={<IoSettingsSharp className="h-5 w-5" />} active={false} />
        <div className="mt-auto flex flex-col items-center gap-3">
        <NavItem icon={<TbStarsFilled className="h-5 w-5" />} active={false} />
        <NavItem icon={<TbLayoutSidebarLeftExpandFilled className="h-5 w-5" />} active={false} />
        </div>
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
        active ? "bg-gray-100/80 text-green-600" : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {icon}
    </button>
  )
}

