"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const EditForm = ({chatRoom}) => {
    const [newName, setNewName] = useState();
    const [newImage, setNewImage] = useState();
    const [newMember, setNewMember] = useState();
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter()

    const handleSubmit = async (e) => {
      setSubmitting(true);

      try{
        await fetch(`/api/group/${chatRoom._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            image: newImage,
            member: newMember,
          }),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    }

    const handleDelete = async () => {
      try{
        const response = await fetch(`/api/group/${chatRoom._id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          router.push('/profile')
        } else {
          console.error("Failed to delete chat room")
        }
      } catch (e) {
        console.error(e);
      }
    }

  return (
    <div className="flex justify-center pt-10">
      <form onSubmit={handleSubmit} className="w-full px-10 grid gap-10">
        <input
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
          type="text"
          className="search_input "
          placeholder="Change the image of the group..."
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          type="text"
          className="search_input"
          placeholder="Change the name of the group..."
        />
        <input
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          type="text"
          className="search_input "
          placeholder="Add a new member using their ID..."
        />
        <div className="flex flex-col items-center gap-10">
          <button type="submit" className="custom_button w-2/5 flex justify-center">
            <span className="custom_circle circle1"></span>
            <span className="custom_circle circle2"></span>
            <span className="custom_circle circle3"></span>
            <span className="custom_circle circle4"></span>
            <span className="custom_circle circle5"></span>
            <p className="custom_text">
              {submitting ? "Submitting" : "Submit"} {" "} Changes
            </p>
          </button>

          <button
            type='button'
            onClick={handleDelete}
            className="custom_button w-3/5 flex justify-center hover:bg-red-600">
            <p className="custom_text">
              DELETE GROUP CHAT
            </p>
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default EditForm