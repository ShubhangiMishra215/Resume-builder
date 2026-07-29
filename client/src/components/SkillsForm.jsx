import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({ data, onChange }) => {
    const [newSkill, setNewSkill] = useState("")

    const addSkill = () => {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill()
        }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='text-sm font-semibold text-gray-800'>Skills</h3>
                <p className='text-xs text-gray-500'>Add your technical and soft skills</p>
            </div>

            <div className='flex gap-2'>
                <input
                    className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter a skill'
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyPress}
                />

                <button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    className='inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                    <Plus size={14} />Add
                </button>
            </div>

            {data.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {data.map((skill, index) => (
                        <span
                            key={index}
                            className='inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium'
                        >
                            {skill}
                            <button
                                onClick={() => removeSkill(index)}
                                className='text-blue-400 hover:text-blue-600 transition-colors'
                            >
                                <X className='w-3 h-3' />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-10 text-center'>
                    <Sparkles className='text-gray-400' size={28} />
                    <p className='text-sm font-medium text-gray-600'>No skills added yet</p>
                    <p className='text-xs text-gray-400'>Add your technical and soft skills above</p>
                </div>
            )}

            <div>
                <p className='text-xs text-gray-500'>Add 8-12 relevant skills. Include both technical skills and soft skills</p>
            </div>
        </div>
    )
}

export default SkillsForm