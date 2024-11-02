"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { io } from "socket.io-client";

const Chat = ({ chatRoom }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    socket.current = io("https://gseas.onrender.com");

    // Listen for incoming messages
    socket.current.on("receiveMessage", (newMessage) => {
      getMessages()
    });

    // Handle connection errors
    socket.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Clean up connection on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);


 const sendMessage = async () => {
   if (!message) return; // Don't proceed if message is empty
   setSubmitting(true);

   try {
     const messageData = {
       gcId: chatRoom._id,
       content: message,
       senderImage: session?.user.image,
       sender: session?.user.name,
     };

     // Emit the message to the server for real-time broadcast
     socket.current.emit("sendMessage", messageData);

     // Save the message to the database
     const response = await fetch("/api/messages/new", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(messageData),
     });

     if (!response.ok) {
       throw new Error("Failed to save message to database");
     }

     // Clear the input field after sending
     setMessage("");
   } catch (err) {
     console.error("Error sending message:", err);
   } finally {
     setSubmitting(false);
   }
 };

  
 const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const getMessages = async () => {
    if (!chatRoom?._id) return;
    try {
      const response = await fetch(`/api/messages/${chatRoom._id}`, {
        cache: "no-store",
      });
      const data = await response.json();
      setMessageList(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    // Fetch initial messages when the chatRoom ID changes
    getMessages();
  }, [chatRoom?._id, message]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  console.log(messageList)

  return (
    <div>
      <div className="messages-container h-[70vh] flex flex-col pt-10 relative overflow-auto mb-10 pr-8">
        {messageList.map((message, index) =>
          session?.user.name === message.sender ? (
            <div key={index} className="ml-12 mb-4">
              <div className="flex gap-4 text-end justify-end right-10">
                <div>
                  <div className="text-xs text-gray-400">{message.sender}</div>
                  <div className="text max-w-xl">
                      {message.content}
                  </div>
                </div>
                <div className="image">
                  <Image
                    src={message.senderImage}
                    height={40}
                    width={40}
                    alt={message._id}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="mb-4">
              <div className="flex gap-4">
                <div className="image">
                  <Image
                    src={message.senderImage}
                    height={40}
                    width={40}
                    alt={message._id}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-400">{message.sender}</div>
                  <div className="text max-w-xl">{message.content}</div>
                </div>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="send-message-container h-16 w-full bg-white rounded-full relative">
        <input
          onKeyDown={handleKeyDown}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-[90%] absolute h-16 rounded-full border-none focus:outline-none text-black px-5"
        />
        <span
          onClick={sendMessage}
          className="absolute right-10 top-[25%] text-2xl rotate-[140deg] text-black cursor-pointer"
        >
          &#11160;
        </span>
      </div>
    </div>
  );
};

export default Chat;
