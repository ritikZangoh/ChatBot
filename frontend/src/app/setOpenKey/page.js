'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ClipLoader from 'react-spinners/ClipLoader'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SetOpenKey() {
  const [loading, setLoading] = useState(false)
  const [uuid, setUuid] = useState('')
  const [openKey, setOpenKey] = useState('')

  const url = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  useEffect(() => {
    let a = localStorage.getItem('uuid')
    if (a) {
      setUuid(a)
    } else {
      router.push('/createUser')
    }
  }, [])

  // Function for handle submit of Open key form
  async function sendOpenKey(e) {
    e.preventDefault()

    if (!openKey) return
    setLoading(true)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid: uuid, openkey: openKey }),
    }

    try {
      const response = await fetch(url + '/api/set-open-key', options)
      const responseData = await response.json()

      if (response == 200) {
        toast.success(responseData.message)
        router.push('/uploadDocument')
      }
      else toast.error(responseData.error);
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto h-screen flex items-center justify-center">
      {/* Spinner */}
      <ClipLoader
        cssOverride={{ position: 'absolute', top: '20px', right: '50%' }}
        loading={loading}
      />
      <form className="w-96" onSubmit={sendOpenKey}>
        <div className="mb-6 w-full">
          <label
            htmlFor="key"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Open Key
          </label>
          <input
            type="text"
            id="key"
            value={openKey}
            onChange={(e) => setOpenKey(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="Enter Your Open Ai Key"
            required
          />
        </div>

        <button
          type="submit"
          className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
