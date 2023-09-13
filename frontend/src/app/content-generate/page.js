'use client'
import React, { useState, useRef, useEffect } from 'react'
import { DM_Sans } from 'next/font/google'
import Image from 'next/image'
import GuideLinesCard from '@/components/guideLinesCard'
import { toast } from 'react-toastify'
import { describeAiData } from '@/data/describeAi'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

const dmFont = DM_Sans({ subsets: [] })

export default function Page() {
  const [pirateLang, setPirateLang] = useState('')
  const [haveDoc, setHaveDoc] = useState(false)
  const [uuid, setUuid] = useState(null)
  const [wantGuideLines, setWantGuideLines] = useState(false)
  const [inputGuideLine, setInputGuideLine] = useState('')
  const [guideLines, setGuideLines] = useState([])
  const [responceLength, setResponceLength] = useState('')
  const [inputData, setInputData] = useState('')
  const [responceData, setResponceData] = useState('')

  const file = useRef()
  const router = useRouter()
  const searchParams = useSearchParams()

  const contentTypeIndex = searchParams.get('contentTypeIndex')

  const url = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    let a = localStorage.getItem('uuid')
    if (a) {
      setUuid(a)
    } else {
      router.push('/createUser')
    }
  }, [])

  // To add new guide lines
  function handleGuideLines(e) {
    if (e.key === 'Enter') {
      console.log('enter')
      setGuideLines([...guideLines, inputGuideLine])
      setInputGuideLine('')
    }
  }

  // To upload file
  async function handleUploadFile() {
    if (!file.current.files[0]) return
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
  }

  // To generate Content
  async function handleGenerateContent(e) {
    e.preventDefault()

    setLoading(true)

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: uuid,
        modalid: '',
        title: describeAiData[contentTypeIndex].title,
        description: describeAiData[contentTypeIndex].description,
        sampleFile: '',
        guidelines: guideLines,
        responceSize: responceLength,
        paid: true,
      }),
    }

    try {
      const response = await fetch(url + '/api/content-generation', options)
      const responseData = await response.json()

      if (response.status == 200) {
        setResponceData(responceData.msg)
      } else {
        toast.error(responseData.error)
      }
    } catch (error) {
      console.error('Error:', error)
      // Handle errors here
    }

    setLoading(false)
  }

  return (
    <div
      className="mx-auto flex w-[1440px] min-h-screen"
      style={{ fontFamily: dmFont.style.fontFamily }}
    >
      {/* left side filter section */}
      <div className="bg-primary-bg w-[635px] h-full pl-16 py-[50px] min-h-screen">
        <h2 className="text-base font-bold text-[#27272E]">
          What type of content are you creating?
        </h2>

        <input
          onChange={(e) => setPirateLang(e.target.value)}
          value={pirateLang}
          className="mt-[10px] py-2 px-3 w-[534px] bg-white rounded-lg shadow-sm"
          type="text"
          placeholder="e.g. Rewrite a blog post in pirate language"
        />

        <h2 className="text-base font-bold mt-6 text-[#27272E]">
          Do you have any sample data to upload?
        </h2>

        <div className="mt-[13px] flex">
          <div className="w-36 py-3 px-3">
            <input
              className="accent-primary-dark"
              onChange={(e) => setHaveDoc(true)}
              type="radio"
              name="have-doc"
              id="yes"
              value="ture"
            />
            <label className="ml-4" htmlFor="yes">
              Yes
            </label>
          </div>
          <div className="w-36 py-3 pr-3">
            <input
              className="accent-primary-dark"
              onChange={(e) => setHaveDoc(false)}
              type="radio"
              name="have-doc"
              id="no"
              value="false"
            />
            <label className="ml-4" htmlFor="no">
              No
            </label>
          </div>
        </div>

        {haveDoc && (
          <>
            <p className="text-base mt-4 text-[#27272E]">
              Please Upload the Sample Data
            </p>

            <div className="mt-2 border w-32 border-primary-dark rounded-md flex justify-center items-center py-3 px-[24.7px]">
              <Image
                src="/upload.svg"
                className="text-primary-dark font-semibold"
                width={15}
                height={15}
              />
              <input
                hidden
                type="file"
                ref={file}
                onChange={handleUploadFile}
                name="file"
                id="file"
              />
              <label
                className="text-primary-dark text-[14.8px] ml-2"
                htmlFor="file"
              >
                Upload
              </label>
            </div>
          </>
        )}

        <h2 className="text-base font-bold mt-6 text-[#27272E]">
          Do you want to provide specific guidelines or style preferences?
        </h2>

        <div className="mt-[13px] flex">
          <div className="w-36 py-3 px-3">
            <input
              className="accent-primary-dark"
              onChange={(e) => setWantGuideLines(true)}
              type="radio"
              name="guidelines-state"
              id="yes1"
              value="ture"
            />
            <label className="ml-4" htmlFor="yes1">
              Yes
            </label>
          </div>
          <div className="w-36 py-3 pr-3">
            <input
              className="accent-primary-dark"
              onChange={(e) => setWantGuideLines(false)}
              type="radio"
              name="guidelines-state"
              id="no1"
              value="false"
            />
            <label className="ml-4" htmlFor="no1">
              No
            </label>
          </div>
        </div>

        {wantGuideLines && (
          <>
            <p className="text-base mt-4 text-[#27272E]">
              Please enter the guidelines
            </p>

            <input
              onKeyDown={handleGuideLines}
              onChange={(e) => setInputGuideLine(e.target.value)}
              value={inputGuideLine}
              className="mt-[13.4px] py-2 px-3 w-[534px] bg-white rounded-lg shadow-sm"
              type="text"
              placeholder="e.g. Casual tone, Formal language"
            />

            {/* guidelines container */}
            <div className="flex flex-wrap mt-6">
              {guideLines.map((data, i) => (
                <GuideLinesCard key={i} data={data} />
              ))}
            </div>
          </>
        )}

        <h2 className="text-base font-bold mt-6 text-[#27272E]">
          How long should your AI generated responce be?
        </h2>

        <div className="mt-[13px] w-[534px] flex flex-wrap">
          <div className="w-1/2 py-3 px-3">
            <input
              className="accent-primary-dark"
              onChange={(e) => setResponceLength('Less than 50')}
              type="radio"
              name="responce-len"
              id="1"
              value="ture"
            />
            <label className="ml-4" htmlFor="1">
              Short (Under 50 words)
            </label>
          </div>
          <div className="w-1/2 py-3 pr-3">
            <input
              className="accent-primary-dark"
              onChange={(e) => setResponceLength('Between 51-250')}
              type="radio"
              name="responce-len"
              id="2"
              value="false"
            />
            <label className="ml-4" htmlFor="2">
              Medium (51-250 words)
            </label>
          </div>
          <div className="w-1/2 py-3 px-3">
            <input
              className="accent-primary-dark"
              onChange={(e) => setResponceLength('More than 251')}
              type="radio"
              name="responce-len"
              id="3"
              value="false"
            />
            <label className="ml-4" htmlFor="3">
              Long (251 words+)
            </label>
          </div>
        </div>

        <h2 className="text-base font-bold mt-6 text-[#27272E]">
          Need Help? Watch this quick video
        </h2>
      </div>

      {/* right side content generation section */}
      <div className="py-[50px] px-[30px] relative min-w-[804px]">
        <h2 className="text-lg font-bold text-[#27272E]">Input Data</h2>

        <span className="text-xs absolute top-[50px] right-[30px]">
          221/2048
        </span>

        {/* input to generate content */}
        <form
          onSubmit={handleGenerateContent}
          className="mt-5 w-[730px] relative shadow-md px-5 py-2 bg-white rounded-md"
        >
          <textarea
            onChange={(e) => setInputData(e.target.value)}
            value={inputData}
            className="w-[650px]"
            type="text"
            placeholder="Enter your content"
            required
          />

          <button type="submit" className="absolute top-4 right-4">
            <Image src="/send.svg" width={25} height={25} alt="send" />
          </button>
        </form>

        <hr className="mt-5" />

        <h2 className="text-lg font-bold mt-[22px] text-[#27272E]">
          Input Data
        </h2>

        {/* responce of input data */}
        <p className="text-lg w-[730px] text-[#616161]">{responceData}</p>

        <div className="text-right mt-6">
          <button className="mt-8 bg-secondary py-4 px-7 text-white border border-primary-light rounded-lg">
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
