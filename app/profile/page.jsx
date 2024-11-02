"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const GroupChatCard = ({id}) => {
  const [gcs, setGcs] = useState([])

  useEffect(() => {
    if (!id) return;
    const getGroupChats = async () => {
      const response = await fetch(`/api/group/${id}/rooms`);
      const data = await response.json();
      setGcs(data);
    };
    getGroupChats();
  }, [id]);

  console.log(gcs)
  return (
    <>
      {gcs.map((gc) => {
         const latestMessage =
           gc.messages && gc.messages.length > 0
             ? gc.messages[gc.messages.length - 1]
             : null;
      
      return (
        <Link
          href={`/room/${gc._id}`}
          key={gc._id}
          className="flex items-center bg-white h-24 rounded-full px-8 cursor-pointer w-full"
        >
          <div className="flex gap-3 items-center">
            <div className="flex w-14 h-12">
              <Image
                src={gc.image}
                width={50}
                height={50}
                className="rounded-full border-2 border-stone-950 object-cover"
                alt="Group Avatar"
              />
            </div>
            <div className="grid">
              <p className="text-black">{gc.name}</p>
              {latestMessage ? (
                <p className="text-gray-500 sm:block hidden">
                  {latestMessage.sender}: {latestMessage.content}
                </p>
              ) : (
                <p className="text-gray-500 sm:block hidden">No Messages Yet</p>
              )}
            </div>
          </div>
        </Link>
      );})}
    </>
  )
}


const ProfilePage = () => {
  const {data: session} = useSession();
  const [copied, setCopied] = useState("");

    const handleCopy = () => {
      setCopied(session?.user.id);
      navigator.clipboard.writeText(session?.user.id); //sets the clipboard of the user to the post.prompt
      setTimeout(() => setCopied(""), 2000);
    }; 

  return (
    <div>
      <div className="flex justify-end pr-10 items-center gap-2">
        <p>ID:{session?.user.id}</p>
        <span onClick={handleCopy}>
          <Image
            src={
              copied === session?.user.id
                ? "/assets/tick.svg"
                : "/assets/copy.svg"
            }
            className="cursor-pointer"
            width={18}
            height={18}
          />
        </span>
      </div>
      <header className="pl-16 flex justify-between">
        <h1 className="text-4xl font-bold">WELCOME TO YOUR HOME PAGE</h1>
      </header>

      <div className="grid grid-cols-2 sm:px-16 px-7 mt-10 sm:gap-20 gap-4">
          <GroupChatCard key={session?.user.id} id={session?.user.id}/>
      </div>
    </div>
  );
}

export default ProfilePage  