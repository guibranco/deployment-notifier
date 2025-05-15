import React from 'react';
import { GitBranch } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#79378b] to-[#93cd3f] py-8 px-6 rounded-lg mb-8 shadow-md">
      <div className="flex items-center space-x-3 mb-3">
        <GitBranch size={28} className="text-white" />
        <h1 className="text-2xl font-bold text-white">Deployment Notifier</h1>
      </div>
      <p className="text-[#f3e7f5] max-w-3xl">
        Create professional pre-release and post-release deployment notifications for your team.
        Fill in the deployment details and generate formatted messages ready to share.
      </p>
    </div>
  );
};

export default Header;