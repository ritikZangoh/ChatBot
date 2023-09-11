import React from 'react'
import Image from 'next/image'

export const ReciveChat = ({ msg, theme, color, avatar }) => {
  return (
    <div className="m-2 flex items-center mb-6">
      <Image
        src={avatar ? avatar : '/chat-bot-logo.png'}
        className=""
        width={30}
        height={30}
        alt={'error'}
      />
      <div className="bg-white py-1 px-3 relative top-3 ml-2 rounded-e-lg rounded-bl-lg shadow shadow-gray-200 max-w-72 ">
        <p
          className="text-purple-600 sm:max-w-[16rem] max-w-[14rem]"
          style={{ color: theme }}
        >
          {msg}
        </p>
      </div>
    </div>
  )
}
