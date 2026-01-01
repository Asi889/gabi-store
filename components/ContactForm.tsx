'use client';

import { useState } from 'react';

export default function ContactForm({ destinationEmail }: { destinationEmail?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // destinationEmail should be your Formspree URL (e.g., https://formspree.io/f/xyzkj)
      // You can set this in the WordPress "Form Destination Email" field we created.
      const endpoint = destinationEmail && destinationEmail.includes('http') 
        ? destinationEmail 
        : `https://formspree.io/f/manual_setup_needed`; // Fallback

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="relative border-b border-black pb-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-transparent border-none p-0 focus:ring-0 text-black text-lg placeholder-gray-200"
          placeholder="Your name"
        />
      </div>

      <div className="relative border-b border-black pb-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-transparent border-none p-0 focus:ring-0 text-black text-lg placeholder-gray-200"
          placeholder="your@email.com"
        />
      </div>

      <div className="relative border-b border-black pb-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-transparent border-none p-0 focus:ring-0 text-black text-lg placeholder-gray-200 resize-none"
          placeholder="How can we help?"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`px-12 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all hover:bg-gray-800 ${
            status === 'sending' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {status === 'sending' ? 'Sending...' : 'Contact Us'}
        </button>

        {status === 'success' && (
          <p className="mt-4 text-green-600 text-sm font-bold uppercase tracking-widest">
            Message sent! We'll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest">
            {destinationEmail?.includes('http') 
              ? "Error sending message. Please try again." 
              : "Form Error: Please set a Formspree URL in WordPress."}
          </div>
        )}
      </div>
    </form>
  );
}
