import { DeploymentNotification, NotificationType, Duration, DeploymentProject, DeploymentTask } from '../types/deployment';

function formatDowntime(downtime: string | Duration): string {
  if (typeof downtime === 'string') {
    return downtime;
  }
  
  const parts = [];
  if (downtime.hours > 0) {
    parts.push(`${downtime.hours} hour${downtime.hours !== 1 ? 's' : ''}`);
  }
  if (downtime.minutes > 0) {
    parts.push(`${downtime.minutes} minute${downtime.minutes !== 1 ? 's' : ''}`);
  }
  return parts.join(' and ');
}

function formatDateTime(date: string, time: string): string {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return `${formattedDate} at ${time}`;
}

function getTaskLink(task: DeploymentTask, project: DeploymentProject): string {
  if (!task.ticketNumber) return '';

  switch (project.taskSystem) {
    case 'jira':
      return `https://jira.company.com/browse/${task.ticketNumber}`;
    case 'github':
      return `https://github.com/${project.name}/issues/${task.ticketNumber.replace('#', '')}`;
    case 'azure':
      return `https://dev.azure.com/company/${project.name}/_workitems/edit/${task.ticketNumber.replace('#', '')}`;
    case 'trello':
      return task.ticketNumber; // Trello uses full URLs
    default:
      return '';
  }
}

function getVersionLink(project: DeploymentProject): string {
  if (!project.version || !project.versionLink) return project.version;

  const version = project.version;
  const baseUrl = project.versionLink.split('/releases/')[0];

  switch (project.versionSystem) {
    case 'github':
      return `${baseUrl}/releases/tag/${version}`;
    case 'gitlab':
      return `${baseUrl}/-/releases/${version}`;
    case 'azure':
      return `${baseUrl}/_git/tags?labelName=${version}`;
    default:
      return project.versionLink;
  }
}

export function generateNotification(
  notification: DeploymentNotification,
  type: NotificationType
): string {
  const date = new Date(notification.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  switch (type) {
    case 'email':
      return generateEmailNotification(notification, date);
    case 'pre-release':
      return generatePreReleaseNotification(notification, date);
    case 'post-release':
      return generatePostReleaseNotification(notification, date);
  }
}

function generateEmailNotification(
  notification: DeploymentNotification,
  date: string
): string {
  let email = `Subject: Production Release Completion - ${date}\n\n`;
  email += 'Dear Team,\n\n';
  email += 'This email is to confirm that the following production release has been successfully completed.\n\n';

  // Business Features Section
  email += '## Business Features\n\n';
  if (notification.emailFeatures?.length) {
    notification.emailFeatures.forEach(feature => {
      email += `* ${feature.description}\n`;
    });
  } else {
    email += 'No features specified\n';
  }
  email += '\n';

  // Systems Section
  email += '## Systems Affected\n\n';
  if (notification.emailSystems?.length) {
    notification.emailSystems.forEach(system => {
      email += `* ${system.name}\n`;
    });
  } else {
    email += 'No systems specified\n';
  }
  email += '\n';

  // Release Timing Section
  email += '## Deployment Details\n\n';
  email += `Date: ${date}\n`;
  email += `Time: ${notification.deploymentTime}\n`;
  if (notification.actualDeploymentTime) {
    email += `Actual Completion Time: ${notification.actualDeploymentTime}\n`;
  }
  email += '\n';

  // System Impact Section
  email += '## System Impact\n\n';
  const impact = formatDowntime(notification.expectedDowntime);
  email += `Actual downtime: ${impact}\n`;
  if (typeof notification.expectedDowntime === 'object' && 
      (notification.expectedDowntime.hours > 0 || notification.expectedDowntime.minutes > 0)) {
    email += 'All systems have been restored to full operational status\n';
    email += 'Regular business operations can now resume\n';
  }
  email += '\n';

  // Contact Information
  if (notification.includeSupport && notification.supportContact) {
    email += '## Support Contact\n\n';
    email += 'If you experience any issues, please contact:\n\n';
    email += 'IT Support Desk\n';
    if (notification.supportContact.email) {
      email += `Email: ${notification.supportContact.email}\n`;
    }
    if (notification.supportContact.phone) {
      email += `Emergency Contact: ${notification.supportContact.phone}\n`;
    }
    email += '\n';
  }

  email += 'Thank you for your cooperation during this deployment.\n\n';
  email += 'Best regards,\n';
  email += 'IT Operations Team';

  return email;
}

function generatePreReleaseNotification(
  notification: DeploymentNotification,
  date: string
): string {
  let markdown = `# Pre-Release Notification – ${date}\n\n`;
  markdown += `🚀 Deployment Scheduled for ${notification.deploymentTime}\n\n`;
  
  markdown += `Everyone, we will be deploying the following release ${notification.deploymentTime}. Please review the details below.\n\n`;
  markdown += `## 🔹 Deployment Overview\n\n`;
  
  markdown += `| Repository / Project | Release Version | Tasks / Features |\n`;
  markdown += `|-------------------|----------------|----------------|\n`;
  
  notification.projects.forEach((project) => {
    const version = project.versionLink 
      ? `[${project.version}](${getVersionLink(project)})`
      : project.version;
    
    const tasks = project.tasks.map(task => {
      const ticketLink = task.ticketNumber && getTaskLink(task, project)
        ? `[${task.ticketNumber}](${getTaskLink(task, project)})` 
        : task.ticketNumber || '';
      return `${ticketLink}${ticketLink ? ' - ' : ''}${task.description}`;
    }).join('<br>');
    
    markdown += `| ${project.name} | ${version} | ${tasks} |\n`;
  });

  markdown += `\n## 🔎 Additional Information\n\n`;
  markdown += `**Expected Downtime:** ${formatDowntime(notification.expectedDowntime)}\n\n`;
  markdown += `**Rollback Plan:** ${notification.rollbackPlan}\n`;

  return markdown;
}

function generatePostReleaseNotification(
  notification: DeploymentNotification,
  date: string
): string {
  let markdown = `# Release Completion Notification – ${date}\n\n`;
  markdown += `✅ Deployment Completed\n\n`;
  markdown += `We're pleased to inform you that the following release has been successfully deployed.\n\n`;
  markdown += `## 📋 Deployment Summary\n\n`;
  
  markdown += `| Repository / Project | Release Version | Implemented Features |\n`;
  markdown += `|-------------------|----------------|--------------------|\n`;
  
  notification.projects.forEach((project) => {
    const version = project.versionLink 
      ? `[${project.version}](${getVersionLink(project)})`
      : project.version;
    
    const tasks = project.tasks.map(task => {
      const ticketLink = task.ticketNumber && getTaskLink(task, project)
        ? `[${task.ticketNumber}](${getTaskLink(task, project)})` 
        : task.ticketNumber || '';
      return `${ticketLink}${ticketLink ? ' - ' : ''}${task.description}`;
    }).join('<br>');
    
    markdown += `| ${project.name} | ${version} | ${tasks} |\n`;
  });

  markdown += `\n## ℹ️ Additional Information\n\n`;
  markdown += `**Planned Deployment Time:** ${notification.deploymentTime}\n\n`;
  if (notification.actualDeploymentTime) {
    markdown += `**Actual Deployment Time:** ${notification.actualDeploymentTime}\n\n`;
  }
  markdown += `**Downtime:** ${formatDowntime(notification.expectedDowntime)}\n\n`;
  markdown += `**Monitoring:** The systems are being actively monitored for any issues. Please report any unexpected behavior.\n\n`;
  markdown += `Thank you for your attention.\n`;

  return markdown;
}