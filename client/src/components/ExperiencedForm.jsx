import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import api from '../configs/api'

const ExperiencedForm = ({ data, onChange }) => {

    const { token } = useSelector(state => state.auth)
    const [generatingIndex, setGeneratingIndex] = useState(-1)

    const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false,
        }
        onChange([...data, newExperience])
    }

    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }

    const updateExperience = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const generateDescription = async (index) => {
        setGeneratingIndex(index)
        const experience = data[index]
        const prompt = `Enhance this job description ${experience.description} for the 
        position of ${experience.position} at ${experience.company}`

        try {
            const response = await api.post(`/api/ai/enhance-job-desc`,
                { userContent: prompt }, { headers: { Authorization: token } }
            )
            updateExperience(index, "description", response.data.enhancedDescription)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setGeneratingIndex(-1)
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-sm font-semibold text-gray-800'>Professional Experience</h3>
                    <p className='text-xs text-gray-500'>Add your job experience</p>
                </div>
                <button
                    onClick={addExperience}
                    className='inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium  transition-colors
                    bg-green-100 text-green-700 hover:bg-green-200'
                >
                    <Plus size={14} />
                    Add experience
                </button>
            </div>

            {data.length === 0 ? (
                <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-10 text-center'>
                    <Briefcase className='text-gray-400' size={28} />
                    <p className='text-sm font-medium text-gray-600'>No work experience added yet</p>
                    <p className='text-xs text-gray-400'>Click "Add Experience" to get started.</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {data.map((experience, index) => (
                        <div key={index} className='rounded-lg border border-gray-200 p-4 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <h4 className='text-sm font-medium text-gray-700'>Experience #{index + 1}</h4>
                                <button
                                    onClick={() => removeExperience(index)}
                                    className='text-gray-400 hover:text-red-500 transition-colors'
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                <input
                                    type="text"
                                    value={experience.company || ""}
                                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                                    placeholder='Company Name'
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />

                                <input
                                    type="text"
                                    value={experience.position || ""}
                                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                                    placeholder='Job title'
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />

                                <input
                                    type="month"
                                    value={experience.start_date || ""}
                                    onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />

                                <input
                                    type="month"
                                    value={experience.end_date || ""}
                                    onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                                    disabled={experience.is_current}
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400'
                                />
                            </div>

                            <label className='flex items-center gap-2 text-sm text-gray-600'>
                                <input
                                    type='checkbox'
                                    checked={experience.is_current || false}
                                    onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                                    className='rounded border-gray-300'
                                />
                                <span>Currently working here</span>
                            </label>

                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-sm font-medium text-gray-700'>Job Description</label>
                                    <button
                                        onClick={() => generateDescription(index)}
                                        disabled={generatingIndex === index || !experience.position || !experience.company}
                                        className='inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                                        {
                                            generatingIndex === index
                                                ? <Loader2 className='w-3 h-3 animate-spin' />
                                                : (
                                                    <Sparkles size={12} />
                                                )
                                        }

                                        {generatingIndex === index ? "Enhancing..." : "Enhance with AI"}
                                    </button>
                                </div>
                                <textarea
                                    value={experience.description || ""}
                                    rows={4}
                                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                                    placeholder='Describe your key responsibility and achievements....'
                                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperiencedForm