import { Palette, Check } from 'lucide-react'
import React, { useState } from 'react'

const ColorPicker = ({ selectedColor, onChange }) => {
    const colors = [
        { name: "Blue", value: "#3B82F6" },
        { name: "Red", value: "#EF4444" },
        { name: "Green", value: "#22C55E" },
        { name: "Yellow", value: "#EAB308" },
        { name: "Purple", value: "#A855F7" },
        { name: "Pink", value: "#EC4899" },
        { name: "Orange", value: "#F97316" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Indigo", value: "#6366F1" },
        { name: "Gray", value: "#6B7280" },
    ]

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
                <Palette size={14} />
                <span>Accent</span>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg p-3 grid grid-cols-5 gap-3">
                    {colors.map((color) => {
                        return (
                            <div
                                onClick={() => { onChange(color.value); setIsOpen(false) }}
                                key={color.value}
                                className="flex flex-col items-center gap-1 cursor-pointer"
                            >
                                <div
                                    style={{ backgroundColor: color.value }}
                                    className="size-7 rounded-full flex items-center justify-center ring-1 ring-black/10 hover:scale-110 transition-transform"
                                >
                                    {selectedColor === color.value && (
                                        <Check className="size-4 text-white" />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ColorPicker