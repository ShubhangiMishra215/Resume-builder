import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const {user,token} = useSelector(state=>state.auth)

  const [allResumes, setAllResumes] = useState([]);

  const [showCreateResumes, setShowCreateResumes] = useState(false);
  const [showUploadResumes, setShowUploadResumes] = useState(false);

  const [title, setTitle] = useState("");

  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");

  const [isLoading ,setIsLoading] = useState(false);

  const navigate = useNavigate();

  const colors = [
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#64748b", // slate
];

  const loadAllResumes = async () => {
    try {
      const {data} = await api.get('/api/users/resumes', {headers :{Authorization:token}})
      setAllResumes(data.resumes ?? [])
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const {data} = await api.post('/api/resumes/create', {title}, {
        headers:{Authorization:token}
      })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResumes(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume)
      const {data} = await api.post('/api/ai/upload-resume', {title,resumeText},
        {headers:{Authorization:token}}
      )
      setTitle('');
      setResume(null)
      setShowUploadResumes(false)

      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  };

  const editTitle = async (event) => {
    event.preventDefault();
    try {
      const {data} = await api.put(`/api/resumes/update`,{resumeId:editResumeId, resumeData:{title}},
          {headers:{Authorization:token}}
        )
        setAllResumes(allResumes.map(resume=>resume._id===editResumeId ? {
          ...resume,title} : resume))
          setTitle('')
          setEditResumeId('')
          toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume ?"
      );

      if (confirm) {
        const {data} = await api.delete(`/api/resumes/delete/${resumeId}`,
          {headers:{Authorization:token}}
        )
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }

  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-2xl font-medium text-green-900 mb-6">
          Welcome, Anshi
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResumes(true)}
            className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 px-6 py-3 rounded-full transition-all active:scale-95"
          >
            <PlusIcon size={18} />
            <p>Create Resume</p>
          </button>

          <button
            onClick={() => setShowUploadResumes(true)}
            className="flex items-center gap-2 bg-white hover:bg-green-50 text-green-700 border border-green-300 px-6 py-3 rounded-full transition-all active:scale-95"
          >
            <UploadCloudIcon size={18} />
            <p>Upload Existing</p>
          </button>
        </div>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 max-w-4xl mx-auto px-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];

          return (
            <button
              key={resume._id}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className="flex flex-col gap-2 items-start p-4 rounded-xl border text-left w-full sm:w-56"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + "40",
              }}
            >
              <FilePenLineIcon style={{ color: baseColor }} />

              <p className="font-medium text-slate-800">{resume.title}</p>

              <p className="text-xs text-slate-500">
                Updated on{" "}
                {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              <div
                onClick={(e) => e.stopPropagation()}
                className="flex gap-3 mt-1"
              >
                <TrashIcon
                  size={16}
                  className="text-slate-500 hover:text-red-500 cursor-pointer"
                  onClick={() => deleteResume(resume._id)}
                />

                <PencilIcon
                  size={16}
                  className="text-slate-500 hover:text-green-600 cursor-pointer"
                  onClick={() => {
                    setEditResumeId(resume._id);
                    setTitle(resume.title);
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Create Resume */}

      {showCreateResumes && (
        <form
          onSubmit={createResume}
          onClick={() => setShowCreateResumes(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-96 relative"
          >
            <h2 className="text-xl font-semibold mb-4">
              Create a Resume
            </h2>

            <input
              type="text"
              placeholder="Enter resume title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded p-2 mb-4"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Resume
            </button>

            <XIcon
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setShowCreateResumes(false);
                setTitle("");
              }}
            />
          </div>
        </form>
      )}

      {/* Upload Resume */}

      {showUploadResumes && (
        <form
          onSubmit={uploadResume}
          onClick={() => setShowUploadResumes(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-96 relative"
          >
            <h2 className="text-xl font-semibold mb-4">
              Upload Resume
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Enter resume title"
              required
              className="w-full border rounded p-2 mb-4"
            />

            <div className="mb-4">
              <label htmlFor="resume-input" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2">
                  {isLoading ? (
                    <>
                      <LoaderCircleIcon className="animate-spin size-5" />
                      <p>Uploading...</p>
                    </>
                  ) : resume ? (
                    <p>{resume.name}</p>
                  ) : (
                    <>
                      <UploadIcon />
                      <p>Upload Resume</p>
                    </>
                  )}
                </div>
              </label>

              <input
                id="resume-input"
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => setResume(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Upload Resume
            </button>

            <XIcon
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setShowUploadResumes(false);
                setTitle("");
                setResume(null);
              }}
            />
          </div>
        </form>
      )}

      {/* Edit Resume */}

      {editResumeId && (
        <form
          onSubmit={editTitle}
          onClick={() => setEditResumeId("")}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-96 relative"
          >
            <h2 className="text-xl font-semibold mb-4">
              Edit Resume Title
            </h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resume title"
              required
              className="w-full border rounded p-2 mb-4"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <XIcon
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
