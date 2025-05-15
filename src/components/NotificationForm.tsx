import React, { useState } from 'react';
import { DeploymentNotification, DeploymentProject, NotificationType, Duration, EmailFeature, EmailSystem } from '../types/deployment';
import ProjectForm from './ProjectForm';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Clock, Trash2 } from 'lucide-react';

interface NotificationFormProps {
  notification: DeploymentNotification;
  onChange: (notification: DeploymentNotification) => void;
  notificationType: NotificationType;
  onTypeChange: (type: NotificationType) => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  notification,
  onChange,
  notificationType,
  onTypeChange,
}) => {
  const [hasDowntime, setHasDowntime] = useState(typeof notification.expectedDowntime !== 'string');
  const [customRollback, setCustomRollback] = useState(notification.rollbackPlan !== 'Rollback to the previous (current) version.');
  const [newFeature, setNewFeature] = useState('');
  const [newSystem, setNewSystem] = useState('');
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateError(notificationType === 'email' && !value);
    onChange({ ...notification, date: value });
  };

  const handleDeploymentTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeError(notificationType === 'email' && !value);
    onChange({ ...notification, deploymentTime: value });
  };

  const handleTypeChange = (type: NotificationType) => {
    if (type === 'email') {
      setDateError(!notification.date);
      setTimeError(!notification.deploymentTime || notification.deploymentTime === 'as soon as possible' || notification.deploymentTime === 'close of business');
      if (!notification.deploymentTime || notification.deploymentTime === 'as soon as possible' || notification.deploymentTime === 'close of business') {
        onChange({ ...notification, deploymentTime: '' });
      }
    }
    onTypeChange(type);
  };

  const handleActualDeploymentTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...notification, actualDeploymentTime: e.target.value });
  };

  const handleDowntimeToggle = (hasDowntime: boolean) => {
    setHasDowntime(hasDowntime);
    onChange({
      ...notification,
      expectedDowntime: hasDowntime ? { hours: 0, minutes: 0 } : 'No downtime expected',
    });
  };

  const handleDowntimeChange = (field: keyof Duration, value: number) => {
    if (typeof notification.expectedDowntime === 'object') {
      onChange({
        ...notification,
        expectedDowntime: {
          ...notification.expectedDowntime,
          [field]: value,
        },
      });
    }
  };

  const handleRollbackToggle = (isCustom: boolean) => {
    setCustomRollback(isCustom);
    onChange({
      ...notification,
      rollbackPlan: isCustom ? '' : 'Rollback to the previous (current) version.',
    });
  };

  const handleRollbackPlanChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...notification, rollbackPlan: e.target.value });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    const feature: EmailFeature = {
      id: uuidv4(),
      description: newFeature.trim()
    };
    
    onChange({
      ...notification,
      emailFeatures: [...(notification.emailFeatures || []), feature]
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (id: string) => {
    onChange({
      ...notification,
      emailFeatures: (notification.emailFeatures || []).filter(f => f.id !== id)
    });
  };

  const handleAddSystem = () => {
    if (!newSystem.trim()) return;
    
    const system: EmailSystem = {
      id: uuidv4(),
      name: newSystem.trim()
    };
    
    onChange({
      ...notification,
      emailSystems: [...(notification.emailSystems || []), system]
    });
    setNewSystem('');
  };

  const handleRemoveSystem = (id: string) => {
    onChange({
      ...notification,
      emailSystems: (notification.emailSystems || []).filter(s => s.id !== id)
    });
  };

  const handleSupportContactChange = (field: 'email' | 'phone', value: string) => {
    onChange({
      ...notification,
      supportContact: {
        ...(notification.supportContact || { email: '', phone: '' }),
        [field]: value
      }
    });
  };

  const handleCheckboxChange = (field: 'includeSupport', checked: boolean) => {
    onChange({
      ...notification,
      [field]: checked
    });
  };

  const handleProjectChange = (updatedProject: DeploymentProject) => {
    const updatedProjects = notification.projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    onChange({ ...notification, projects: updatedProjects });
  };

  const handleAddProject = () => {
    const newProject: DeploymentProject = {
      id: uuidv4(),
      name: '',
      version: '',
      tasks: [],
    };
    onChange({
      ...notification,
      projects: [...notification.projects, newProject],
    });
  };

  const handleRemoveProject = (projectId: string) => {
    const updatedProjects = notification.projects.filter(
      (project) => project.id !== projectId
    );
    onChange({ ...notification, projects: updatedProjects });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-5 py-4 border-b">
        <h2 className="font-semibold text-gray-800 text-lg">Deployment Details</h2>
      </div>
      <div className="p-5">
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                notificationType === 'pre-release'
                  ? 'bg-[#79378b] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTypeChange('pre-release')}
            >
              Pre-Release
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                notificationType === 'post-release'
                  ? 'bg-[#93cd3f] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTypeChange('post-release')}
            >
              Post-Release
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                notificationType === 'email'
                  ? 'bg-[#79378b] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTypeChange('email')}
            >
              Email
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="notification-date" className="block text-sm font-medium text-gray-700 mb-1">
                {notificationType === 'email' ? 'Release Date *' : 'Notification Date'}
              </label>
              <input
                id="notification-date"
                type="date"
                value={notification.date}
                onChange={handleDateChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-[#79378b] transition-colors ${
                  dateError ? 'border-red-500' : 'border-gray-300'
                }`}
                required={notificationType === 'email'}
              />
              {dateError && (
                <p className="mt-1 text-sm text-red-500">Release date is required</p>
              )}
            </div>
            <div>
              <label htmlFor="deployment-time" className="block text-sm font-medium text-gray-700 mb-1">
                {notificationType === 'post-release' ? 'Planned Deployment Time' : 
                  notificationType === 'email' ? 'Release Time *' : 'Deployment Time'}
              </label>
              {notificationType === 'email' ? (
                <div>
                  <input
                    id="deployment-time"
                    type="time"
                    value={notification.deploymentTime}
                    onChange={handleDeploymentTimeChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-[#79378b] transition-colors ${
                      timeError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {timeError && (
                    <p className="mt-1 text-sm text-red-500">Release time is required</p>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onChange({ ...notification, deploymentTime: 'as soon as possible' })}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      notification.deploymentTime === 'as soon as possible'
                        ? 'bg-[#79378b] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ASAP
                  </button>
                  <button
                    onClick={() => onChange({ ...notification, deploymentTime: 'close of business' })}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      notification.deploymentTime === 'close of business'
                        ? 'bg-[#79378b] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    COB
                  </button>
                </div>
              )}
            </div>
          </div>

          {notificationType === 'post-release' && (
            <div className="mb-4">
              <label htmlFor="actual-deployment-time" className="block text-sm font-medium text-gray-700 mb-1">
                Actual Deployment Time
              </label>
              <div className="relative">
                <input
                  id="actual-deployment-time"
                  type="time"
                  value={notification.actualDeploymentTime || ''}
                  onChange={handleActualDeploymentTimeChange}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b] transition-colors"
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Downtime
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDowntimeToggle(false)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !hasDowntime
                        ? 'bg-[#79378b] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    No Downtime
                  </button>
                  <button
                    onClick={() => handleDowntimeToggle(true)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      hasDowntime
                        ? 'bg-[#79378b] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Specify Duration
                  </button>
                </div>
                {hasDowntime && typeof notification.expectedDowntime === 'object' && (
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label htmlFor="hours" className="block text-sm text-gray-600 mb-1">
                        Hours
                      </label>
                      <input
                        type="number"
                        id="hours"
                        min="0"
                        max="24"
                        value={notification.expectedDowntime.hours}
                        onChange={(e) => handleDowntimeChange('hours', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b]"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="minutes" className="block text-sm text-gray-600 mb-1">
                        Minutes
                      </label>
                      <input
                        type="number"
                        id="minutes"
                        min="0"
                        max="59"
                        value={notification.expectedDowntime.minutes}
                        onChange={(e) => handleDowntimeChange('minutes', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {notificationType !== 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rollback Plan
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRollbackToggle(false)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        !customRollback
                          ? 'bg-[#79378b] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Default Plan
                    </button>
                    <button
                      onClick={() => handleRollbackToggle(true)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        customRollback
                          ? 'bg-[#79378b] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Custom Plan
                    </button>
                  </div>
                  {customRollback && (
                    <textarea
                      value={notification.rollbackPlan}
                      onChange={handleRollbackPlanChange}
                      placeholder="Describe the rollback plan..."
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b] transition-colors h-24 resize-none"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {notificationType === 'email' ? (
          <div className="space-y-6">
            {/* Business Features */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Business Features</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a business feature..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b]"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-[#79378b] text-white rounded-md hover:bg-[#93cd3f] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {notification.emailFeatures?.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span>{feature.description}</span>
                      <button
                        onClick={() => handleRemoveFeature(feature.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Systems */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Systems</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSystem}
                    onChange={(e) => setNewSystem(e.target.value)}
                    placeholder="Add a system..."
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b]"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSystem()}
                  />
                  <button
                    onClick={handleAddSystem}
                    className="px-4 py-2 bg-[#79378b] text-white rounded-md hover:bg-[#93cd3f] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {notification.emailSystems?.map((system) => (
                    <div key={system.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span>{system.name}</span>
                      <button
                        onClick={() => handleRemoveSystem(system.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Options */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Email Options</h3>

              {/* Support Contact */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="include-support"
                    checked={notification.includeSupport}
                    onChange={(e) => handleCheckboxChange('includeSupport', e.target.checked)}
                    className="h-4 w-4 text-[#79378b] rounded border-gray-300 focus:ring-[#79378b]"
                  />
                  <label htmlFor="include-support" className="ml-2 text-sm text-gray-700">
                    Include Support Contact Section
                  </label>
                </div>

                {notification.includeSupport && (
                  <div className="pl-6 space-y-3">
                    <div>
                      <label htmlFor="support-email" className="block text-sm text-gray-600 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        id="support-email"
                        value={notification.supportContact?.email || ''}
                        onChange={(e) => handleSupportContactChange('email', e.target.value)}
                        placeholder="support@company.com"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b]"
                      />
                    </div>
                    <div>
                      <label htmlFor="support-phone" className="block text-sm text-gray-600 mb-1">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        id="support-phone"
                        value={notification.supportContact?.phone || ''}
                        onChange={(e) => handleSupportContactChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#79378b] focus:border-[#79378b]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Projects & Tasks</h3>
              <button
                onClick={handleAddProject}
                className="flex items-center px-3 py-2 bg-[#79378b] text-white rounded-md hover:bg-[#93cd3f] transition-colors text-sm"
              >
                <Plus size={16} className="mr-1" /> Add Project
              </button>
            </div>

            {notification.projects.map((project) => (
              <ProjectForm
                key={project.id}
                project={project}
                onChange={handleProjectChange}
                onRemove={() => handleRemoveProject(project.id)}
                showVersion={notificationType !== 'email'}
              />
            ))}

            {notification.projects.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No projects added yet</p>
                <button
                  onClick={handleAddProject}
                  className="px-4 py-2 bg-[#79378b] text-white rounded-md hover:bg-[#93cd3f] transition-colors text-sm"
                >
                  Add Your First Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationForm;