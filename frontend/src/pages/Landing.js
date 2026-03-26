import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(15,23,42,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(15,23,42,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '1.5rem 5%', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', color: '#f8fafc', cursor: 'pointer' }}>
          TIME<span style={{ color: '#8b5cf6' }}>BANK</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = 'white'}
            onMouseOut={(e) => e.target.style.color = '#cbd5e1'}
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/register')} 
            style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '99px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)' }}
          >
            Sign Up
          </button>
        </div>
      </nav>
      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', textAlign: 'center', padding: '0 2rem' }}>
        
        <div style={{ maxWidth: '900px' }}>

          <div style={{ display: 'inline-block', padding: '0.5rem 1.25rem', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '2rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            THE DIGITAL HORIZON IS HERE
          </div>

          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Your Time is the <br/>
            <span style={{ background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ultimate Currency.</span>
          </h1>

          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: '#94a3b8', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            Join a network of global architects and learners. Exchange your expertise, earn time credits, and master new skills without spending a single dime. 
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem', fontWeight: 'bold', color: 'white', background: '#8b5cf6', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)', transition: 'transform 0.2s, background 0.2s' }}
              onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.background = '#7c3aed'; }}
              onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.background = '#8b5cf6'; }}
            >
              Get Started Now →
            </button>
            <button
              onClick={() => navigate('/about-us')}
              style={{ padding: '1.1rem 2.5rem', fontSize: '1.1rem', fontWeight: 'bold', color: '#f8fafc', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
            >
              Learn the Protocols
            </button>
          </div>
          
        </div>
        

      </main>
    </div>
  );
}