import React, { useState } from 'react';

const TECH_STACK = [
    { id: 'react', name: 'React', description: 'Declarative UI Architecture', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
    { id: 'css3', name: 'Vanilla CSS3', description: 'Zero-Dependency Animations', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', color: '#1572B6' },
    { id: 'vite', name: 'Vite Engine', description: 'Lightning Fast Build System', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg', color: '#646CFF' },
    { id: 'firebase', name: 'Google Firebase', description: 'Real-time Datastore & Auth', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', color: '#FFCA28' },
    { id: 'antigravity', name: 'Antigravity AI', description: 'Intelligent Orchestration Core', icon: '/antigravity-logo.png', color: '#8A2BE2' }
];

export const TechShowcase = () => {
    const [hoveredTech, setHoveredTech] = useState(TECH_STACK[2].id); // Default hover middle
    const activeTechObj = TECH_STACK.find(t => t.id === hoveredTech) || TECH_STACK[2];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%', maxWidth: '900px', margin: '0 auto', alignItems: 'center' }}>
            
            {/* Main Spotlight Interactive Display */}
            <div style={{ 
                width: '100%', height: '360px', 
                borderRadius: '32px', 
                background: 'var(--bg-secondary)', // Clean premium background 
                border: '1px solid rgba(255,255,255,0.4)', 
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02), 0 30px 60px rgba(0,0,0,0.08)',
                transition: 'background-color 0.8s ease'
            }}>
                
                {/* Advanced Dynamic Aurora Background */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    opacity: 0.6, mixBlendMode: 'normal',
                    transition: 'opacity 0.8s ease'
                }}>
                    <div style={{ 
                        position: 'absolute', top: '-30%', left: '-10%', width: '600px', height: '600px', 
                        background: `radial-gradient(circle, ${activeTechObj.color}80 0%, transparent 60%)`,
                        filter: 'blur(60px)', animation: 'float-orb-1 15s infinite alternate ease-in-out',
                        transition: 'background 1s ease'
                    }} />
                    <div style={{ 
                        position: 'absolute', bottom: '-20%', right: '-20%', width: '500px', height: '500px', 
                        background: `radial-gradient(circle, ${activeTechObj.color}60 0%, transparent 65%)`,
                        filter: 'blur(70px)', animation: 'float-orb-2 12s infinite alternate ease-in-out',
                        transition: 'background 1s ease 0.2s'
                    }} />
                </div>

                {/* Decorative Glass Overlay */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(20px)'
                }} />

                {TECH_STACK.map((tech) => {
                    const isActive = hoveredTech === tech.id;
                    return (
                        <div 
                            key={`display-${tech.id}`}
                            style={{
                                position: 'absolute', inset: 0, zIndex: isActive ? 5 : 2,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                opacity: isActive ? 1 : 0,
                                transform: isActive ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9) rotateX(-15deg)',
                                transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                                pointerEvents: 'none',
                                perspective: '1000px',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <img src={tech.icon} alt={tech.name} style={{ 
                                width: '120px', height: '120px', objectFit: 'contain', marginBottom: '1.5rem', 
                                filter: `drop-shadow(0 20px 40px ${tech.color}80)`,
                                animation: isActive ? 'levitate-3d 6s infinite ease-in-out' : 'none'
                            }} />

                            <h3 style={{ 
                                fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', 
                                color: 'var(--text-primary)',
                                textShadow: '0 4px 15px rgba(255,255,255,0.8)',
                                transform: 'translateZ(30px)' // Pops out from glass
                            }}>
                                {tech.name}
                            </h3>

                            <div style={{ 
                                background: 'rgba(255,255,255,0.6)',
                                padding: '0.4rem 1.25rem', borderRadius: '100px',
                                border: '1px solid rgba(255,255,255,0.8)',
                                transform: 'translateZ(20px)',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                            }}>
                                <p style={{ 
                                    fontSize: '0.875rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                                    color: 'var(--text-secondary)', margin: 0
                                }}>
                                    {tech.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Apple-style Magnetic Hover Dock */}
            <div style={{ 
                display: 'flex', gap: '0.5rem', 
                padding: '0.75rem', 
                background: 'rgba(255, 255, 255, 0.6)', 
                borderRadius: '100px', 
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                zIndex: 10
            }}>
                {TECH_STACK.map((tech) => {
                    const isActive = hoveredTech === tech.id;
                    return (
                        <div
                            key={`dock-${tech.id}`}
                            onMouseEnter={() => setHoveredTech(tech.id)}
                            style={{
                                width: isActive ? '80px' : '60px',
                                height: isActive ? '80px' : '60px',
                                borderRadius: '50%',
                                background: isActive ? 'var(--bg-primary)' : 'transparent',
                                border: `2px solid ${isActive ? tech.color : 'transparent'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                transform: isActive ? 'translateY(-15px)' : 'translateY(0)',
                                boxShadow: isActive ? `0 15px 30px ${tech.color}40` : 'none',
                                margin: isActive ? '0 10px' : '0',
                                position: 'relative'
                            }}
                        >
                            <img src={tech.icon} alt={tech.name} style={{ 
                                width: isActive ? '45px' : '30px', 
                                height: isActive ? '45px' : '30px', 
                                objectFit: 'contain',
                                filter: isActive ? 'grayscale(0)' : 'grayscale(1) opacity(0.5)',
                                transition: 'all 0.4s ease'
                            }} />

                            {/* MacOS Active Indicator Dot */}
                            {isActive && (
                                <div style={{
                                    position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)',
                                    width: '6px', height: '6px', borderRadius: '50%', background: tech.color,
                                    boxShadow: `0 0 10px ${tech.color}`
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes levitate-3d {
                    0% { transform: perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg); }
                    33% { transform: perspective(1000px) translateY(-20px) rotateX(15deg) rotateY(15deg); }
                    66% { transform: perspective(1000px) translateY(10px) rotateX(-10deg) rotateY(-15deg); }
                    100% { transform: perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg); }
                }
                @keyframes float-orb-1 {
                    0% { transform: translate(0, 0) scale(1) rotate(0deg); }
                    100% { transform: translate(30%, 20%) scale(1.3) rotate(45deg); }
                }
                @keyframes float-orb-2 {
                    0% { transform: translate(0, 0) scale(1) rotate(0deg); }
                    100% { transform: translate(-30%, -30%) scale(1.4) rotate(-45deg); }
                }
            `}</style>
        </div>
    );
};
