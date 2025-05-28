import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';

interface Parcel {
  _id: string;  
  status: 'pending' | 'accepted' | 'declined';
  description: string;
  // Add other fields as needed
}

const MyParcelPage: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const res = await fetch('/api/parcel/myparcels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setParcels(data.parcels || []);
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
              <div
                key={parcel._id}
                className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-6 py-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-gray-700 mb-2">
                    {parcel.description}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      parcel.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      parcel.status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                    </span>
                  </div>
                </div>
                {parcel.status === 'accepted' && (
                  <div className="flex flex-col items-end min-w-[220px] ml-8">
                    <button
                      className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded transition-colors mt-2"
                      onClick={() => setSelectedParcel(parcel)}
                    >
                      Chat
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedParcel && <ChatList onSelectChat={() => {}} selectedUserId={selectedParcel._id} />}
    </div>
  );
};

export default MyParcelPage;