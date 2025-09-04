'use client'

import React from 'react'

export function EducationalScribbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mathematical Formula */}
      <div 
        className="scribble-element animate-drift text-4xl font-thin"
        style={{ 
          top: '10%', 
          left: '15%',
          animationDelay: '0s',
          transform: 'rotate(-15deg)'
        }}
      >
        ∫ f(x)dx
      </div>

      {/* Book Outline */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          top: '70%', 
          right: '10%',
          animationDelay: '2s'
        }}
      >
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 5 L5 45 L55 45 L55 5 L5 5" />
          <path d="M5 15 L55 15" />
          <path d="M5 25 L55 25" />
          <path d="M5 35 L55 35" />
          <path d="M15 15 L15 45" />
        </svg>
      </div>

      {/* Lightbulb Idea */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          top: '20%', 
          right: '20%',
          animationDelay: '4s'
        }}
      >
        <svg width="40" height="60" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="20" cy="20" r="12"/>
          <path d="M12 28 L28 28"/>
          <path d="M14 32 L26 32"/>
          <path d="M16 36 L24 36"/>
          <path d="M18 40 L22 40"/>
          <path d="M20 8 L20 4"/>
          <path d="M32 16 L35 13"/>
          <path d="M32 24 L35 27"/>
          <path d="M8 16 L5 13"/>
          <path d="M8 24 L5 27"/>
        </svg>
      </div>

      {/* Mathematical Equation */}
      <div 
        className="scribble-element animate-drift text-2xl"
        style={{ 
          bottom: '20%', 
          left: '10%',
          animationDelay: '6s',
          transform: 'rotate(10deg)'
        }}
      >
        E = mc²
      </div>

      {/* Brain/AI Outline */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          top: '60%', 
          left: '80%',
          animationDelay: '1s'
        }}
      >
        <svg width="50" height="40" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 20 C10 10, 20 5, 30 10 C40 5, 45 15, 40 25 C45 30, 35 35, 25 30 C15 35, 5 25, 10 20 Z"/>
          <circle cx="20" cy="18" r="2" fill="currentColor"/>
          <circle cx="30" cy="18" r="2" fill="currentColor"/>
          <path d="M18 25 Q25 30 32 25"/>
        </svg>
      </div>

      {/* Graph/Chart */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '40%', 
          left: '5%',
          animationDelay: '3s'
        }}
      >
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 45 L5 5"/>
          <path d="M5 45 L55 45"/>
          <path d="M5 40 L15 30 L25 35 L35 20 L45 25 L55 15"/>
          <circle cx="15" cy="30" r="2" fill="currentColor"/>
          <circle cx="25" cy="35" r="2" fill="currentColor"/>
          <circle cx="35" cy="20" r="2" fill="currentColor"/>
          <circle cx="45" cy="25" r="2" fill="currentColor"/>
        </svg>
      </div>

      {/* Graduation Cap */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '30%', 
          right: '25%',
          animationDelay: '5s'
        }}
      >
        <svg width="50" height="40" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 20 L25 10 L45 20 L25 30 L5 20"/>
          <path d="M10 22 L10 32 L25 38 L40 32 L40 22"/>
          <path d="M42 20 L42 30"/>
          <circle cx="42" cy="32" r="2"/>
        </svg>
      </div>

      {/* Chemistry Molecule */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          top: '80%', 
          left: '40%',
          animationDelay: '7s'
        }}
      >
        <svg width="60" height="50" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="15" cy="15" r="5"/>
          <circle cx="35" cy="15" r="5"/>
          <circle cx="25" cy="35" r="5"/>
          <circle cx="45" cy="25" r="5"/>
          <path d="M20 15 L30 15"/>
          <path d="M25 20 L25 30"/>
          <path d="M40 20 L30 30"/>
          <path d="M30 20 L40 30"/>
        </svg>
      </div>

      {/* Question Mark */}
      <div 
        className="scribble-element animate-drift text-5xl font-thin"
        style={{ 
          top: '30%', 
          left: '85%',
          animationDelay: '8s',
          transform: 'rotate(-20deg)'
        }}
      >
        ?
      </div>

      {/* Geometric Shapes */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '60%', 
          left: '60%',
          animationDelay: '2.5s'
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="25" cy="25" r="15"/>
          <rect x="10" y="10" width="15" height="15"/>
          <polygon points="40,35 35,45 45,45"/>
        </svg>
      </div>

      {/* Pencil */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          bottom: '10%', 
          right: '5%',
          animationDelay: '4.5s',
          transform: 'rotate(45deg)'
        }}
      >
        <svg width="60" height="10" viewBox="0 0 60 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="0" y="3" width="45" height="4"/>
          <polygon points="45,1 55,5 45,9"/>
          <path d="M5 3 L5 7"/>
          <path d="M10 3 L10 7"/>
        </svg>
      </div>

      {/* Pi Symbol */}
      <div 
        className="scribble-element animate-fade-pulse text-3xl font-thin"
        style={{ 
          top: '50%', 
          left: '3%',
          animationDelay: '9s',
          color: '#8b5cf6'
        }}
      >
        π
      </div>

      {/* Computer/AI */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '15%', 
          left: '75%',
          animationDelay: '1.5s',
          color: '#06b6d4'
        }}
      >
        <svg width="50" height="40" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="5" width="40" height="25" rx="2"/>
          <rect x="8" y="8" width="34" height="19"/>
          <path d="M15 35 L35 35"/>
          <path d="M20 30 L30 30"/>
          <circle cx="25" cy="37" r="1" fill="currentColor"/>
        </svg>
      </div>

      {/* Clock/Time */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          bottom: '50%', 
          right: '15%',
          animationDelay: '6.5s',
          color: '#10b981'
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="20" cy="20" r="15"/>
          <path d="M20 8 L20 4"/>
          <path d="M20 36 L20 32"/>
          <path d="M32 20 L36 20"/>
          <path d="M4 20 L8 20"/>
          <path d="M20 20 L20 12"/>
          <path d="M20 20 L28 28"/>
        </svg>
      </div>

      {/* DNA Helix */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '5%', 
          left: '50%',
          animationDelay: '3.5s',
          color: '#f59e0b'
        }}
      >
        <svg width="30" height="60" viewBox="0 0 30 60" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 5 Q15 15 25 25 Q15 35 5 45 Q15 55 25 65"/>
          <path d="M25 5 Q15 15 5 25 Q15 35 25 45 Q15 55 5 65"/>
          <path d="M5 15 L25 15"/>
          <path d="M5 25 L25 25"/>
          <path d="M5 35 L25 35"/>
          <path d="M5 45 L25 45"/>
        </svg>
      </div>

      {/* Atom */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '15%', 
          left: '70%',
          animationDelay: '8.5s',
          color: '#ef4444'
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="25" cy="25" r="3" fill="currentColor"/>
          <ellipse cx="25" cy="25" rx="18" ry="8" transform="rotate(0 25 25)"/>
          <ellipse cx="25" cy="25" rx="18" ry="8" transform="rotate(60 25 25)"/>
          <ellipse cx="25" cy="25" rx="18" ry="8" transform="rotate(-60 25 25)"/>
        </svg>
      </div>

      {/* Mathematical Symbols */}
      <div 
        className="scribble-element animate-slow-drift text-2xl"
        style={{ 
          top: '35%', 
          right: '40%',
          animationDelay: '7.5s',
          color: '#6366f1',
          transform: 'rotate(15deg)'
        }}
      >
        √ ∑ ∞
      </div>

      {/* Paper Airplane */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          bottom: '40%', 
          left: '25%',
          animationDelay: '5.5s',
          color: '#8b5cf6'
        }}
      >
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 15 L35 5 L25 15 L35 25 L5 15"/>
          <path d="M25 15 L15 20"/>
        </svg>
      </div>

      {/* Globe */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          top: '25%', 
          left: '90%',
          animationDelay: '2.8s',
          color: '#059669'
        }}
      >
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="22.5" cy="22.5" r="18"/>
          <path d="M4.5 22.5 L40.5 22.5"/>
          <path d="M22.5 4.5 Q22.5 22.5 22.5 40.5"/>
          <path d="M13 10 Q22.5 15 32 10"/>
          <path d="M13 35 Q22.5 30 32 35"/>
        </svg>
      </div>

      {/* Telescope */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '65%', 
          right: '8%',
          animationDelay: '4.2s',
          color: '#7c3aed',
          transform: 'rotate(30deg)'
        }}
      >
        <svg width="50" height="20" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="7" width="30" height="6"/>
          <rect x="35" y="8" width="10" height="4"/>
          <path d="M5 10 L0 15"/>
          <path d="M5 10 L0 5"/>
          <circle cx="47" cy="10" r="2"/>
        </svg>
      </div>

      {/* Test Tube */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '75%', 
          left: '8%',
          animationDelay: '6.8s',
          color: '#dc2626'
        }}
      >
        <svg width="30" height="50" viewBox="0 0 30 50" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="10" y="5" width="10" height="35" rx="5"/>
          <path d="M8 5 L22 5"/>
          <path d="M8 8 L22 8"/>
          <circle cx="15" cy="15" r="2" fill="currentColor" opacity="0.3"/>
          <circle cx="15" cy="25" r="1.5" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* Calculator */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          bottom: '75%', 
          left: '35%',
          animationDelay: '1.2s',
          color: '#4338ca'
        }}
      >
        <svg width="35" height="45" viewBox="0 0 35 45" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="5" width="25" height="35" rx="3"/>
          <rect x="8" y="8" width="19" height="8"/>
          <circle cx="12" cy="25" r="2"/>
          <circle cx="18" cy="25" r="2"/>
          <circle cx="24" cy="25" r="2"/>
          <circle cx="12" cy="32" r="2"/>
          <circle cx="18" cy="32" r="2"/>
          <circle cx="24" cy="32" r="2"/>
        </svg>
      </div>

      {/* Microscope */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '8%', 
          right: '35%',
          animationDelay: '3.7s',
          color: '#0891b2'
        }}
      >
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="15" y="40" width="10" height="8"/>
          <path d="M10 40 L30 40"/>
          <circle cx="20" cy="25" r="8"/>
          <circle cx="20" cy="25" r="4"/>
          <path d="M20 17 L20 10"/>
          <path d="M16 10 L24 10"/>
          <circle cx="25" cy="15" r="2"/>
        </svg>
      </div>

      {/* Rocket */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '55%', 
          right: '30%',
          animationDelay: '8.1s',
          color: '#ea580c'
        }}
      >
        <svg width="30" height="50" viewBox="0 0 30 50" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="15,5 10,35 20,35"/>
          <circle cx="15" cy="20" r="3"/>
          <path d="M8 35 L8 42 L15 38 L22 42 L22 35"/>
          <path d="M12 45 L18 45"/>
        </svg>
      </div>

      {/* Mathematical Functions */}
      <div 
        className="scribble-element animate-slow-drift text-lg"
        style={{ 
          top: '18%', 
          left: '35%',
          animationDelay: '5.1s',
          color: '#7c2d12',
          transform: 'rotate(-8deg)'
        }}
      >
        sin(x) cos(x)
      </div>

      {/* Star Constellation */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '45%', 
          right: '5%',
          animationDelay: '7.3s',
          color: '#581c87'
        }}
      >
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="10" cy="10" r="1" fill="currentColor"/>
          <circle cx="25" cy="5" r="1" fill="currentColor"/>
          <circle cx="40" cy="15" r="1" fill="currentColor"/>
          <circle cx="50" cy="25" r="1" fill="currentColor"/>
          <circle cx="15" cy="30" r="1" fill="currentColor"/>
          <circle cx="35" cy="35" r="1" fill="currentColor"/>
          <path d="M10 10 L25 5 L40 15 L50 25"/>
          <path d="M15 30 L35 35"/>
        </svg>
      </div>

      {/* Dna Strand (smaller) */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '25%', 
          right: '40%',
          animationDelay: '4.9s',
          color: '#be123c'
        }}
      >
        <svg width="20" height="40" viewBox="0 0 20 40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5 Q10 10 17 15 Q10 20 3 25 Q10 30 17 35"/>
          <path d="M17 5 Q10 10 3 15 Q10 20 17 25 Q10 30 3 35"/>
        </svg>
      </div>

      {/* Omega Symbol */}
      <div 
        className="scribble-element animate-slow-drift text-4xl font-thin"
        style={{ 
          bottom: '80%', 
          right: '20%',
          animationDelay: '6.2s',
          color: '#166534'
        }}
      >
        Ω
      </div>

      {/* Beaker */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '55%', 
          left: '12%',
          animationDelay: '2.4s',
          color: '#0369a1'
        }}
      >
        <svg width="30" height="40" viewBox="0 0 30 40" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 5 L10 15 L5 30 L25 30 L20 15 L20 5"/>
          <path d="M8 5 L22 5"/>
          <path d="M10 25 L20 25" opacity="0.5"/>
          <circle cx="15" cy="20" r="1" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>

      {/* Delta Symbol */}
      <div 
        className="scribble-element animate-fade-pulse text-3xl"
        style={{ 
          top: '65%', 
          right: '50%',
          animationDelay: '3.9s',
          color: '#92400e'
        }}
      >
        Δ
      </div>

      {/* Circuit Board */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          bottom: '18%', 
          left: '50%',
          animationDelay: '7.8s',
          color: '#15803d'
        }}
      >
        <svg width="50" height="30" viewBox="0 0 50 30" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="10" width="8" height="6"/>
          <rect x="37" y="12" width="8" height="4"/>
          <circle cx="20" cy="8" r="3"/>
          <circle cx="30" cy="22" r="3"/>
          <path d="M13 13 L17 11"/>
          <path d="M23 8 L37 14"/>
          <path d="M30 19 L30 16 L37 16"/>
          <path d="M9 16 L9 22 L27 22"/>
        </svg>
      </div>

      {/* Compass */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '85%', 
          right: '60%',
          animationDelay: '1.7s',
          color: '#7c2d12'
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="20" cy="20" r="15"/>
          <path d="M20 8 L20 12"/>
          <path d="M20 28 L20 32"/>
          <path d="M32 20 L28 20"/>
          <path d="M8 20 L12 20"/>
          <polygon points="20,15 18,22 20,20 22,22" fill="currentColor"/>
        </svg>
      </div>

      {/* Sigma Symbol */}
      <div 
        className="scribble-element animate-fade-pulse text-2xl"
        style={{ 
          bottom: '35%', 
          right: '75%',
          animationDelay: '9.1s',
          color: '#7e22ce'
        }}
      >
        Σ
      </div>

      {/* WiFi/Signal Waves */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          top: '72%', 
          right: '12%',
          animationDelay: '4.6s',
          color: '#0284c7'
        }}
      >
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="20" cy="25" r="2" fill="currentColor"/>
          <path d="M14 20 Q20 15 26 20"/>
          <path d="M10 15 Q20 8 30 15"/>
          <path d="M6 10 Q20 1 34 10"/>
        </svg>
      </div>

      {/* Alpha Symbol */}
      <div 
        className="scribble-element animate-drift text-3xl font-thin"
        style={{ 
          top: '12%', 
          left: '25%',
          animationDelay: '8.7s',
          color: '#b45309'
        }}
      >
        α
      </div>

      {/* Periodic Table Element */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '62%', 
          left: '45%',
          animationDelay: '6.5s',
          color: '#991b1b'
        }}
      >
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="5" width="25" height="25"/>
          <text x="17.5" y="15" textAnchor="middle" fontSize="10" fill="currentColor">H</text>
          <text x="17.5" y="25" textAnchor="middle" fontSize="6" fill="currentColor">1</text>
        </svg>
      </div>

      {/* Binary Code */}
      <div 
        className="scribble-element animate-slow-drift text-sm font-mono"
        style={{ 
          top: '38%', 
          left: '78%',
          animationDelay: '3.3s',
          color: '#374151',
          transform: 'rotate(90deg)'
        }}
      >
        1010110
      </div>

      {/* More Mathematical Symbols */}
      <div 
        className="scribble-element animate-drift text-xl"
        style={{ 
          bottom: '88%', 
          left: '60%',
          animationDelay: '4.1s',
          color: '#dc2626',
          transform: 'rotate(-25deg)'
        }}
      >
        ∇ · ∂
      </div>

      {/* Flask */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          top: '90%', 
          left: '75%',
          animationDelay: '2.9s',
          color: '#059669'
        }}
      >
        <svg width="25" height="35" viewBox="0 0 25 35" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="5" width="7" height="8"/>
          <path d="M9 13 L5 25 L20 25 L16 13"/>
          <path d="M7 5 L18 5"/>
          <circle cx="12.5" cy="20" r="1" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>

      {/* Theta Symbol */}
      <div 
        className="scribble-element animate-slow-drift text-3xl font-thin"
        style={{ 
          top: '28%', 
          right: '65%',
          animationDelay: '7.7s',
          color: '#7c3aed'
        }}
      >
        θ
      </div>

      {/* Network/Graph */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          bottom: '45%', 
          right: '85%',
          animationDelay: '5.8s',
          color: '#0891b2'
        }}
      >
        <svg width="45" height="35" viewBox="0 0 45 35" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="3"/>
          <circle cx="37" cy="8" r="3"/>
          <circle cx="22" cy="27" r="3"/>
          <circle cx="30" cy="15" r="3"/>
          <path d="M8 8 L37 8"/>
          <path d="M8 8 L22 27"/>
          <path d="M37 8 L22 27"/>
          <path d="M37 8 L30 15"/>
          <path d="M30 15 L22 27"/>
        </svg>
      </div>

      {/* Lambda Symbol */}
      <div 
        className="scribble-element animate-fade-pulse text-2xl"
        style={{ 
          top: '52%', 
          right: '25%',
          animationDelay: '8.9s',
          color: '#ea580c'
        }}
      >
        λ
      </div>

      {/* Ruler */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          bottom: '28%', 
          left: '15%',
          animationDelay: '3.6s',
          color: '#4338ca',
          transform: 'rotate(15deg)'
        }}
      >
        <svg width="60" height="15" viewBox="0 0 60 15" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="5" width="50" height="5"/>
          <path d="M10 5 L10 10"/>
          <path d="M15 5 L15 8"/>
          <path d="M20 5 L20 10"/>
          <path d="M25 5 L25 8"/>
          <path d="M30 5 L30 10"/>
          <path d="M35 5 L35 8"/>
          <path d="M40 5 L40 10"/>
          <path d="M45 5 L45 8"/>
          <path d="M50 5 L50 10"/>
        </svg>
      </div>

      {/* Phi Symbol */}
      <div 
        className="scribble-element animate-drift text-3xl font-thin"
        style={{ 
          bottom: '70%', 
          right: '45%',
          animationDelay: '6.9s',
          color: '#991b1b'
        }}
      >
        φ
      </div>

      {/* Protractor */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          top: '78%', 
          right: '80%',
          animationDelay: '4.4s',
          color: '#7e22ce'
        }}
      >
        <svg width="40" height="25" viewBox="0 0 40 25" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 20 A15 15 0 0 1 35 20"/>
          <path d="M20 20 L20 5"/>
          <path d="M10 18 L12 16"/>
          <path d="M30 18 L28 16"/>
          <path d="M15 15 L16 13"/>
          <path d="M25 15 L24 13"/>
        </svg>
      </div>

      {/* Chemical Formula */}
      <div 
        className="scribble-element animate-slow-drift text-sm"
        style={{ 
          top: '95%', 
          left: '30%',
          animationDelay: '2.1s',
          color: '#065f46',
          transform: 'rotate(-5deg)'
        }}
      >
        H₂O + CO₂
      </div>

      {/* Battery */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          bottom: '95%', 
          right: '55%',
          animationDelay: '8.3s',
          color: '#0369a1'
        }}
      >
        <svg width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="20" height="8"/>
          <rect x="23" y="8" width="4" height="4"/>
          <path d="M6 9 L6 11"/>
          <path d="M9 9 L9 11"/>
        </svg>
      </div>

      {/* Gamma Symbol */}
      <div 
        className="scribble-element animate-fade-pulse text-2xl"
        style={{ 
          top: '42%', 
          left: '92%',
          animationDelay: '7.1s',
          color: '#be123c'
        }}
      >
        γ
      </div>

      {/* Infinity Symbol (smaller) */}
      <div 
        className="scribble-element animate-slow-drift text-lg"
        style={{ 
          bottom: '52%', 
          left: '88%',
          animationDelay: '5.3s',
          color: '#16a34a'
        }}
      >
        ∞
      </div>

      {/* Prism */}
      <div 
        className="scribble-element animate-drift"
        style={{ 
          top: '68%', 
          left: '65%',
          animationDelay: '1.9s',
          color: '#7c2d12'
        }}
      >
        <svg width="35" height="25" viewBox="0 0 35 25" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5,20 17.5,5 30,20"/>
          <path d="M17.5 5 L17.5 20"/>
        </svg>
      </div>

      {/* Beta Symbol */}
      <div 
        className="scribble-element animate-fade-pulse text-2xl"
        style={{ 
          bottom: '8%', 
          left: '20%',
          animationDelay: '9.4s',
          color: '#581c87'
        }}
      >
        β
      </div>

      {/* Hexagon */}
      <div 
        className="scribble-element animate-slow-drift"
        style={{ 
          top: '82%', 
          left: '50%',
          animationDelay: '3.8s',
          color: '#ca8a04'
        }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="15,3 24,8 24,22 15,27 6,22 6,8"/>
        </svg>
      </div>

      {/* Plus/Minus */}
      <div 
        className="scribble-element animate-drift text-xl"
        style={{ 
          top: '3%', 
          right: '2%',
          animationDelay: '6.7s',
          color: '#374151'
        }}
      >
        ± ÷ ×
      </div>

      {/* Spring/Coil */}
      <div 
        className="scribble-element animate-fade-pulse"
        style={{ 
          bottom: '85%', 
          left: '80%',
          animationDelay: '4.7s',
          color: '#dc2626'
        }}
      >
        <svg width="20" height="40" viewBox="0 0 20 40" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 5 Q15 8 10 12 Q5 15 10 18 Q15 22 10 25 Q5 28 10 32 Q15 35 10 38"/>
        </svg>
      </div>
    </div>
  )
}
