@ -1,11 +1,12 @@
import React, { useState, useEffect } from 'react';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Filter, MapPin, Clock, Package } from 'lucide-react';
import { Filter, MapPin, Clock, Package, UserCheck } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SearchForm, { SearchParams } from '../components/SearchForm';
import { Listing } from '../types';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allTrips, setAllTrips] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
@ -18,10 +19,33 @@ const SearchPage: React.FC = () => {
    urgency: (searchParams.get('urgency') as 'normal' | 'express') || 'normal',
    productType: searchParams.get('productType') || 'standard' // Added missing required productType field
  });
  // Add Aadhaar verification state and handlers (copy from ListTripPage.tsx)
  const [showVerification, setShowVerification] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarPhone, setAadhaarPhone] = useState('');
  const [aadhaarName, setAadhaarName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
 
  const [step, setStep] = useState(1);
  const [parcelDescription, setParcelDescription] = useState("");
  const [parcelWeight, setParcelWeight] = useState(1);
  const [parcelCategory, setParcelCategory] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [ocrError, setOcrError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number|null, number|null]>([null, null]);
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);
  const [sortOption, setSortOption] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'rating'>('date_asc');

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [toastType, setToastType] = useState<'otp' | 'request' | null>(null);
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
@ -60,7 +84,7 @@ const SearchPage: React.FC = () => {
      // Match source and destination
      const sourceMatch = listing.source.toLowerCase().includes(params.source.toLowerCase());
      const destMatch = listing.destination.toLowerCase().includes(params.destination.toLowerCase());
      

      // Match date if provided
      let dateMatch = true;
      if (params.date) {
@ -68,26 +92,26 @@ const SearchPage: React.FC = () => {
        const listingDate = new Date(listing.departureDate).setHours(0, 0, 0, 0);
        dateMatch = searchDate === listingDate;
      }
      

      // Match fragile requirement if needed
      let fragileMatch = true;
      if (params.isFragile) {
        fragileMatch = listing.acceptsFragile;
      }
      

      // Match weight capacity
      const weightMatch = listing.capacity.weight >= params.weight;
      

      return sourceMatch && destMatch && dateMatch && fragileMatch && weightMatch;
    });
    

    // Apply price filter only if min or max is set
    results = results.filter(listing => {
      const minOk = priceRange[0] === null || listing.price >= priceRange[0];
      const maxOk = priceRange[1] === null || listing.price <= priceRange[1];
      return minOk && maxOk;
    });
    

    // Apply sorting
    switch (sortOption) {
      case 'price_asc':
@ -104,7 +128,7 @@ const SearchPage: React.FC = () => {
        // For now, we'll keep the default
        break;
    }
    

    setFilteredListings(results);
  };

@ -143,7 +167,130 @@ const SearchPage: React.FC = () => {
    });
    setSearchParams({});
    setFilteredListings(allTrips); // <-- Use allTrips instead of mockListings




    // Replace handleVerifyOtp to check against generatedOtp
    const handleVerifyOtp = async () => {
      setOtpError('');
      setOtpLoading(true);
      if (otp === generatedOtp) {
        setOtpVerified(true);
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
      setOtpLoading(false);
    };

  };
  const handleCloseToast = () => {
    setShowToast(false);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };
  async function handleAadhaarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOcrError("");
    setAadhaarNumber("");
    setAadhaarPhone("");
    setAadhaarName("");
    setOtpSent(false);
    setOtpVerified(false);
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0]);
      setOcrLoading(true);
      const formData = new FormData();
      formData.append("aadhaar", e.target.files[0]);
      try {
        const res = await fetch("/api/trip/ocr/aadhaar", { method: "POST", body: formData });
        const data = await res.json();
        if (data.aadhaarNumber) {
          setAadhaarNumber(data.aadhaarNumber);
          if (data.phone) setAadhaarPhone(data.phone);
          if (data.name) setAadhaarName(data.name);
        } else {
          setOcrError("Could not extract Aadhaar details. Please upload a clear image or PDF.");
        }
      } catch {
        setOcrError("OCR failed. Please try again.");
      }
      setOcrLoading(false);
    }
  }

  // function handleSendOtp(): void {
  //   setOtpError("");
  //   setOtpLoading(true);
  //   // Simulate OTP generation and "sending"
  //   const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  //   setGeneratedOtp(newOtp);
  //   setOtpSent(true);
  //   setOtpLoading(false);
  //   console.log("Generated OTP:", newOtp);
  //   setShowToast(true);
  //   if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  //   toastTimeoutRef.current = setTimeout(() => setShowToast(false), 10000);
  // }

  function handleVerifyOtp(): void {
    setOtpError('');
    setOtpLoading(true);
    if (otp === generatedOtp) {
      setOtpVerified(true);
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
    setOtpLoading(false);
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setToastType('request');
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);
    event.preventDefault();
    async function sendRequest() {
  // Implement the request logic here
  // Return a promise
  return fetch('/api/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ /* request data */ })
  }).then(response => response.json());
}
  }
  // function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
  //   event.preventDefault();

  //   setShowToast(true); // Show the notification
  //   if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  //   toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);
  //   {
  //     showToast && (
  //       <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
  //         Request sent
  //       </div>
  //     )
  //   }
  //   {showToast && generatedOtp && (
  //     <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
  //       OTP sent: <span className="font-bold">{generatedOtp}</span>
  //     </div>
  //   )}
  // }
  function handleSendOtp(): void {
    setOtpError("");
    setOtpLoading(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setOtpLoading(false);
    setToastType('otp');
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 10000);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
@ -154,6 +301,54 @@ const SearchPage: React.FC = () => {
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Toast Notification */}
    {/* {showToast && (
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          background: '#14b8a6',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          minWidth: 180,
          fontWeight: 500,
        }}
      >
        <span style={{ flex: 1 }}>Your OTP is: {generatedOtp}</span>
        <button
          onClick={handleCloseToast}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: 18,
            marginLeft: 12,
            cursor: 'pointer',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    )} */}
    {showToast && toastType === 'otp' && generatedOtp && (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
    OTP sent: <span className="font-bold">{generatedOtp}</span>
  </div>
)}
{showToast && toastType === 'request' && (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
    Request sent
  </div>
)}
    {/* ... existing code ... */}
          {/* Sidebar Filters for Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
@ -232,7 +427,7 @@ const SearchPage: React.FC = () => {
              <Filter size={18} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-lg shadow-md p-6">
@ -316,7 +511,7 @@ const SearchPage: React.FC = () => {
                      <span className="font-medium">{searchCriteria.destination}</span>
                    </span>
                  </div>
                  

                  {searchCriteria.date && (
                    <div className="flex items-center">
                      <Clock size={18} className="text-teal-500 mr-1" />
@ -329,20 +524,20 @@ const SearchPage: React.FC = () => {
                      </span>
                    </div>
                  )}
                  

                  {searchCriteria.weight > 0 && (
                    <div className="flex items-center">
                      <Package size={18} className="text-teal-500 mr-1" />
                      <span className="text-gray-700">{searchCriteria.weight}kg</span>
                    </div>
                  )}
                  

                  {searchCriteria.isFragile && (
                    <div className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                      Fragile
                    </div>
                  )}
                  

                  {searchCriteria.urgency === 'express' && (
                    <div className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                      Express
@ -357,9 +552,188 @@ const SearchPage: React.FC = () => {
                <p className="text-gray-700">
                  Showing {filteredListings.length} {filteredListings.length === 1 ? 'trip' : 'trips'}
                </p>

                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSendParcel={() => {
                      setShowVerification(true);
                      // Optionally: setSelectedListing(listing);
                    }}
                  />
                ))}

                // Add the Aadhaar verification modal JSX (copy from ListTripPage.tsx)
                {showVerification && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <form onSubmit={handleSubmit}
                      className="relative bg-white rounded-lg shadow-lg pt-10 pb-8 px-8 w-full max-w-2xl mx-auto"
                    >
                      <button
                        type="button"
                        onClick={() => setShowVerification(false)}
                        className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                        aria-label="Close"
                      >
                        ×
                      </button>
                      {/* Step 1: Aadhaar OTP Verification */}
                      {step === 1 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4 flex items-center">
                            Aadhaar Verification (with OTP)
                          </h2>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload Aadhaar Image or PDF
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={handleAadhaarFileChange}
                              className="w-full"
                              required
                              disabled={ocrLoading}
                            />
                            {ocrLoading && <div className="text-teal-600 mt-2">Extracting details...</div>}
                            {ocrError && <div className="text-red-600 mt-2">{ocrError}</div>}
                          </div>
                          {aadhaarNumber && aadhaarPhone && /^\d{12}$/.test(aadhaarNumber) && /^\d{10}$/.test(aadhaarPhone) && (
                            <div className="flex flex-col items-center mb-4">
                              <svg className="w-16 h-16 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13l3 3 7-7" />
                              </svg>
                              <div className="text-green-700 font-bold text-lg mt-2">User Verified!</div>
                              <div className="text-gray-600 mt-1 mb-2">Please enter your phone number or email for OTP verification.</div>
                              <input
                                type="text"
                                value={aadhaarPhone}
                                onChange={e => setAadhaarPhone(e.target.value)}
                                className="border px-4 py-2 rounded mt-2 w-64 text-center"
                                placeholder="Enter phone number or email"
                                required
                              />
                              {!otpSent && (
                                <button
                                  type="button"
                                  className="bg-teal-500 text-white px-6 py-2 rounded-md mt-3"
                                  onClick={handleSendOtp}
                                  disabled={otpLoading || (!/^\d{10}$/.test(aadhaarPhone) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aadhaarPhone))}
                                >
                                  {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                              )}
                              {otpSent && !otpVerified && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter OTP sent to {aadhaarPhone}
                                  </label>
                                  <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    maxLength={6}
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="bg-teal-600 text-white px-6 py-2 rounded-md mt-2"
                                    onClick={handleVerifyOtp}
                                    disabled={otpLoading || otp.length !== 6}
                                  >
                                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                                  </button>
                                  {otpError && <div className="text-red-600 mt-2">{otpError}</div>}
                                </div>
                              )}
                              {otpVerified && (
                                <div className="text-green-600 mt-4 font-semibold">
                                  OTP Verified! Aadhaar authentication complete.
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleNext}
                              className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors font-semibold"
                              disabled={!otpVerified}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Step 2: Parcel Details */}
                      {step === 2 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4 flex items-center">Parcel Details</h2>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Description</label>
                            <input
                              type="text"
                              value={parcelDescription}
                              onChange={e => setParcelDescription(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder="Describe your parcel"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                            <input
                              type="number"
                              value={parcelWeight}
                              onChange={e => setParcelWeight(Number(e.target.value))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              min={0.1}
                              step={0.1}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                              value={parcelCategory}
                              onChange={e => setParcelCategory(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              required
                            >
                              <option value="">Select category</option>
                              <option value="Electronics">Electronics</option>
                              <option value="Clothes">Clothes</option>
                              <option value="Documents">Documents</option>
                              <option value="Food">Food</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Fragile Items">Fragile Items</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={handleBack}
                              className="bg-gray-300 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-400 transition-colors font-semibold"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors font-semibold"
                            >
                              Submit Parcel Request
                            </button>
                          </div>
                        </div>
                      )}

                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
@ -385,4 +759,4 @@ const SearchPage: React.FC = () => {
  );
};

export default SearchPage;
export default SearchPage;