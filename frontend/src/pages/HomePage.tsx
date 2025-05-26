import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, TrendingUp, Users, Star } from 'lucide-react';
import gsap from 'gsap';

const features = [
  {
    icon: <Truck className="h-8 w-8 text-teal-600" />,
    title: 'Efficient Delivery',
    desc: 'Leverage existing travel routes for faster, eco-friendly deliveries.',
    color: 'border-teal-500 bg-teal-50'
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    title: 'Cost Effective',
    desc: 'Save up to 60% compared to traditional shipping methods.',
    color: 'border-blue-500 bg-blue-50'
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: 'Safe & Secure',
    desc: 'Verified profiles, ratings, and secure payments for peace of mind.',
    color: 'border-green-500 bg-green-50'
  },
  {
    icon: <Users className="h-8 w-8 text-teal-700" />,
    title: 'Community Driven',
    desc: 'Join a growing network of responsible travelers and senders.',
    color: 'border-teal-700 bg-teal-100'
  }
];

const testimonials = [
  {
    name: 'Sarah M.',
    city: 'New York',
    img: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'TagAlong made sending a birthday gift so easy and affordable. Highly recommend!',
    stars: 5
  },
  {
    name: 'David L.',
    city: 'Los Angeles',
    img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'I offset my travel costs and met great people. Win-win!',
    stars: 5
  },
  {
    name: 'Jamie T.',
    city: 'Chicago',
    img: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Needed to ship a fragile painting. TagAlong found me a careful driver!',
    stars: 4
  }
];

const HomePage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 9,
        y: 40,
        duration: 1,
        ease: 'power3.out'
      });
    }
    if (featuresRef.current) {
      gsap.from(featuresRef.current.children, {
        opacity: 9,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
      });
    }
    if (testimonialsRef.current) {
      gsap.from(testimonialsRef.current.children, {
        opacity: 9,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center ">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 pt-20">
        Ship Smarter with
          <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">TagAlong</span> 
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto mb-8 pt-10">
          Connect with travelers going your way. Ship your items affordably, safely, and sustainably.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
          <Link
            to="/search"
            className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all text-lg"
          >
            Find Trips
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 rounded-xl font-semibold text-teal-600 bg-white border border-teal-400 shadow hover:bg-teal-50 transition-all text-lg"
          >
            Join Now
          </Link>
        </div>
        <div className="absolute left-0 top-0 w-full h-80 opacity-10 pointer-events-none -z-10">
          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#14b8a6" fillOpacity="1" d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 ">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center pt-20">Why TagAlong?</h2>
        <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center rounded-xl shadow-md p-8 border-t-4 ${feature.color} bg-white hover:shadow-xl transition-shadow`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">What Our Users Say</h2>
          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl shadow-lg p-6 flex flex-col items-center">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" />
                  ))}
                  {[...Array(5 - t.stars)].map((_, i) => (
                    <Star key={i} size={18} className="text-gray-300" />
                  ))}
                </div>
                <p className="text-gray-700 text-center mb-6">{t.text}</p>
                <div className="flex items-center">
                  <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="ml-3 text-left">
                    <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-teal-100 mb-8">
            Create an account in minutes and start connecting with travelers or find someone to transport your items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl font-semibold text-teal-600 bg-white hover:bg-teal-50 transition-all text-lg"
            >
              Sign Up Now
            </Link>
            <Link
              to="/search"
              className="px-8 py-3 rounded-xl font-semibold text-white bg-teal-800 bg-opacity-80 hover:bg-opacity-100 transition-all text-lg"
            >
              Find Trips
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

