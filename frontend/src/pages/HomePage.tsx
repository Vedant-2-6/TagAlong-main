import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Users, PackageCheck, Globe, Truck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '../components/HeroSection';
import { mockListings } from '../data/mockData';
import ListingCard from '../components/ListingCard';

gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const featuredListings = mockListings.slice(0, 3);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll setup
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });

    // How it works animation with smooth reveal
    if (howItWorksRef.current) {
      gsap.from('.step-item', {
        opacity: 1,
        y: 50,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      });
    }

    // Testimonials animation with cards sliding in
    if (testimonialsRef.current) {
      gsap.from('.testimonial-card', {
        opacity: 1,
        x: -50,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      });
    }

    // Stats animation with counter effect
    if (statsRef.current) {
      gsap.from('.stat-item', {
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      });

      // Add number counter animation
      document.querySelectorAll('.stat-number').forEach((stat) => {
        // Get the numeric value and suffix (e.g., "K+", "%")
        const fullText = stat.textContent || '';
        const match = fullText.match(/^(\d+)([A-Za-z%+]*)$/);
        let finalNum = 0;
        let suffix = '';
        if (match) {
          finalNum = parseInt(match[1], 10);
          suffix = match[2] || '';
        }
        stat.textContent = '0' + suffix; // Set initial value to 0 with suffix

        gsap.to(
          { val: 0 },
          {
            val: finalNum,
            duration: 2,
            ease: 'power1.out',
            onUpdate: function () {
              (stat as HTMLElement).textContent = Math.ceil(this.val).toString() + suffix;
            },
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 relative overflow-x-hidden py-10">
      {/* Decorative SVG background */}
      <svg className="absolute left-0 top-0 w-full h-96 opacity-10 pointer-events-none" viewBox="0 0 1440 320">
        <path fill="#14b8a6" fillOpacity="1" d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
      </svg>
      <div className="relative z-10 max-w-5xl mx-auto mt-8 mb-8 px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-teal-100">
          <HeroSection />
        </div>
      </div>
      {/* Featured Listings */}
      <section className="py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl mx-2 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Featured Trips</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover people traveling your way who can help transport your items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredListings.map(listing => (
              <div className="transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <ListingCard key={listing.id} listing={listing} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/search"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
            >
              Explore All Trips <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 bg-gradient-to-b from-white via-teal-50 to-gray-50 rounded-3xl mx-2 mt-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">How TagAlong Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple process to get your items where they need to go.
            </p>
          </div>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 -ml-px w-0.5 bg-teal-200 hidden md:block"></div>
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16">
              <div className="step-item md:ml-auto md:pl-12 md:text-right relative">
                <div className="absolute top-0 -left-3 md:left-auto md:-right-3 h-6 w-6 rounded-full border-4 border-teal-500 bg-white hidden md:block"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for Trips</h3>
                  <p className="text-gray-600">
                    Enter your source, destination, and when you need your item delivered. We'll show you travelers going your way.
                  </p>
                </div>
              </div>

              <div className="step-item md:mr-auto md:pr-12 relative">
                <div className="absolute top-0 -left-3 h-6 w-6 rounded-full border-4 border-teal-500 bg-white hidden md:block"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Agree</h3>
                  <p className="text-gray-600">
                    Message the traveler, discuss your needs, and agree on the details of your package delivery.
                  </p>
                </div>
              </div>

              <div className="step-item md:ml-auto md:pl-12 md:text-right relative">
                <div className="absolute top-0 -left-3 md:left-auto md:-right-3 h-6 w-6 rounded-full border-4 border-teal-500 bg-white hidden md:block"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Your Parcel</h3>
                  <p className="text-gray-600">
                    Once your item is on its way, you can track its progress in real-time until it reaches its destination.
                  </p>
                </div>
              </div>

              <div className="step-item md:mr-auto md:pr-12 relative">
                <div className="absolute top-0 -left-3 h-6 w-6 rounded-full border-4 border-teal-500 bg-white hidden md:block"></div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Receive & Rate</h3>
                  <p className="text-gray-600">
                    Once your item is delivered, you can rate your experience and provide feedback to help our community.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center px-8 py-3 border border-teal-500 text-lg font-semibold rounded-xl text-teal-600 bg-white hover:bg-teal-50 transition-all duration-300 shadow"
            >
              Learn More <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-white/90 rounded-3xl mx-2 mt-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from people who have used TagAlong to transport their items.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="testimonial-card bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "I needed to send a birthday gift to my sister in Boston, and TagAlong connected me with someone who was already driving there. It saved me money and was so much more personal!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Sarah M."
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Sarah M.</h4>
                  <p className="text-xs text-gray-500">New York</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "As a frequent traveler between LA and San Francisco, TagAlong helps me offset my gas costs. I meet interesting people and help them out - it's a win-win situation!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="David L."
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">David L.</h4>
                  <p className="text-xs text-gray-500">Los Angeles</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" />
                  ))}
                  <Star size={16} className="text-gray-300" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "I needed to ship a custom painting that was too delicate for regular shipping. Found a careful driver on TagAlong who delivered it safely. Will definitely use again!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Jamie T."
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Jamie T.</h4>
                  <p className="text-xs text-gray-500">Chicago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20 bg-gradient-to-b from-gray-900 to-teal-900 text-white rounded-3xl mx-2 mt-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Why Join TagAlong?</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              We're creating a community of travelers helping each other while making logistics more efficient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="stat-item text-center">
              <div className="bg-teal-800 bg-opacity-40 rounded-lg p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500 bg-opacity-20 rounded-full mb-4">
                  <Users size={24} className="text-teal-300" />
                </div>
                <div className="text-4xl font-bold mb-2 stat-number">25K+</div>
                <div className="text-teal-200">Active Users</div>
              </div>
            </div>

            <div className="stat-item text-center">
              <div className="bg-teal-800 bg-opacity-40 rounded-lg p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500 bg-opacity-20 rounded-full mb-4">
                  <Truck size={24} className="text-teal-300" />
                </div>
                <div className="text-4xl font-bold mb-2 stat-number">18K+</div>
                <div className="text-teal-200">Successful Deliveries</div>
              </div>
            </div>

            <div className="stat-item text-center">
              <div className="bg-teal-800 bg-opacity-40 rounded-lg p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500 bg-opacity-20 rounded-full mb-4">
                  <Globe size={24} className="text-teal-300" />
                </div>
                <div className="text-4xl font-bold mb-2 stat-number">150+</div>
                <div className="text-teal-200">Cities Covered</div>
              </div>
            </div>

            <div className="stat-item text-center">
              <div className="bg-teal-800 bg-opacity-40 rounded-lg p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500 bg-opacity-20 rounded-full mb-4">
                  <PackageCheck size={24} className="text-teal-300" />
                </div>
                <div className="text-4xl font-bold mb-2 stat-number">98%</div>
                <div className="text-teal-200">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white/90 rounded-3xl mx-2 mt-12 shadow-2xl animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
                  <span className="block">Ready to Get Started?</span>
                  <span className="block text-teal-100">Join TagAlong Today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-teal-100">
                  Create an account in minutes and start connecting with travelers or find someone to transport your items.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:ml-8">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-semibold rounded-xl text-teal-600 bg-white hover:bg-teal-50 transition-all duration-300"
                  >
                    Sign Up Now
                  </Link>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <Link
                    to="/search"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-semibold rounded-xl text-white bg-teal-800 bg-opacity-70 hover:bg-opacity-90 transition-all duration-300"
                  >
                    Find Trips
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

