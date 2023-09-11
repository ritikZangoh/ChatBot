import React from 'react'

export const SendChat = ({ msg, time, theme, color }) => {
  return (
    <div className="m-2 mr-4 flex flex-col">
      <div
        className="ml-auto relative bg-purple-600 py-1 px-3 rounded-s-lg rounded-b-lg shadow shadow-white"
        style={{ background: theme }}
      >
        <p
          className="text-white sm:max-w-[16rem] max-w-[14rem] min-w-[2rem]"
          style={{ color: color }}
        >
          {msg}
        </p>
      </div>
      <span className="text-[10px] text-right mr-1 mt-[3px] text-black">
        {time} AM
      </span>
    </div>
  )
}
