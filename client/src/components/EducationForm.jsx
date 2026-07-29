import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const EducationForm = ({ data, onChange }) => {

    
    const addEducation = () => {
        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: "",
        };
        onChange([...data, newEducation])
    };

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-sm font-semibold text-gray-800'>Education</h3>
                    <p className='text-xs text-gray-500'>Add your education details</p>
                </div>
                <button
                    onClick={addEducation}
                    className='inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200'
                >
                    <Plus size={14} />
                    Add Education
                </button>
            </div>

            {data.length === 0 ? (
                <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-10 text-center'>
                    <GraduationCap className='text-gray-400' size={28} />
                    <p className='text-sm font-medium text-gray-600'>No Education added yet</p>
                    <p className='text-xs text-gray-400'>Click "Add Education" to get started.</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {data.map((education, index) => (
                        <div key={index} className='rounded-lg border border-gray-200 p-4 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <h4 className='text-sm font-medium text-gray-700'>Education #{index + 1}</h4>
                                <button
                                    onClick={() => removeEducation(index)}
                                    className='text-gray-400 hover:text-red-500 transition-colors'
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                <input
                                    type="text"
                                    value={education.institution || ""}
                                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                    placeholder='Institute Name'
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />

                                <input
                                    type="text"
                                    value={education.degree || ""}
                                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                    placeholder='Degree'
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />

                                <input
                                    type="text"
                                    value={education.field || ""}
                                    onChange={(e) => updateEducation(index, "field", e.target.value)}
                                    placeholder='Field of Study'
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />

                                <input
                                    type="month"
                                    value={education.graduation_date || ""}
                                    onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                                    className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />
                            </div>

                            <input
                                type='text'
                                value={education.gpa || ""}
                                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                                className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                placeholder='GPA (optional)'
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EducationForm