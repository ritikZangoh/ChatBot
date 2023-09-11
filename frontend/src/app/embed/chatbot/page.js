'use client'
import { ChatBlock } from '@/components/chatBlock'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()

  const key = searchParams.get('key')
  const theme = searchParams.get('theme')
  const color = searchParams.get('color')

  useEffect(() => {
    console.log(key)
  }, [])

  return <ChatBlock uuid={key} theme={theme} color={color} />
}
