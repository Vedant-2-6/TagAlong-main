import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { Bell, Globe, Lock, Trash, Mail, Phone, Edit, Check, X } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [email, setEmail] = useState('user@example.com');
  const [editingEmail, setEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);

  const [phoneNumber, setPhoneNumber] = useState('123-456-7890');
  const [editingPhone, setEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState(phoneNumber);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handlePasswordChange = () => {
    if (oldPassword === 'correctOldPassword') {
      console.log('Password changed to:', newPassword);
    } else {
      console.log('Old password is incorrect');
    }
  };

  const handleDeleteAccount = () => {
    if (deletePassword === 'correctOldPassword') {
      console.log('Account deleted');
      // Add actual delete logic here
    } else {
      alert('Incorrect password. Account not deleted.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Settings</h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="space-y-6">
            {/* Email */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <Mail className="mr-2" /> Email
              </span>
              <div className="flex items-center">
                {editingEmail ? (
                  <>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={e => setTempEmail(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 p-2 mr-2"
                    />
                    <button
                      onClick={() => {
                        setEmail(tempEmail);
                        setEditingEmail(false);
                      }}
                      className="text-green-600 hover:text-green-800 mr-1"
                      title="Save"
                    >
                      <Check />
                    </button>
                    <button
                      onClick={() => {
                        setTempEmail(email);
                        setEditingEmail(false);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Cancel"
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-700 mr-2">{email}</span>
                    <button
                      onClick={() => setEditingEmail(true)}
                      className="text-teal-500 hover:text-teal-600 transition"
                      title="Edit Email"
                    >
                      <Edit />
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Phone */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <Phone className="mr-2" /> Phone Number
              </span>
              <div className="flex items-center">
                {editingPhone ? (
                  <>
                    <input
                      type="tel"
                      value={tempPhone}
                      onChange={e => setTempPhone(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 p-2 mr-2"
                    />
                    <button
                      onClick={() => {
                        setPhoneNumber(tempPhone);
                        setEditingPhone(false);
                      }}
                      className="text-green-600 hover:text-green-800 mr-1"
                      title="Save"
                    >
                      <Check />
                    </button>
                    <button
                      onClick={() => {
                        setTempPhone(phoneNumber);
                        setEditingPhone(false);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Cancel"
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-700 mr-2">{phoneNumber}</span>
                    <button
                      onClick={() => setEditingPhone(true)}
                      className="text-teal-500 hover:text-teal-600 transition"
                      title="Edit Phone"
                    >
                      <Edit />
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Change Password */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <Lock className="mr-2" /> Change Password
              </span>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className={`px-4 py-2 rounded-md transition ${
                  showPasswordChange ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
                } text-white`}
              >
                {showPasswordChange ? 'Hide' : 'Show'} Change Password
              </button>
            </div>
            {showPasswordChange && (
              <div className="bg-gray-100 p-4 rounded-md shadow-inner">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 mb-2"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 mb-2"
                />
                <button
                  onClick={handlePasswordChange}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition w-full"
                >
                  Change Password
                </button>
              </div>
            )}
            {/* Notifications */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <Bell className="mr-2" /> Enable Notifications
              </span>
              <Switch
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
                className={`${
                  notificationsEnabled ? 'bg-teal-500' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
              >
                <span
                  className={`${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
            {/* Language */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <Globe className="mr-2" /> Language Preferences
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-32 p-2.5"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
                <option>French</option>
              </select>
            </div>
            {/* Delete Account */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-red-700">
                <Trash className="mr-2" /> Delete Account
              </span>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete Account
              </button>
            </div>
            {showDeleteConfirm && (
              <div className="bg-red-50 p-4 rounded-md shadow-inner flex flex-col items-center">
                <input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-red-500 focus:border-red-500 block w-full p-2.5 mb-2"
                />
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition w-full"
                >
                  Confirm Delete Account
                </button>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/profile"
              className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;