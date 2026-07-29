import React, { useState } from "react";
import { Check, Layout } from "lucide-react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview: "Centered header, section dividers, traditional layout",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Clean, left-aligned, no clutter",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview: "Minimal layout with profile photo",
    },
    {
      id: "modern",
      name: "Modern",
      preview: "Sidebar accent, bold headings",
    },
  ];

  // Thumbnail mockups per template.
  // "classic" matches ClassicTemplate.jsx's real structure (centered header + divider).
  // The other three are placeholders based on their names — update once those
  // template files are shared, so the thumbnails reflect their actual layouts.
  const renderThumbnail = (id) => {
    switch (id) {
      case "classic":
        return (
          <div className="w-12 h-14 bg-white border border-gray-300 rounded-sm p-1.5 flex flex-col items-center gap-1 shrink-0">
            <div className="w-6 h-1 bg-gray-500 rounded-full" />
            <div className="flex gap-0.5 mt-0.5">
              <div className="w-2 h-0.5 bg-gray-300 rounded-full" />
              <div className="w-2 h-0.5 bg-gray-300 rounded-full" />
              <div className="w-2 h-0.5 bg-gray-300 rounded-full" />
            </div>
            <div className="w-full h-px bg-gray-300 mt-1" />
            <div className="w-full space-y-0.5 mt-0.5">
              <div className="w-full h-0.5 bg-gray-300 rounded-full" />
              <div className="w-full h-0.5 bg-gray-200 rounded-full" />
              <div className="w-3/4 h-0.5 bg-gray-200 rounded-full" />
            </div>
          </div>
        );
      case "minimal":
        return (
          <div className="w-12 h-14 bg-white border border-gray-300 rounded-sm p-1.5 flex flex-col gap-1 shrink-0">
            <div className="w-7 h-1 bg-gray-500 rounded-full" />
            <div className="w-9 h-0.5 bg-gray-300 rounded-full" />
            <div className="space-y-0.5 mt-1.5">
              <div className="w-full h-0.5 bg-gray-200 rounded-full" />
              <div className="w-full h-0.5 bg-gray-200 rounded-full" />
              <div className="w-2/3 h-0.5 bg-gray-200 rounded-full" />
            </div>
          </div>
        );
      case "minimal-image":
        return (
          <div className="w-12 h-14 bg-white border border-gray-300 rounded-sm p-1.5 flex gap-1 shrink-0">
            <div className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />
            <div className="flex-1 space-y-0.5">
              <div className="w-full h-1 bg-gray-500 rounded-full" />
              <div className="w-full h-0.5 bg-gray-200 rounded-full" />
              <div className="w-full h-0.5 bg-gray-200 rounded-full" />
              <div className="w-2/3 h-0.5 bg-gray-200 rounded-full" />
            </div>
          </div>
        );
      case "modern":
        return (
          <div className="w-12 h-14 bg-white border border-gray-300 rounded-sm overflow-hidden shrink-0 flex flex-col">
            <div
              className="h-4 w-full flex flex-col justify-center px-1 gap-0.5"
              style={{ backgroundColor: "#93c5fd" }}
            >
              <div className="w-6 h-1 bg-white/90 rounded-full" />
            </div>
            <div className="flex-1 p-1 space-y-1">
              <div className="pl-1 border-l-2 border-gray-300 space-y-0.5">
                <div className="w-full h-0.5 bg-gray-400 rounded-full" />
                <div className="w-3/4 h-0.5 bg-gray-200 rounded-full" />
              </div>
              <div className="pl-1 border-l-2 border-gray-300 space-y-0.5">
                <div className="w-full h-0.5 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Layout size={14} />
        <span>Template</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg p-2 space-y-1">
          {templates.map((template) => {
            return (
              <div
                key={template.id}
                onClick={() => {
                  onChange(template.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {renderThumbnail(template.id)}

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800">{template.name}</h4>
                  <p className="text-xs text-gray-500 truncate">
                    {template.preview}
                  </p>
                </div>

                {selectedTemplate === template.id && (
                  <Check size={16} className="text-blue-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
