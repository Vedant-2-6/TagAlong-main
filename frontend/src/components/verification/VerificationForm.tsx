import React, { useState, useRef } from 'react';
import { Shield, Upload, Camera, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VerificationFormProps {
  onVerificationComplete: () => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onVerificationComplete }) => {
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState<'aadhar' | 'license' | 'voter_id'>('aadhar');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // In a real app, you would implement proper camera handling and image capture
      // For demo purposes, we'll just simulate a capture
      setSelfieImage('https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg');
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would make an API call to verify documents
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      if (step < 3) {
        setStep(step + 1);
      } else {
        onVerificationComplete();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-center mb-8">
        <div className="rounded-full bg-teal-100 p-3">
          <Shield className="h-8 w-8 text-teal-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Account Verification
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step >= stepNumber
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {step > stepNumber ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNumber ? 'bg-teal-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="aadhar">Aadhar Card</option>
                <option value="license">Driver's License</option>
                <option value="voter_id">Voter ID</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Number
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document Image
            </label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500">
                    <span>Upload a file</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleDocumentUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {documentImage && (
              <div className="mt-4">
                <img
                  src={documentImage}
                  alt="Document preview"
                  className="max-w-xs mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take a Selfie
            </label>
            <div className="mt-1 flex flex-col items-center">
              <button
                type="button"
                onClick={handleSelfieCapture}
                className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
              >
                <Camera className="h-5 w-5 mr-2" />
                Capture Photo
              </button>
              {selfieImage && (
                <div className="mt-4">
                  <img
                    src={selfieImage}
                    alt="Selfie preview"
                    className="w-32 h-32 rounded-full object-cover shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : step === 3 ? 'Complete Verification' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerificationForm;