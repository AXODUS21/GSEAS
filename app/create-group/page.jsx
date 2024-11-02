"use client"

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const CreateGroup = () => {
  const [newMember, setNewMember] = useState("")
  const {data: session} = useSession()
  const [groupName, setGroupName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [members, setMembers] = useState([]);
  const router = useRouter();

  const handleAddMember = () => {
    if(newMember === ""){
      alert('Please enter a member name');
      return;
    }
    setNewMember("")
    setMembers([...members, newMember])
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); // Enable the submit button while the request is in progress

    if(members.length <= 1){
      alert('At least 2 members are required to create a group chat');
      return;
    }
      setGroupName("");
      setMembers([]);

    try{
      const response = await fetch("/api/group/new", {
        method: 'POST',
        body: JSON.stringify({ 
          members: [...members, session?.user.id],
          name: groupName,
          image: session?.user.image,
         }),
      })

      if(response.ok) {
        router.push("/")
      }

    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false); // Disable the submit button after the request is complete
    }
    // TODO: Add logic to create group and send notifications to members
    console.log('Group created successfully');
  }

  const handleDelete = (index) => {
    const tempMembers = members.filter((_, i) => i !== index); // Filter out the member at the specified index
    setMembers(tempMembers); // Update the state with the filtered array
  }

  return (
    <div className="flex justify-start w-full sm:pl-20 px-7 ">
      <div className="grid">
        <h2 className="text-5xl font-bold mb-10">CREATE A GROUP CHAT</h2>
        <form
          onSubmit={handleSubmit}
          className="grid w-full gap-4 bg-gray-500 px-10 py-16 rounded-md"
        >
          <label>Group Name:</label>
          <input
            type="text"
            className="search_input text-black"
            placeholder="Enter The Name of Your Group Chat..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <label>Group Members:</label>
          <div className="flex items-center gap-5 ">
            <input
              type="text"
              className="w-[95%] search_input text-black"
              placeholder="ID of your friend"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              maxLength={40}
            />
            <span className="cursor-pointer " onClick={handleAddMember}>
              <Image
                src={"/assets/plus.png"}
                className="mix-blend-darken"
                width={15}
                height={1}
              />
            </span>
          </div>
          <div className="members h-20 overflow-x-hidden overflow-y-auto">
            {members.map((member, index) => (
              <div className="w-[80&] flex items-center gap-4 text-black mb-3 px-3">
                {member}
                <button 
                onClick={() => handleDelete(index)}
                className="group relative flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600">
                  <svg
                    viewBox="0 0 1.625 1.625"
                    className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
                    height="15"
                    width="15"
                  >
                    <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"></path>
                    <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"></path>
                    <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"></path>
                  </svg>
                  <svg
                    width="16"
                    fill="none"
                    viewBox="0 0 39 7"
                    className="origin-right duration-500 group-hover:rotate-90"
                  >
                    <line
                      stroke-width="4"
                      stroke="white"
                      y2="5"
                      x2="39"
                      y1="5"
                    ></line>
                    <line
                      stroke-width="3"
                      stroke="white"
                      y2="1.5"
                      x2="26.0357"
                      y1="1.5"
                      x1="12"
                    ></line>
                  </svg>
                  <svg width="16" fill="none" viewBox="0 0 33 39" class="">
                    <mask fill="white" id="path-1-inside-1_8_19">
                      <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                    </mask>
                    <path
                      mask="url(#path-1-inside-1_8_19)"
                      fill="white"
                      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                    ></path>
                    <path
                      stroke-width="4"
                      stroke="white"
                      d="M12 6L12 29"
                    ></path>
                    <path stroke-width="4" stroke="white" d="M21 6V29"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button type="submit">{submitting ? <>Creating</> : <>Create</>}{" "} Group</button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup