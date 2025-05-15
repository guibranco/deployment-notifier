import React from 'react';
import { DeploymentProject, DeploymentTask } from '../types/deployment';
import { Trash2, Plus, Github, GitBranch, Trello, CircleDot } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProjectFormProps {
  project: DeploymentProject;
  onChange: (updatedProject: DeploymentProject) => void;
  onRemove: () => void;
  showVersion?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onChange, onRemove, showVersion = true }) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...project, name: e.target.value });
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...project, version: e.target.value });
  };

  const handleVersionLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...project, versionLink: e.target.value });
  };

  const handleVersionSystemChange = (system: DeploymentProject['versionSystem']) => {
    onChange({ ...project, versionSystem: system });
  };

  const handleTaskSystemChange = (system: DeploymentProject['taskSystem']) => {
    onChange({ ...project, taskSystem: system });
  };

  const handleTaskChange = (taskId: string, field: keyof DeploymentTask, value: string) => {
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, [field]: value } : task
    );
    onChange({ ...project, tasks: updatedTasks });
  };

  const handleAddTask = () => {
    const newTask: DeploymentTask = {
      id: uuidv4(),
      description: '',
    };
    onChange({ ...project, tasks: [...project.tasks, newTask] });
  };

  const handleRemoveTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
    onChange({ ...project, tasks: updatedTasks });
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Project Details</h3>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Remove project"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div>
        <div className="mb-4">
          <label htmlFor={`project-name-${project.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Repository / Project
          </label>
          <input
            id={`project-name-${project.id}`}
            type="text"
            value={project.name}
            onChange={handleNameChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b] transition-colors"
          />
        </div>

        {showVersion && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CI Pipeline
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleVersionSystemChange('github')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    project.versionSystem === 'github'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Github size={16} className="mr-1" />
                  GitHub
                </button>
                <button
                  onClick={() => handleVersionSystemChange('azure')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    project.versionSystem === 'azure'
                      ? 'bg-[#79378b] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <GitBranch size={16} className="mr-1" />
                  Azure DevOps
                </button>
                <button
                  onClick={() => handleVersionSystemChange('gitlab')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    project.versionSystem === 'gitlab'
                      ? 'bg-[#93cd3f] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <GitBranch size={16} className="mr-1" />
                  GitLab
                </button>
                <button
                  onClick={() => handleVersionSystemChange('circleci')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    project.versionSystem === 'circleci'
                      ? 'bg-[#79378b] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CircleDot size={16} className="mr-1" />
                  CircleCI
                </button>
                <button
                  onClick={() => handleVersionSystemChange('appveyor')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    project.versionSystem === 'appveyor'
                      ? 'bg-[#93cd3f] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <GitBranch size={16} className="mr-1" />
                  AppVeyor
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={`project-version-${project.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Release Version
                </label>
                <input
                  id={`project-version-${project.id}`}
                  type="text"
                  value={project.version}
                  onChange={handleVersionChange}
                  placeholder="e.g., 1.0.0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b] transition-colors"
                />
              </div>
              <div>
                <label htmlFor={`project-version-link-${project.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Version Link (optional)
                </label>
                <input
                  id={`project-version-link-${project.id}`}
                  type="url"
                  value={project.versionLink || ''}
                  onChange={handleVersionLinkChange}
                  placeholder="e.g., https://github.com/org/repo/releases/tag/1.0.0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b] transition-colors"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Included Tasks / Features</label>
          <button
            onClick={handleAddTask}
            className="flex items-center text-[#79378b] hover:text-[#93cd3f] text-sm transition-colors"
          >
            <Plus size={16} className="mr-1" /> Add Task
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Tracking System
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTaskSystemChange('jira')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                project.taskSystem === 'jira'
                  ? 'bg-[#79378b] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <GitBranch size={16} className="mr-1" />
              Jira
            </button>
            <button
              onClick={() => handleTaskSystemChange('trello')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                project.taskSystem === 'trello'
                  ? 'bg-[#93cd3f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Trello size={16} className="mr-1" />
              Trello
            </button>
            <button
              onClick={() => handleTaskSystemChange('github')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                project.taskSystem === 'github'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Github size={16} className="mr-1" />
              GitHub
            </button>
            <button
              onClick={() => handleTaskSystemChange('azure')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                project.taskSystem === 'azure'
                  ? 'bg-[#79378b] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <GitBranch size={16} className="mr-1" />
              Azure DevOps
            </button>
          </div>
        </div>

        {project.tasks.map((task) => (
          <div key={task.id} className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={task.ticketNumber || ''}
                onChange={(e) => handleTaskChange(task.id, 'ticketNumber', e.target.value)}
                placeholder={project.taskSystem === 'jira' ? 'PROJ-123' : 
                           project.taskSystem === 'github' ? '#123' :
                           project.taskSystem === 'azure' ? '#123' :
                           project.taskSystem === 'trello' ? 'Card URL' : 'Ticket #'}
                className="w-36 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b] transition-colors"
              />
              <input
                type="text"
                value={task.description}
                onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                placeholder="Task description"
                className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b] transition-colors"
              />
              <button
                onClick={() => handleRemoveTask(task.id)}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Remove task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {project.tasks.length === 0 && (
          <p className="text-sm text-gray-500 italic">No tasks added yet. Click "Add Task" to add one.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectForm;