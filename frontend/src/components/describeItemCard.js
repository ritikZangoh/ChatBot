import React from 'react'
import Image from 'next/image'

export default function DescribeItemCard({
  data,
  selectedCard,
  setSelectedCard,
  index,
}) {
  // When clicked on any card
  function clickCard(e, title) {
    if (selectedCard.ele) {
      selectedCard.ele.classList.remove('border-primary-dark')
    }
    e.target.classList.add('border-primary-dark')
    setSelectedCard({ ele: e.target, contentType: index })
  }

  return (
    <div
      className="border border-primary-light cursor-pointer hover:border-primary-dark rounded-xl pl-6 pr-2 pt-4 pb-6"
      onClick={(e) => clickCard(e, data.title)}
    >
      <Image
        className="w-[46px] h-[46px]"
        src={data.icon}
        width={200}
        height={200}
      />
      <h2 className="text-xs leading-[21px] mt-4 font-bold">{data.title}</h2>
      <p className="text-[11px] text-[#425466] leading-[16px]">
        {data.description}
      </p>
    </div>
  )
}
