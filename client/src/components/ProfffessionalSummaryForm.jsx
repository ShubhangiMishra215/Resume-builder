import { Loader, Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import {toast} from 'react-hot-toast'
import api from '../configs/api'

const ProfffessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  
  const {token} = useSelector(state=>state.auth)
  const [isGenerating , setIsGenerating] = useState(false);

  const generateSummary = async() =>{
    try {
      setIsGenerating(true);
      const prompt = `enhance my professional summary "${data}"`;
      const response = await api.post('/api/ai/enhance-pro-sum',
         {userContent : prompt}, {headers : {Authorization : token}}, 
        )
        console.log("API response:", response.data);
        setResumeData(prev => ({...prev, professional_summary: response.data.enhancedSummary}))
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)

    }finally{
      setIsGenerating(false)
    }
    
  }
  
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-sm font-semibold text-gray-800'>Professional Summary</h3>
          <p className='text-xs text-gray-500'>Add summary for your resume</p>
        </div>
        <button disabled={isGenerating} 
        onClick={generateSummary}
        className='inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'>
          {
            isGenerating ? (<Loader2 className='size-4 animate-spin'/>)
            : (
              <Sparkles size={14} />
            )
          }
          {
            isGenerating ? "Enhancing..." : "AI Enhance"
          }
          
        
        </button>
      </div>

      <div className='mt-6'>
        <textarea
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          value={data || ""}
          name="summary"
          id="summary"
          placeholder="e.g. Results-driven software developer with experience building full-stack applications..."
          className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
        />
        <p className='mt-1 text-xs text-gray-500'>Tip: Keep it concise — 2-4 sentences highlighting your experience and strengths.</p>
      </div>
    </div>
  )
}

export default ProfffessionalSummaryForm