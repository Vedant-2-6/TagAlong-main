import React, { useState } from 'react';
import { Calendar, Truck, PackageCheck, Box, Upload, UserCheck, IndianRupee, Timer, FileText } from 'lucide-react';

const documentTypes = [
  { value: 'aadhar', label: 'Aadhar Card' },
  { value: 'license', label: 'Driving License' },
  { value: 'voter_id', label: 'Voter ID' }
];

const transportModes = [
  { value: 'car', label: 'Car' },
  { value: 'bike', label: 'Bike' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'flight', label: 'Flight' },
  { value: 'other', label: 'Other' }
];

const categories = [
  'Electronics',
  'Clothes',
  'Documents',
  'Food',
  'Furniture',
  'Fragile Items',
  'Other'
];

const ListTripPage: React.FC = () => {
  const [step, setStep] = useState(1);

  // Verification
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentImage, setDocumentImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);

  // Trip Details
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [duration, setDuration] = useState('');
  const [transport, setTransport] = useState('');
  const [capacityWeight, setCapacityWeight] = useState<number>(5);
  const [capacityVolume, setCapacityVolume] = useState<number>(1);
  const [acceptsFragile, setAcceptsFragile] = useState(false);
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>([]);
  const [identificationPhoto, setIdentificationPhoto] = useState<File | null>(null);
  const [price, setPrice] = useState<number>(0);

  // Handle category selection
  const toggleCategory = (cat: string) => {
    setAcceptedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Handle file inputs
  const handleFileChange = (setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  // Step navigation
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here (API call etc.)
    alert('Trip listed successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">List Your Trip</h1>
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
              <UserCheck size={18} />
            </div>
            <div className={`h-1 w-8 ${step > 1 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
              <Truck size={18} />
            </div>
            <div className={`h-1 w-8 ${step > 2 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step === 3 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
              <FileText size={18} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Verification */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center"><UserCheck size={20} className="mr-2" />Verify Your Identity</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select Document</option>
                  {documentTypes.map(doc => (
                    <option key={doc.value} value={doc.value}>{doc.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={e => setDocumentNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Upload size={16} className="mr-1" />Upload Document Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(setDocumentImage)}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Upload size={16} className="mr-1" />Upload Selfie with Document
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(setSelfieImage)}
                  className="w-full"
                  required
                />
              </div>
              <div className="flex justify-between">
                <div></div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
                  disabled={!documentType || !documentNumber || !documentImage || !selfieImage}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Trip Details */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center"><Truck size={20} className="mr-2" />Trip Details</h2>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="text"
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="City, State"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-1" />Date of Journey
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Timer size={16} className="mr-1" />Duration (hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Means of Transport</label>
                <select
                  value={transport}
                  onChange={e => setTransport(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select</option>
                  {transportModes.map(mode => (
                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <PackageCheck size={16} className="mr-1" />Capacity (Weight in kg)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={capacityWeight}
                    onChange={e => setCapacityWeight(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Box size={16} className="mr-1" />Capacity (Volume in m³)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={capacityVolume}
                    onChange={e => setCapacityVolume(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  id="fragile"
                  type="checkbox"
                  checked={acceptsFragile}
                  onChange={e => setAcceptsFragile(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="fragile" className="ml-2 block text-sm text-gray-700 flex items-center">
                  <PackageCheck size={16} className="mr-1 text-gray-500" />
                  Accept Fragile Items
                </label>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category of Goods</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-full border ${acceptedCategories.includes(cat) ? 'bg-teal-500 text-white border-teal-500' : 'bg-gray-100 text-gray-700 border-gray-300'} transition-colors`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
                  disabled={
                    !source || !destination || !departureDate || !duration || !transport ||
                    !capacityWeight || !capacityVolume || acceptedCategories.length === 0
                  }
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Identification & Cost */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center"><FileText size={20} className="mr-2" />Identification & Cost</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Upload size={16} className="mr-1" />Upload Latest Photo for Identification
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange(setIdentificationPhoto)}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <IndianRupee size={16} className="mr-1" />Cost of Service (in ₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors"
                  disabled={!identificationPhoto || price <= 0}
                >
                  List Trip
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ListTripPage;