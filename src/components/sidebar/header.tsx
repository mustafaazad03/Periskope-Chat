import React from 'react';
import { AiFillMessage } from 'react-icons/ai';
import { GoDesktopDownload } from "react-icons/go";
import { BiSolidBellOff } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { TbRefreshDot } from "react-icons/tb";
import { IoMdHelpCircleOutline } from "react-icons/io";
import Image from 'next/image';
import { TfiMenuAlt } from 'react-icons/tfi';

const Header = () => {
  return (
    <div className="p-2 flex items-center gap-2 border-b border-gray-200 bg-white h-max">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-1 text-gray-600 font-medium text-center">
          <span className="flex h-5 w-5 items-center justify-center rounded-full text-gray-600 text-xs">
            <AiFillMessage className="h-4 w-4" />
          </span>
          <span className="">chats</span>
        </div>
      </div>

      <button className="p-2 px-3 text-gray-500 hover:bg-gray-100 rounded-md border-2 border-gray-100 flex items-center gap-2">
        <TbRefreshDot className="h-4 w-4" />
        <span className="text-xs font-semibold">Refresh</span>
      </button>

      <button className="p-2 px-3 text-gray-500 hover:bg-gray-100 rounded-md border-2 border-gray-100 flex items-center gap-2">
        <IoMdHelpCircleOutline className="h-4 w-4" />
        <span className="text-xs font-semibold">Help</span>
      </button>

      <div className="text-gray-600 p-2 px-3 rounded-md border-2 border-gray-100 hover:bg-gray-100 flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-yellow-400"></span>
        <span className="text-sm">5 / 6 phones</span>
        <Image src="/left-right-arrow.png" alt="left-right-arrow" width={12} height={12} quality={100} className='rotate-90' />
      </div>

      <button className="text-gray-600 p-2 px-3 rounded-md border-2 border-gray-100 hover:bg-gray-100 flex items-center gap-2">
        <GoDesktopDownload className="h-4 w-4" />
        <span className="sr-only">Download</span>
      </button>

      <button className="text-gray-600 p-2 px-3 rounded-md border-2 border-gray-100 hover:bg-gray-100 flex items-center gap-2">
        <BiSolidBellOff className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
      </button>

      <button className="text-gray-600 p-2 px-3 rounded-md border-2 border-gray-100 hover:bg-gray-100 flex items-center gap-2">
        <BsStars className="h-4 w-4 text-orange-300" />
        <TfiMenuAlt className="h-4 w-4" />
        <span className="sr-only">Menu</span>
      </button>
    </div>
  );
};

export default Header;