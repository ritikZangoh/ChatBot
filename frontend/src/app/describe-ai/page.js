'use client'
import React, { useState } from 'react'
import { DM_Sans } from 'next/font/google'
import DescribeItemCard from '@/components/describeItemCard'
import { describeAiData } from '@/data/describeAi'
import { useRouter } from 'next/navigation'

const dmFont = DM_Sans({ subsets: [] })

export default function Page() {
  const [selectedCard, setSelectedCard] = useState({})

  const router = useRouter()

  function handleContinue() {
    router.push(
      `/content-generate?contentTypeIndex=${selectedCard.contentType}`,
    )
  }

  return (
    <>
      <div
        className="min-h-screen flex items-center"
        style={{ fontFamily: dmFont.style.fontFamily }}
      >
        <div className="lg:w-[920px] w-full mx-auto">
          <div className="sm:w-[600px] w-full sm:px-0 px-4 mx-auto">
            <h1 className="text-[32px] font-bold leading-[42px] -tracking-[2%]">
              How would you best describe your AI?
            </h1>

            <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 mt-8">
              {describeAiData.map((data, index) => {
                return (
                  <DescribeItemCard
                    key={index}
                    index={index}
                    data={data}
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                  />
                )
              })}
            </div>

            <button
              onClick={handleContinue}
              className="mt-8 w-full bg-secondary p-[14px] text-white border border-primary-light rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
