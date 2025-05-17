import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from '../images/eco.png';
import Image2 from '../images/secure.png';
import Image3 from '../images/earn1.png';
import Image4  from '../images/247.png';
import Image5 from '../images/tr.png';
import Image6 from '../images/c.png';

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <>
      <div ref={containerRef} className="pt-20 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-Helvetica text-gray-900 mb-8 underline">
          About Us
        </h1>
        <div className="text-lg text-gray-700 leading-relaxed space-y-6">
          <p>
            <span className="font-semibold text-teal-600">TagAlong</span> – Send Smart.
          </p>
          <p>
            Tagalong is a cutting-edge transportation platform that connects travelers with individuals who want to send items along the same route. Our mission is to make logistics more human, sustainable, and collaborative.
          </p>
          <p>
            At Tagalong, we're redefining the way people connect and move things around the world. Our platform connects travelers heading in a specific direction with individuals looking to ship items along the same route — creating a smarter, more sustainable alternative to traditional shipping.
          </p>
          <p>
            Born out of a simple idea — that there’s already someone going your way — Tagalong transforms unused travel space into opportunity. Whether you’re a traveler looking to earn a little extra by carrying items, or someone who wants to send something without the high cost and environmental impact of standard shipping, Tagalong makes it simple, safe, and efficient.
          </p>
          <p>
            We’re on a mission to reduce carbon footprints, lower shipping costs, and build a global community of responsible travelers and senders. Together, we’re making logistics more human, sustainable, and collaborative.
          </p>
          <p className="font-semibold text-teal-700">
            Tagalong – Connect. Carry. Care.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div
        ref={featuresRef}
        className="mt-16 px-4 max-w-5xl mx-auto py-10"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-10"><u><center>Features</center></u></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
            <img src={Image} alt="Eco Friendly" className="w-20 h-20 mb-6 border-2" />
            <h3 className="font-semibold text-lg mb-2">Eco-Friendly Shipping</h3>
            <p className="text-gray-600 text-center">Reduce carbon footprint by utilizing existing travel routes for deliveries.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
            <img src={Image2} alt="Secure" className="w-20 h-20 mb-6 border-2" />
            <h3 className="font-semibold text-lg mb-2">Secure & Reliable</h3>
            <p className="text-gray-600 text-center">Verified travelers and senders ensure safe and trustworthy deliveries.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
            <img src={Image3} alt="Earn" className="w-20 h-20 mb-6 border-2" />
            <h3 className="font-semibold text-lg mb-2">Earn While You Travel</h3>
            <p className="text-gray-600 text-center">Travelers can earn extra income by carrying parcels for others.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
            <img src={Image5} alt="Track" className="w-20 h-20 mb-6 border-2" />
            <h3 className="font-semibold text-lg mb-2">Real-Time Tracking</h3>
            <p className="text-gray-600 text-center">Track your parcel’s journey from sender to recipient in real time.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
            <img src={Image4} alt="Support" className="w-20 h-20 mb-6 border-2" />
            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-center">Our support team is always available to help with your queries.</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
            <img src={Image6} alt="Community" className="w-20 h-20 mb-6 border-2" />
            <h3 className="font-semibold text-lg mb-2">Global Community</h3>
            <p className="text-gray-600 text-center">Join a growing network of responsible travelers and senders worldwide.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;