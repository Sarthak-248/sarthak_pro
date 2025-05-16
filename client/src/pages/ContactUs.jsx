import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a, #000000)', // blue-950 to black
      }}
    >
      <form
        action="https://formsubmit.co/sarthakmor78@gmail.com"
        method="POST"
        className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md text-white"
        onSubmit={() => setStatus('Message sent! Check your email.')}
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide">
          Contact Us
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-xl bg-white/20 placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-xl bg-white/20 placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full mb-5 px-5 py-3 rounded-xl bg-white/20 placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full mb-6 px-5 py-3 rounded-xl bg-white/20 placeholder-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none h-36"
        />

        <input type="hidden" name="_captcha" value="false" />

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition"
        >
          Send Message
        </button>

        {status && (
          <p className="text-center mt-5 text-yellow-300 font-semibold">
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactUs;
