import React from 'react'

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
    </div>
  )
}

export default Loader