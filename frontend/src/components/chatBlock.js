'use client'
import React, { Component, useEffect } from 'react'
import { useState, useRef } from 'react'
import { AiOutlineMessage, AiOutlineCloseCircle } from 'react-icons/ai'
import { BiSend } from 'react-icons/bi'
import { SendChat } from './sendChat'
import { ReciveChat } from './reciveChat'
import Image from 'next/image'
import { ChatLoading } from './chatLoading'
import io, { connect } from 'socket.io-client'

export const ChatBlock = ({ uuid, name, title, avatar, color, theme }) => {
  const [toggleChat, setToggleChat] = useState(false)
  const [chatList, setChatList] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const chatContainerScroll = useRef()
  const [chatLoader, setChatLoader] = useState(false)

  const [socket, setSocket] = useState(null)

  const url = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    scrollToDown(chatContainerScroll.current)
  }, [chatList])

  useEffect(() => {
    setChatList([{ type: 'recive', msg: 'Hey!' }])
  }, [])

  useEffect(() => {
    // Intialize socket
    const newSocket = io.connect(process.env.NEXT_PUBLIC_API_URL, {
      pingInterval: 25000, // Adjust as needed
      pingTimeout: 60000, // Adjust as needed
    })
    setSocket(newSocket)

    // Connect with socket
    newSocket.on('connect', () => {
      console.log('Connected to server')
      newSocket.emit('join')
    })

    // Join room
    newSocket.on('join', (data) => {
      console.log(data)
    })

    // Listen event for message
    newSocket.on('message', (data) => {
      setChatList((oldChat) => [...oldChat, { type: 'recive', msg: data.msg }])
      setChatLoader(false)
    })

    // Disconnect with socket
    return () => {
      newSocket.emit('disconnect')
    }
  }, [])

  // Function for scroll down
  function scrollToDown(scrollContainer) {
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }

  // Function for send Message
  const sendChatMessage = (e) => {
    e.preventDefault()

    if (!chatMessage) return
    setChatLoader(true)

    setChatList((oldChat) => [
      ...oldChat,
      {
        type: 'send',
        msg: chatMessage,
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      },
    ])
    socket.emit('message', { msg: chatMessage, uuid: uuid })

    setChatMessage('')
  }

  return (
    <div className="absolute bottom-10 right-10">
      {toggleChat && (
        <div
          className="sm:w-96 w-80 h-[32rem] shadow-md border mb-8 rounded-xl bg-purple-600 overflow-hidden box-content"
          style={{ background: theme }}
        >
          <div
            className="p-2 bg-purple-600 h-[3rem] mt-4 flex items-center"
            style={{ background: theme }}
          >
            <div className="flex items-center px-2 py-1 w-full">
              <div className="">
                <Image
                  src={avatar ? avatar : '/chat-bot-logo.png'}
                  className="border-2 border-white rounded-full overflow-hidden"
                  width={42}
                  height={42}
                  alt={'error'}
                />
              </div>
              <div className="ml-3 mt-1">
                <h2
                  className="text-2xl leading-3 text-white font-bold"
                  style={{ color: color }}
                >
                  {name ? name : 'Chat Bot'}
                </h2>
                <p
                  className="text-white leading-3 mt-2 text-xs"
                  style={{ color: color }}
                >
                  {title ? title : 'Lorem, ipsum.'}
                </p>
              </div>
            </div>
          </div>
          <div className="chat m-1 bg-gray-200 rounded-lg h-[27rem] relative mt-3 shadow-inner">
            <div
              id="chat-container"
              className="chat-container h-[23rem] overflow-y-scroll overflow-x-hidden"
              ref={chatContainerScroll}
            >
              {chatList.map((chat, index) => {
                if (chat.type === 'send') {
                  // Component for send chat tile
                  return (
                    <SendChat
                      msg={chat.msg}
                      time={chat.time}
                      key={index}
                      color={color}
                      theme={theme}
                    />
                  )
                } else {
                  // Component for recive chat tile
                  return (
                    <ReciveChat
                      msg={chat.msg}
                      key={index}
                      color={color}
                      theme={theme}
                      avatar={avatar}
                    />
                  )
                }
              })}

              {/* Loader for response */}
              {chatLoader && <ChatLoading />}
            </div>
            <div className="chat-send absolute p-1 bottom-0">
              <form
                className="w-full flex items-center"
                onSubmit={(e) => sendChatMessage(e)}
              >
                <input
                  type="text"
                  className="p-2 rounded-lg border-2 sm:w-80 w-64 shadow-inner"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button
                  className="p-2 ml-2 h-full rounded-lg shadow-sm bg-purple-600"
                  style={{ background: theme }}
                >
                  <BiSend
                    className="text-white w-6 h-6"
                    style={{ color: color }}
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="text-right ">
        <button
          className="p-2 bg-purple-600 rounded-full hover:scale-110"
          style={{ background: theme }}
          onClick={() => setToggleChat(!toggleChat)}
        >
          {!toggleChat ? (
            <AiOutlineMessage
              className="text-white font-bold w-8 h-8"
              style={{ color: color }}
            />
          ) : (
            <AiOutlineCloseCircle
              className="text-white font-bold w-8 h-8"
              style={{ color: color }}
            />
          )}
        </button>
      </div>
    </div>
  )
}
