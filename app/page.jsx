import React from 'react'

const Main = () => {
  return (
    <div className="flex main-container w-full justify-center px-16">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center font-londrina-sketch mb-3">
          CREATE & CHAT!
          <div className="gradient-text font-londrina-sketch text-4xl font-bold">
            GROUP CHATS WITH YOUR FRIENDS
          </div>
        </h1>
        <p className='sm:w-[65%]'>
          GSEAS is a platform where you can create a sea of group chats, making
          it easy to talk, bond, and create lasting memories with your friends.
          Enjoy fun conversations and meaningful connections!
        </p>
      </div>
    </div>
  );
}

export default Main