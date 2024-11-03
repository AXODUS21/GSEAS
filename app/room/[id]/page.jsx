"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import Chat from '@components/Chat';
import EditForm from '@components/EditForm';


const ChatRoom = () => {
  const pathname = usePathname(); // Get the current pathname
  const id = pathname.split("/").pop(); // Extract the ID from the pathname
  const [chatRoom, setChatRoom] = useState();
  const [infoOpened, setInfoOpened] = useState(false);

  useEffect(() => {
    const fetchChatRoomData = async () => {
      try{
        const response = await fetch(`/api/group/${id}`, {cache: "no-store"});
        const data = await response.json();
        setChatRoom(data); // Set the chat room data to state
      }  catch(err){
        console.log(err)
      }
    }
    if(id){
      fetchChatRoomData();
    }
  },[id]);

  return (
    <div className="flex">
      <div className="animate_fade_in px-7 pb-7 flex-auto">
        <header className="flex items-center justify-between pr-10">
          <div className="flex gap-3 items-center">
            <Link href="/profile" className="text-2xl">
              <Image src={"/assets/left-arrow-white.png"} height={30} width={30}/>
            </Link>
            <div className="image-container w-14 h-14 flex">
              <Image
                src={chatRoom?.image}
                width={60}
                height={60}
                alt="Room Image"
                className="rounded-full object-cover"
              />
            </div>
            <div className="text-xl font-bold">{chatRoom?.name}</div>
          </div>
          <abbr title="Chat Info" className="cursor-pointer select-none">
            <div
              onClick={() => setInfoOpened((prev) => !prev)}
              className="bg-white text-black rounded-full px-[17px] py-2"
            >
              i
            </div>
          </abbr>
        </header>
        <Chat chatRoom={chatRoom} />
      </div>

      <div
        className={`${
          infoOpened
            ? "sm:w-[30vw] w-[100vw] sm:bg-transparent bg-black sm:h-auto h-[150vw]"
            : "w-0"
        } transition-all overflow-hidden sm:relative absolute`}
      >
        <div
          className="pl-10 text-2xl cursor-pointer sm:hidden block"
          onClick={() => setInfoOpened(false)}
        >
          &#11160;
        </div>
        <EditForm chatRoom={chatRoom} />
      </div>
    </div>
  );
}

export default ChatRoom