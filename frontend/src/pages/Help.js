import React, { useState } from 'react';

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "What is TimeBank?", a: "TimeBank is a digital marketplace where users trade their skills using Time Credits instead of traditional currency." },
    { q: "How do Time Credits work?", a: "1 Time Credit equals 1 minute of service. You earn credits by teaching, and spend them by booking others." },
    { q: "Is the platform free to use?", a: "Yes! There are no subscription fees. You trade entirely in temporal assets." },
    { q: "How do I earn more credits?", a: "List a skill in your profile, accept booking requests, and complete sessions to get paid in time." },
    { q: "What is the Escrow system?", a: "When you book a session, your time is held securely in Escrow. The teacher only gets paid after you click 'Mark Completed'." },
    { q: "How do I cancel a booking?", a: "Go to your Dashboard and click 'Cancel Booking'. Your escrowed time will be instantly refunded to your vault." },
    { q: "What if my teacher doesn't show up?", a: "Simply cancel the session from your dashboard to trigger an automatic refund." },
    { q: "Can the teacher mark a session complete?", a: "No. For security, only the student can release the funds from Escrow." },
    { q: "How do I leave a review?", a: "Once a session is completed, go to your History tab. You will see a 'Leave a Review' button next to the session." },
    { q: "Where can I see my past sessions?", a: "All completed and cancelled sessions are securely stored in your History Ledger." },
    { q: "What happens if I reject a request?", a: "If you are a teacher and reject a request, the student is instantly refunded their time." },
    { q: "Who can become a teacher?", a: "Anyone! Just add your skills to your profile and you will appear in the Marketplace." },
    { q: "Can I buy Time Credits with money?", a: "Currently, TimeBank operates strictly on a peer-to-peer time exchange model." },
    { q: "How do I reset my password?", a: "Click the 'Forgot Password' link on the login screen to receive a secure reset link via email." },
    { q: "Is my personal data secure?", a: "Yes. All passwords are cryptographically hashed using bcrypt, and we use secure JWT tokens for authentication." }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '0.5rem', textAlign: 'center' }}>Help Center</h1>
      <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '3rem' }}>Everything you need to know about the TimeBank ecosystem.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ width: '100%', padding: '1.25rem', textAlign: 'left', background: 'none', border: 'none', fontWeight: 'bold', color: '#0f172a', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
            >
              {faq.q}
              <span style={{ color: '#8b5cf6' }}>{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: '#475569', lineHeight: '1.6' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}