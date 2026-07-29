import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />
      case "classic":
        return <ClassicTemplate data={data} accentColor={accentColor} />
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />
    }
  }

  return (
    <div className="flex justify-center bg-gray-100 rounded-lg p-4 overflow-auto">
      <div
        id="resume-preview"
        className={`w-full max-w-[10.5in] bg-white shadow-lg rounded-md ${classes}`}
      >
        {renderTemplate()}
      </div>
    </div>
  )
}

export default ResumePreview