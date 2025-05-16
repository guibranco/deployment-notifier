import React, { useState } from 'react';
import Header from './components/Header';
import NotificationForm from './components/NotificationForm';
import NotificationPreview from './components/NotificationPreview';
import { DeploymentNotification, NotificationType } from './types/deployment';
import { emptyNotification } from './utils/initialData';

function App() {
  const [notification, setNotification] = useState<DeploymentNotification>(emptyNotification);
  const [notificationType, setNotificationType] = useState<NotificationType>('pre-release');

  const handleNotificationChange = (updatedNotification: DeploymentNotification) => {
    setNotification(updatedNotification);
  };

  const handleTypeChange = (type: NotificationType) => {
    setNotificationType(type);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-8">
            <NotificationForm
              notification={notification}
              onChange={handleNotificationChange}
              notificationType={notificationType}
              onTypeChange={handleTypeChange}
            />
          </div>
          
          <div className="flex flex-col space-y-8">
            <NotificationPreview 
              notification={notification} 
              type={notificationType} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}