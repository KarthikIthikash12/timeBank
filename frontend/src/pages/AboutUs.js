import React from 'react';

export default function AboutUs() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', minHeight: '100vh', color: '#334155', lineHeight: '1.8' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e293b', marginBottom: '1rem' }}>About TimeBank</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Democratizing the world's most valuable asset: Time.</p>
      </div>

      <h2 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Our Mission</h2>
      <p style={{ marginBottom: '2.5rem' }}>
        Traditional economies rely on fiat currency, creating barriers to entry for learning and sharing skills. TimeBank was built on a simple premise: everyone has something to teach, and everyone has time. By tokenizing time into a digital asset (Time Credits), we have created a completely egalitarian marketplace where an hour of coding help is worth exactly an hour of guitar lessons.
      </p>

      <h2 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>The Escrow Security Model</h2>
      <p style={{ marginBottom: '2.5rem' }}>
        Trust is the foundation of any peer-to-peer network. To protect our users, TimeBank employs a strict Digital Escrow system. When a student books a session, their time credits are frozen. The teacher confirms the appointment, but the funds are not released until the student explicitly clicks "Mark Completed" after the session ends. If a conflict arises, a universal Cancel protocol instantly refunds the student.
      </p>

      <h2 style={{ color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>The Technology Stack</h2>
      <p style={{ marginBottom: '2.5rem' }}>
        TimeBank is a high-performance Single Page Application (SPA) powered by the modern MERN stack. 
        <br/><br/>
        <strong>Frontend:</strong> React.js handles the dynamic UI, utilizing Context API for global state management and secure route protection.<br/>
        <strong>Backend:</strong> A robust Node.js and Express server acts as the central nervous system, validating transactions and preventing temporal conflicts.<br/>
        <strong>Database:</strong> MongoDB provides a flexible, highly-scalable document structure for our complex relational queries and user ledgers.<br/>
        <strong>Security:</strong> All routes are locked behind JSON Web Tokens (JWT) and passwords are cryptographically salted using bcrypt.
      </p>
    </div>
  );
}