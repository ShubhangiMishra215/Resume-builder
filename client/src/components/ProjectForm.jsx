import { Plus, Trash2 } from "lucide-react";
import React from "react";

const ProjectForm = ({ data, onChange }) => {
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Project</h3>
          <p className="text-xs text-gray-500">Add your Project details</p>
        </div>
        <button
          onClick={addProject}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      <div className="space-y-6 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="rounded-lg border border-gray-200 p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Project #{index + 1}
              </h4>
              <button
                onClick={() => removeProject(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                placeholder="Project Name"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                value={project.type || ""}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                placeholder="Project type"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <textarea
                type="text"
                rows={4}
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                placeholder="Describe your project"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;
