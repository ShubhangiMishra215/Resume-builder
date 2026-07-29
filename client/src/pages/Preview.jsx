import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'
import api from '../configs/api'


const Preview = () => {
  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadResume = async () => {
   try {
    const {data} = await api.get('/api/resumes/public/' + resumeId)
    setResumeData(data.resume)
   } catch (error) {
    console.log(error.message)
   }finally{
    setIsLoading(false)
   }
  }

  useEffect(() => {
    loadResume()
  }, [])

  return resumeData ? (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="mx-auto max-w-4xl rounded-xl bg-white shadow-sm p-6">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
        />
      </div>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="text-center">
          <p className="mb-4 text-gray-600 font-medium">Resume not found</p>
          
          <a  href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
            Go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview