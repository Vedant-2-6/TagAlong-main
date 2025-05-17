import React from 'react';
import { Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { User } from '../../types';

interface VerificationStatusProps {
  user: User;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ user }) => {
  const getStatusColor = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return <CheckCircle className={`h-5 w-5 ${getStatusColor()}`} />;
      case 'pending':
        return <Clock className={`h-5 w-5 ${getStatusColor()}`} />;
      default:
        return <AlertCircle className={`h-5 w-5 ${getStatusColor()}`} />;
    }
  };

  const getStatusText = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return 'Verified Account';
      case 'pending':
        return 'Verification Pending';
      default:
        return 'Unverified Account';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Shield className="h-8 w-8 text-teal-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            Verification Status
          </h3>
          <div className="mt-1 flex items-center">
            {getStatusIcon()}
            <span className={`ml-2 text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {user.verificationDocuments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Verified Documents
          </h4>
          <ul className="space-y-2">
            {user.verificationDocuments.map((doc) => (
              <li
                key={doc.type}
                className="flex items-center text-sm text-gray-600"
              >
                <CheckCircle
                  className={`h-4 w-4 mr-2 ${
                    doc.verified ? 'text-green-500' : 'text-gray-400'
                  }`}
                />
                {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {user.verificationStatus === 'unverified' && (
        <div className="mt-6">
          <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700">
            Start Verification
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;