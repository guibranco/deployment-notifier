import React from 'react';
import { DeploymentNotification, NotificationType } from '../types/deployment';
import { generateNotification } from '../utils/notificationGenerator';
import { Copy, ChevronDown } from 'lucide-react';
import { marked } from 'marked';

interface NotificationPreviewProps {
  notification: DeploymentNotification;
  type: NotificationType;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({ notification, type }) => {
  const notificationText = generateNotification(notification, type);
  const renderedMarkdown = marked(notificationText);
  const [isMarkdownVisible, setIsMarkdownVisible] = React.useState(false);
  const [isHtmlVisible, setIsHtmlVisible] = React.useState(false);
  
  const copyMarkdown = () => {
    navigator.clipboard.writeText(notificationText);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(renderedMarkdown);
  };

  const copyFormatted = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([renderedMarkdown], { type: 'text/html' }),
          'text/plain': new Blob([document.querySelector('.prose')?.textContent || ''], { type: 'text/plain' })
        })
      ]);
    } catch (err) {
      // Fallback for browsers that don't support rich text clipboard
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderedMarkdown;
      navigator.clipboard.writeText(tempDiv.textContent || tempDiv.innerText || '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Preview</h2>
          <button 
            onClick={copyFormatted}
            className="text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1 text-sm"
          >
            <Copy size={16} />
            <span>Copy Formatted</span>
          </button>
        </div>
        <div className="p-4">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          onClick={() => setIsMarkdownVisible(!isMarkdownVisible)}
          className="w-full bg-gray-50 px-4 py-3 border-b flex justify-between items-center hover:bg-gray-100 transition-colors"
        >
          <h2 className="font-semibold text-gray-700">Raw Markdown</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                copyMarkdown();
              }}
              className="text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1 text-sm"
            >
              <Copy size={16} />
              <span>Copy Markdown</span>
            </button>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${isMarkdownVisible ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        {isMarkdownVisible && (
          <div className="p-4">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border font-mono text-sm text-gray-800 overflow-auto max-h-[300px]">
              {notificationText}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button 
          onClick={() => setIsHtmlVisible(!isHtmlVisible)}
          className="w-full bg-gray-50 px-4 py-3 border-b flex justify-between items-center hover:bg-gray-100 transition-colors"
        >
          <h2 className="font-semibold text-gray-700">Raw HTML</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                copyHtml();
              }}
              className="text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1 text-sm"
            >
              <Copy size={16} />
              <span>Copy HTML</span>
            </button>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${isHtmlVisible ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        {isHtmlVisible && (
          <div className="p-4">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border font-mono text-sm text-gray-800 overflow-auto max-h-[300px]">
              {renderedMarkdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPreview;