import React from 'react'
import { User, Upload, Mail, Phone, MapPin, Briefcase, Link2, Globe } from 'lucide-react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const fields = [
    { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
    { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    { key: "profession", label: "Profession", icon: Briefcase, type: "text" },
    { key: "linkedin", label: "LinkedIn Profile", icon: Link2, type: "url" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-500 mt-1">Get started with your personal information</p>
      </div>

      {/* Image upload */}
      <div className="space-y-3">
        <label className="flex items-center gap-4 cursor-pointer">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center shrink-0">
            {data.image ? (
              <img
                src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                alt="user-image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400 px-1">
                <User size={20} />
                <span className="text-[10px] leading-tight">Upload photo</span>
              </div>
            )}
          </div>

          <span className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload size={14} />
            {data.image ? "Change Photo" : "Upload Photo"}
          </span>

          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => handleChange("image", e.target.files[0])}
            className="hidden"
          />
        </label>

        {typeof data.image === 'object' && data.image && (
          <div className="flex items-center gap-2 pl-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground(prev => !prev)}
                checked={removeBackground}
              />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors"></div>
              <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></span>
            </label>
            <span className="text-sm text-gray-600">Remove background</span>
          </div>
        )}
      </div>

      {/* Text fields */}
      <div className="space-y-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon size={16} className="text-gray-500" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              <input
                type={field.type}
                value={data[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                required={field.required}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalInfoForm