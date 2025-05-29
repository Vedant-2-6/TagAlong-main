import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import { useAuth } from '../context/AuthContext';

interface Parcel {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
  description: string;
  weight: number;
  category: string;
  trip: any;
  carrier: any;
  sender: any;
  // Add other fields as needed
}

const MyParcelPage: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const { currentUser } = useAuth(); // Make sure this is available

  // Add this function to handle status updates
  const handleUpdateStatus = async (parcelId: string, status: 'accepted' | 'rejected') => {
    const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
    const res = await fetch(`/api/parcel/request/${parcelId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setParcels(prev => prev.map(p => p._id === parcelId ? { ...p, status } : p));
    }
  };

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const res = await fetch('/api/parcel/myparcels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setParcels(data); // Backend returns an array, not { parcels: [...] }
      }
      setLoading(false);
    };
    fetchParcels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Parcels</h1>
        {loading ? (
          <div>Loading...</div>
        ) : parcels.length === 0 ? (
          <div>No parcels listed yet.</div>
        ) : (
          <div className="space-y-6">
            {parcels.map(parcel => (
              <div key={parcel._id} className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-6 py-6 mb-4 border border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="text-gray-700 mb-2 font-semibold text-lg">
                    {parcel.description}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      parcel.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      parcel.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                    </span>
                  </div>
                  {/* Accept/Decline for carrier only if pending */}
                  {parcel.status === 'pending' && currentUser && parcel.carrier && parcel.carrier._id === currentUser._id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                        onClick={() => handleUpdateStatus(parcel._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                        onClick={() => handleUpdateStatus(parcel._id, 'rejected')}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  {/* Chat button for accepted or rejected requests */}
                  {(parcel.status === 'accepted') && (
                    <div className="flex gap-2 mt-2">
                    <button
                      className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded transition-colors mt-2 shadow"
                      onClick={() => setSelectedParcel(parcel)}
                    >
                      Chat
                    </button> 
                    
                    <button
                    className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded transition-colors mt-2 shadow"
                    onClick={() => setSelectedParcel(parcel)}
                  >
                    Make Payment
                  </button>
                  </div>
                    
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcelPage;