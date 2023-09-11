import React from 'react'
import Link from 'next/link'

export default function IntegrateChatBot() {
  return (
    <div className="container mx-auto flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-4 mt-4 text-center">
        Integrate in your website
      </h1>

      <div className="mb-6 mt-10">
        <pre className="bg-gray-200 p-4 rounded-md">
          <code>{`<embed \n\ttype="text/html" \n\tsrc="http://localhost:3000/embed/chatbot?key=ENTER_YOUR_KEY" \n\tstyle="position: fixed; bottom: 0px; right: 0px;" width="384" height="650px"\n> `}</code>
        </pre>
        <p className="mt-4">
          To get key visit {/* link to generate key for chat bot */}
          <Link className="text-blue-500" href="/createUser">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  )
}
