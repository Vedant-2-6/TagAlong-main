import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import img1 from '../images/guide.png'
import img2 from '../images/webinar.png'
import img3 from '../images/account.png'
import img4 from '../images/biling.png'

const faqs = [
  {
    title: 'Guides',
    description: 'Browse our in-depth guides to help you get started.',
    button: 'View Guides',
    bg: 'bg-pink-100',
    img: img1,
    details: 'Our guides cover everything from getting started to advanced features. Follow step-by-step instructions to make the most of TagAlong.',
  },
  {
    title: 'Webinars',
    description: 'Watch recorded webinars to level up your knowledge.',
    button: 'Watch Webinars',
    bg: 'bg-yellow-100',
    img: img2,
    details: 'Join our live and recorded webinars to learn best practices, tips, and tricks from experts and the TagAlong community.',
  },
  {
    title: 'Account',
    description: 'Learn more about how to manage your TagAlong account.',
    button: 'Learn More',
    bg: 'bg-orange-100',
    img: img3,
    details: 'Manage your profile, update your settings, and keep your account secure with our comprehensive account management resources.',
  },
  {
    title: 'Billing',
    description: 'Find answers to frequently asked billing questions.',
    button: 'Read FAQs',
    bg: 'bg-green-100',
    img: img4,
    details: 'Get help with payments, invoices, and billing cycles. Find answers to common questions about your TagAlong billing.',
  },
];

const FAQPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeFaq, setActiveFaq] = useState<null | typeof faqs[0]>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        delay: 0.5,
        ease: 'power3.out',
      }
    );
  }, []);

  // Handle photo preview
  useEffect(() => {
    if (uploadedPhoto) {
      const url = URL.createObjectURL(uploadedPhoto);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadedPhoto]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-2">
      {/* Header */}
      <div ref={containerRef} className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help?</h1>
        <input
          type="text"
          placeholder="Search the help center"
          className="w-full max-w-xl mx-auto px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
      </div>
      {/* FAQ Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {faqs.map((faq, idx) => (
          <div
            key={faq.title}
            ref={el => (cardsRef.current[idx] = el)}
            className={`rounded-lg shadow-md flex flex-col ${faq.bg} overflow-hidden`}
          >
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <img
                src={faq.img}
                alt={faq.title}
                className="w-24 h-24 object-contain mb-4"
                draggable={false}
              />
              <h2 className="text-xl font-semibold mb-2 text-gray-900">{faq.title}</h2>
              <p className="text-gray-700 text-center mb-4">{faq.description}</p>
              <button
                className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition-colors"
                onClick={() => {
                  setActiveFaq(faq);
                  setUploadedPhoto(null);
                }}
              >
                {faq.button}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Popup Modal */}
      {activeFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-500 text-2xl"
              onClick={() => {
                setActiveFaq(null);
                setUploadedPhoto(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              <img
                src={activeFaq.img}
                alt={activeFaq.title}
                className="w-24 h-24 object-contain mb-4"
                draggable={false}
              />
              <h2 className="text-2xl font-bold mb-2 text-center">{activeFaq.title}</h2>
              {/* <p className="text-gray-700 text-center mb-4">{activeFaq.description}</p> */}
              <p className="text-gray-600 text-center mb-4">{activeFaq.details}</p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
          
              </label>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-contain mt-2 border rounded"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;