'use client';

import { useState } from 'react';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function InfoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
      >
        <FaInfoCircle />
        About PM Accelerator
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">About PM Accelerator</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-800">Product Manager Accelerator</h3>
                <p className="text-gray-600">
                  The Product Manager Accelerator Program is designed to support PM professionals through every stage of their careers. 
                  From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped 
                  over hundreds of students fulfill their career aspirations.
                </p>
                
                <p className="text-gray-600 mt-3">
                  Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed 
                  and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.
                </p>

                <h4 className="text-lg font-bold text-gray-800 mt-4">Our Services:</h4>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold text-gray-700">🚀 PM Accelerator Pro</h5>
                    <p className="text-gray-600 text-sm">
                      End-to-end product manager job hunting program that helps you master FAANG-level Product Management skills, 
                      conduct unlimited mock interviews, and gain job referrals through our largest alumni network. 25% of our offers 
                      came from tier 1 companies and get paid as high as $800K/year.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-700">🚀 AI PM Bootcamp</h5>
                    <p className="text-gray-600 text-sm">
                      Gain hands-on AI Product Management skills by building a real-life AI product with a team of AI Engineers, 
                      data scientists, and designers. We will also help you launch your product with real user engagement using our 
                      100,000+ PM community and social media channels.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-700">🚀 PM Accelerator Power Skills</h5>
                    <p className="text-gray-600 text-sm">
                      Designed for existing product managers to sharpen their product management skills, leadership skills, and 
                      executive presentation skills.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-700">🚀 PM Accelerator Leader</h5>
                    <p className="text-gray-600 text-sm">
                      We help you accelerate your product management career, get promoted to Director and product executive levels, 
                      and win in the board room.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-700">🚀 1:1 Resume Review</h5>
                    <p className="text-gray-600 text-sm">
                      We help you rewrite your killer product manager resume to stand out from the crowd, with an interview guarantee. 
                      Get started by using our FREE killer PM resume template used by over 14,000 product managers.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    📚 <strong>Free Resources:</strong> We've published over 500+ free training and courses. Check out Dr. Nancy Li's 
                    YouTube channel and Instagram @drnancyli to start learning for free today.
                  </p>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Founded:</strong> 2020 | <strong>Location:</strong> Boston, MA</p>
                  <p><strong>Industry:</strong> E-Learning Providers</p>
                  <p><strong>Community:</strong> 141+ associated members and growing</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href="https://www.linkedin.com/school/pmaccelerator/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Visit LinkedIn
                  </a>
                  <a
                    href="https://www.pmaccelerator.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
