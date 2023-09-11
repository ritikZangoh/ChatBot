'use client'
import Image from 'next/image'
import { ChatBlock } from '../components/chatBlock'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RiAccountPinCircleLine } from 'react-icons/ri'
import { IoIosPaper } from 'react-icons/io'
import { data } from '../data/chatBoxData'

export default function Home() {
  const [uuid, setUuid] = useState('')

  const router = useRouter()

  useEffect(() => {
    let a = localStorage.getItem('uuid')
    console.log(a)
    if (a) {
      setUuid(a)
    } else {
      router.push('/createUser')
    }
  }, [])

  return (
    <div className="">
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Your Virtual
              <br /> Assistant, Always Ready to Help!
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perspiciatis exercitationem nulla veniam aliquid et asperiores
              temporibus necessitatibus, eos, alias autem, omnis dolorum laborum
              explicabo!
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <Link
                href="/createUser"
                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                <RiAccountPinCircleLine className="mr-2 w-5 h-5" />
                Create Account
              </Link>
              <Link
                href="/integratrChatBot"
                className="inline-flex items-center justify-center w-full px-5 py-3 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <IoIosPaper className="mr-2 w-5 h-5" />
                View Documentation
              </Link>
            </div>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <Image
              src="/hero.png"
              alt="hero image"
              className="w-auto h-auto"
              width="1920"
              height="1080"
            />
          </div>
        </div>
      </section>

      {/* Component for ChatBot */}
      <ChatBlock
        uuid={uuid}
        name={data.name}
        title={data.title}
        avatar={data.avatar}
      />
    </div>
  )
}
