export interface DeploymentTask {
  id: string;
  ticketNumber?: string;
  description: string;
}

export interface DeploymentProject {
  id: string;
  name: string;
  version: string;
  versionLink?: string;
  tasks: DeploymentTask[];
  versionSystem?: 'github' | 'azure' | 'gitlab' | 'appveyor' | 'circleci';
  taskSystem?: 'jira' | 'trello' | 'github' | 'azure';
}

export interface Duration {
  hours: number;
  minutes: number;
}

export interface EmailFeature {
  id: string;
  description: string;
}

export interface EmailSystem {
  id: string;
  name: string;
}

export interface EmailContact {
  email: string;
  phone: string;
}

export interface DeploymentNotification {
  id: string;
  date: string;
  deploymentTime: string;
  actualDeploymentTime?: string;
  projects: DeploymentProject[];
  expectedDowntime: string | Duration;
  rollbackPlan: string;
  // Email specific fields
  emailFeatures?: EmailFeature[];
  emailSystems?: EmailSystem[];
  includeSupport?: boolean;
  supportContact?: EmailContact;
}