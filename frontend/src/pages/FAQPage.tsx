import { useRef, useEffect } from 'react';
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
    img: img1, // Replace with your image path
  },
  {
    title: 'Webinars',
    description: 'Watch recorded webinars to level up your knowledge.',
    button: 'Watch Webinars',
    bg: 'bg-yellow-100',
    img: img2,
  },
  {
    title: 'Account',
    description: 'Learn more about how to manage your TagAlong account.',
    button: 'Learn More',
    bg: 'bg-orange-100',
    img: img3,
  },
  {
    title: 'Billing',
    description: 'Find answers to frequently asked billing questions.',
    button: 'Read FAQs',
    bg: 'bg-green-100',
    img: img4,
  },
];

const FAQPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
              <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition-colors">
                {faq.button}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;