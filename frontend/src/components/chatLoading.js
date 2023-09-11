import React from 'react'
import Image from 'next/image'
import { Icon } from '@iconify/react'

export const ChatLoading = ({ theme, color, avatar }) => {
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
        <Icon
          className="h-6 w-10 scale-[2] text-purple-600"
          style={{ color: theme }}
          icon="eos-icons:three-dots-loading"
        />
      </div>
    </div>
  )
}
