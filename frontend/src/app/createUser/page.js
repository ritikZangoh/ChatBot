'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function CreateUser() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [uuid, setUuid] = useState('')
  const [userId, setUserId] = useState('')

  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!localStorage.getItem('auth')) {
      router.push('/login')
    }
    setUserId(localStorage.getItem('user-id'))
  }, [])

  useEffect(() => {
    localStorage.setItem('uuid', uuid)
  }, [uuid])

  // Function for handle submit
  async function createUserAccount(e) {
    e.preventDefault()

    if (!name || !role) return
    setLoading(true)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, role: role, user_id: userId }),
    }

    try {
      const response = await fetch(url + '/api/user/create', options)
      const responseData = await response.json()

      if (response.status == 200) {
        setUuid(responseData.uuid)
        toast.success(responseData.message)
      } else toast.error(responseData.error)
    } catch (error) {
      console.error('Error:', error)
      // Handle errors here
    }

    setLoading(false)
  }

  // Function for move to next page
  function nextPage() {
    router.push('/setOpenKey')
  }

  // Function for copy to clipboard
  const copyMeOnClipboard = () => {
    navigator.clipboard.writeText(uuid)
    toast.success(`Copied`)
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      {/* Spinner */}
      <ClipLoader
        cssOverride={{ position: 'absolute', top: '20px', right: '50%' }}
        loading={loading}
      />

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your chatbot
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={createUserAccount}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter Your Full Name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter Your Role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create Account
              </button>
            </form>

            {uuid && (
              <>
                <div class="">
                  <input
                    class="border-purple-500 border-solid border rounded py-2 w-3/4 px-4"
                    type="text"
                    placeholder="Enter some text"
                    value={uuid}
                    id="copyMe"
                  />
                  <button
                    class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 ml-2 px-5 border border-purple-700 rounded"
                    onClick={copyMeOnClipboard}
                  >
                    Copy
                  </button>
                </div>
                <button
                  onClick={nextPage}
                  className="text-white mt-0 bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast container */}
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
    </section>
  )
}

export default CreateUser
