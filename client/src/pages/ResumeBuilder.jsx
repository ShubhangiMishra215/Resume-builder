import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../assets/assets";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FoldersIcon,
  GraduationCap,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfffessionalSummaryForm from "../components/ProfffessionalSummaryForm";
import ExperiencedForm from "../components/ExperiencedForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [activeSectionIndex, setActiveSectionData] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const section = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FoldersIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = section[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get("/api/resumes/get/" + resumeId, {
        headers: { Authorization: token },
      });
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, []);

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });
      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving resume", error);
    }
  };

  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData);

      //remove image from updatedResumeData
      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResumeData.personal_info.image;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === "object" &&
        formData.append("image", resumeData.personal_info.image);
      const { data } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });
      setResumeData(data.resume);
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving resume", error);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      alert("Share not supported on this browser");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <Link
          to={"/app"}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon size={18} /> Back to Dashboard
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
          {/* Left Panel */}
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
            <div>
              {/* progress bar using activeSectionIndex */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-gray-500">
                  <span>
                    Step {activeSectionIndex + 1} of {section.length}
                  </span>
                  <span>{activeSection.name}</span>
                </div>
                <hr className="border-gray-200" />
                <hr
                  className="border-blue-500 border-t-2 -mt-[1px] transition-all duration-300"
                  style={{
                    width: `${(activeSectionIndex * 100) / (section.length - 1)}%`,
                  }}
                />
              </div>

              {/* section navigation */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(newTemplate) =>
                      setResumeData((prev) => ({
                        ...prev,
                        template: newTemplate,
                      }))
                    }
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionData((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={activeSectionIndex === 0}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionData((prev) =>
                        Math.min(prev + 1, section.length - 1),
                      )
                    }
                    className={`ml-auto inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:cursor-not-allowed ${
                      activeSectionIndex === section.length - 1
                        ? "opacity-50"
                        : ""
                    }`}
                    disabled={activeSectionIndex === section.length - 1}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>

                {/* Form Content */}
                <div className="pt-2">
                  {activeSection.id === "personal" && (
                    <PersonalInfoForm
                      data={resumeData.personal_info}
                      onChange={(data) =>
                        setResumeData((prev) => ({
                          ...prev,
                          personal_info: data,
                        }))
                      }
                      removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}
                    />
                  )}
                  {activeSection.id === "summary" && (
                    <ProfffessionalSummaryForm
                      data={resumeData.professional_summary}
                      onChange={(data) =>
                        setResumeData((prev) => ({
                          ...prev,
                          professional_summary: data,
                        }))
                      }
                      setResumeData={setResumeData}
                    />
                  )}
                  {activeSection.id === "experience" && (
                    <ExperiencedForm
                      data={resumeData.experience}
                      onChange={(data) =>
                        setResumeData((prev) => ({ ...prev, experience: data }))
                      }
                    />
                  )}
                  {activeSection.id === "education" && (
                    <EducationForm
                      data={resumeData.education}
                      onChange={(data) =>
                        setResumeData((prev) => ({ ...prev, education: data }))
                      }
                    />
                  )}
                  {activeSection.id === "projects" && (
                    <ProjectForm
                      data={resumeData.project}
                      onChange={(data) =>
                        setResumeData((prev) => ({ ...prev, project: data }))
                      }
                    />
                  )}
                  {activeSection.id === "skills" && (
                    <SkillsForm
                      data={resumeData.skills}
                      onChange={(data) =>
                        setResumeData((prev) => ({ ...prev, skills: data }))
                      }
                    />
                  )}
                </div>

                <button
                  onClick={() =>
                    toast.promise(saveResume(), { loading: "Saving..." })
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="rounded-xl">
            <div className="flex justify-end gap-2 mb-4 items-center">
              {resumeData.public && (
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="size-4" />
                </button>
              )}

              <button
                onClick={changeResumeVisibility}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {resumeData.public ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
                {resumeData.public ? "Public" : "Private"}
              </button>

              <button
                onClick={downloadResume}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <DownloadIcon className="size-4" />
                Download
              </button>
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
