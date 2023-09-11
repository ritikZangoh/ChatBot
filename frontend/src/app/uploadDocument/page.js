'use client'
import React, { useEffect, useState, useRef } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { useRouter } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function UploadDocument() {
  const [loading, setLoading] = useState(false)
  const [uuid, setUuid] = useState('')
  const file = useRef()

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

  // Function for handle upload file
  async function uploadFile(e) {
    e.preventDefault()

    if (!file.current.files[0]) return
    setLoading(true)
    toast.info('Uploading document')

    const formData = new FormData()

    formData.append('file', file.current.files[0])
    formData.append('uuid', uuid)

    console.log(formData)
    console.log(file.current.files[0])

    const options = {
      method: 'POST',
      body: formData,
    }

    try {
      const response = await fetch(url + '/api/upload', options)
      const responseData = await response.json()

      if (response.ok) {
        toast.success('Document upload successfully')
        router.push('/integrateChatBot')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message)
      // Handle errors here
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
      <form className="items-center justify-center w-96" onSubmit={uploadFile}>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="large_size"
        >
          Large file input
        </label>
        <input
          ref={file}
          required
          className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="large_size"
          type="file"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white text-2xl font-bold mt-5 rounded-lg py-2"
        >
          Upload
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
