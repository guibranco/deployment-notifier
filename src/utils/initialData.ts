import { DeploymentNotification } from '../types/deployment';
import { v4 as uuidv4 } from 'uuid';

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Get current time in HH:mm format
const currentTime = new Date().toLocaleTimeString('en-US', {
  hour12: false,
  hour: '2-digit',
  minute: '2-digit'
});

export const initialNotification: DeploymentNotification = {
  id: uuidv4(),
  date: currentDate,
  deploymentTime: currentTime,
  projects: [
    {
      id: uuidv4(),
      name: 'Policy Admin',
      version: '3.0.738',
      versionLink: 'https://github.com/org/policy-admin/releases/tag/3.0.738',
      tasks: [
        {
          id: uuidv4(),
          ticketNumber: 'CORE-1234',
          description: 'Add archived risks handling to Lapse Risk handler',
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Rerates',
      version: '0.1.212',
      tasks: [
        {
          id: uuidv4(),
          ticketNumber: 'CORE-5678',
          description: 'Do not throw collection not attempted exception on lapse risk handling if payments were simply unsuccessful',
        },
      ],
    },
  ],
  expectedDowntime: 'No downtime expected',
  rollbackPlan: 'Rollback to the previous (current) version.',
  emailFeatures: [],
  emailSystems: [],
  includeSupport: true,
  supportContact: {
    email: '',
    phone: ''
  }
};