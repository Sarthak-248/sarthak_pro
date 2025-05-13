import React from 'react';

export default function Faq() {
  const faqs = [
    {
      question: 'How do I search for properties?',
      answer: 'Use the search bar on the homepage to filter properties by location, price, type, and more.',
    },
    {
      question: 'Is it free to use Sarthak’s Estate?',
      answer: 'Absolutely. Browsing, saving, and comparing listings are all completely free.',
    },
    {
      question: 'Can I contact property owners directly?',
      answer: 'Yes! Every listing has a contact button that lets you email the owner instantly.',
    },
    {
      question: 'Is my data safe with Sarthak’s Estate?',
      answer: 'Yes. We use secure protocols and do not share your information without consent.',
    },
    {
      question: 'Can I schedule a visit to a property?',
      answer: 'Yes. Contact the owner and request a viewing that works for both parties.',
    },
    {
      question: 'Do you list commercial properties?',
      answer: 'Yes, we include residential, commercial, and land listings to suit all needs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 py-20 px-6 text-white relative overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full">
        <svg className="w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#1e3a8a" fillOpacity="1" d="M0,32L60,64C120,96,240,160,360,160C480,160,600,96,720,96C840,96,960,160,1080,154.7C1200,149,1320,75,1380,37.3L1440,0L1440,0L0,0Z" />
        </svg>
      </div>

      {/* Title */}
      <div className="relative z-10 max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 drop-shadow-lg">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-300 mt-4 text-base sm:text-lg max-w-2xl mx-auto">
          Everything you need to know about using <strong>Sarthak’s Estate</strong>
        </p>
      </div>

      {/* FAQ Cards */}
      <div className="relative z-10 max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl transition hover:shadow-yellow-500/40 hover:-translate-y-1 duration-300"
          >
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">{faq.question}</h3>
            <p className="text-slate-100 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 w-full rotate-180">
        <svg className="w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#1e3a8a" fillOpacity="1" d="M0,96L60,106.7C120,117,240,139,360,133.3C480,128,600,96,720,101.3C840,107,960,149,1080,144C1200,139,1320,85,1380,58.7L1440,32L1440,320L0,320Z" />
        </svg>
      </div>
    </div>
  );
}
