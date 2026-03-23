import React, { useState } from 'react';
import { Code2, Palette, Layout, Database } from 'lucide-react';

const CREATORS = [
  { name: 'Atharva Pawar', role: 'Lead Full-Stack', initials: 'AP', icon: Code2, animName: 'code-3d-flip', animDuration: '6s', color: 'var(--bg-primary)', bg: 'linear-gradient(135deg, #433A00 0%, #211C00 100%)', link: 'https://www.linkedin.com/in/atharva-pawar02/' },
  { name: 'Rajasvi Harane', role: 'UI/UX Designer', initials: 'RH', icon: Palette, animName: 'palette-3d-sway', animDuration: '7s', color: '#F5EFC6', bg: 'linear-gradient(135deg, #8B7A00 0%, #574C00 100%)', link: 'https://www.linkedin.com/in/rajasvi-harane-ba3b012bb/' },
  { name: 'Shivani Kan', role: 'Frontend Dev', initials: 'SK', icon: Layout, animName: 'layout-3d-iso', animDuration: '5s', color: '#ECE4B5', bg: 'linear-gradient(135deg, #2C2818 0%, #17150C 100%)', link: 'https://www.linkedin.com/in/shivani-kanshetti-a02972346/' },
  { name: 'Srushti Patil', role: 'Database Arch', initials: 'SP', icon: Database, animName: 'db-3d-spin', animDuration: '8s', color: '#FDF9DB', bg: 'linear-gradient(135deg, #3A422D 0%, #1D2116 100%)', link: 'https://www.linkedin.com/in/srushti-patil-942169308/' },
];

export const CreatorGallery = () => {
    const [hoveredIndex, setHoveredIndex] = useState(0);

    return (
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '1000px', height: '450px', margin: '0 auto', padding: '1rem' }}>
            {CREATORS.map((creator, i) => {
                const isActive = hoveredIndex === i;
                
                return (
                    <div 
                        key={i}
                        onMouseEnter={() => setHoveredIndex(i)}
                        style={{
                            flex: isActive ? '4' : '1',
                            position: 'relative',
                            borderRadius: '24px',
                            background: creator.bg,
                            overflow: 'hidden',
                            transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                            cursor: 'pointer',
                            boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.2)' : '0 4px 10px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: isActive ? '2.5rem' : '1.5rem',
                        }}
                    >
                        {/* Huge Watermark Icon */}
                        <div style={{
                            position: 'absolute',
                            top: isActive ? '-5%' : '20%',
                            right: isActive ? '-5%' : '30%',
                            transform: isActive ? 'rotate(-15deg)' : 'translateX(50%) rotate(15deg)',
                            color: 'white',
                            opacity: isActive ? 0.2 : 0,
                            transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                            pointerEvents: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <creator.icon 
                                size={isActive ? 280 : 80} 
                                strokeWidth={1} 
                                style={{ 
                                    animation: isActive ? `${creator.animName} ${creator.animDuration} infinite ease-in-out` : 'none',
                                    willChange: 'transform, filter'
                                }} 
                            />
                        </div>

                        {/* Content Overlay */}
                        <div style={{
                            position: 'relative',
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: isActive ? 'row' : 'column',
                            alignItems: isActive ? 'flex-end' : 'center',
                            justifyContent: isActive ? 'space-between' : 'flex-end',
                            height: '100%',
                            gap: '1rem'
                        }}>
                            
                            {/* Text Info */}
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: isActive ? 'flex-start' : 'center',
                                transition: 'all 0.6s',
                                transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                            }}>
                                <div style={{
                                    width: isActive ? '56px' : '48px',
                                    height: isActive ? '56px' : '48px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: isActive ? '1.25rem' : '1rem', fontWeight: 700,
                                    marginBottom: isActive ? '1rem' : '1.5rem',
                                    transition: 'all 0.6s',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }}>
                                    {creator.initials}
                                </div>
                                
                                <div style={{ overflow: 'hidden' }}>
                                    <h3 style={{ 
                                        color: '#fff', 
                                        fontSize: '1.75rem', 
                                        fontWeight: 800, 
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                        opacity: isActive ? 1 : 0,
                                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'all 0.4s ease 0.1s'
                                    }}>
                                        {creator.name}
                                    </h3>
                                </div>
                                
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ 
                                        color: 'rgba(255,255,255,0.8)', 
                                        fontSize: '0.9rem', 
                                        fontWeight: 600, 
                                        margin: '0.25rem 0 0 0',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px',
                                        opacity: isActive ? 1 : 0,
                                        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                                        transition: 'all 0.4s ease 0.15s',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {creator.role}
                                    </p>
                                </div>
                            </div>

                            {/* View Button */}
                            <a 
                                href={creator.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    width: '56px', height: '56px',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: creator.color,
                                    opacity: isActive ? 1 : 0,
                                    transform: isActive ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-45deg)',
                                    transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.25s',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </a>
                            
                        </div>
                    </div>
                );
            })}

            <style>{`
                @keyframes code-3d-flip {
                    0% { transform: perspective(800px) rotateY(0deg) translateZ(0); filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
                    50% { transform: perspective(800px) rotateY(180deg) translateZ(50px); filter: drop-shadow(0 0 40px rgba(255,255,255,0.6)); }
                    100% { transform: perspective(800px) rotateY(360deg) translateZ(0); filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
                }
                @keyframes palette-3d-sway {
                    0% { transform: perspective(800px) rotateX(-20deg) rotateY(-30deg) rotateZ(-10deg) translateZ(0); filter: drop-shadow(-10px 10px 15px rgba(255,255,255,0.2)); }
                    50% { transform: perspective(800px) rotateX(30deg) rotateY(30deg) rotateZ(15deg) translateZ(60px); filter: drop-shadow(20px 20px 30px rgba(255,255,255,0.5)); }
                    100% { transform: perspective(800px) rotateX(-20deg) rotateY(-30deg) rotateZ(-10deg) translateZ(0); filter: drop-shadow(-10px 10px 15px rgba(255,255,255,0.2)); }
                }
                @keyframes layout-3d-iso {
                    0% { transform: perspective(800px) rotateX(60deg) rotateY(0deg) rotateZ(45deg) translateZ(0); filter: drop-shadow(0px 0px 5px rgba(255,255,255,0.1)); }
                    50% { transform: perspective(800px) rotateX(60deg) rotateY(0deg) rotateZ(45deg) translateZ(80px); filter: drop-shadow(-30px 40px 25px rgba(255,255,255,0.5)); }
                    100% { transform: perspective(800px) rotateX(60deg) rotateY(0deg) rotateZ(45deg) translateZ(0); filter: drop-shadow(0px 0px 5px rgba(255,255,255,0.1)); }
                }
                @keyframes db-3d-spin {
                    0% { transform: perspective(800px) rotateX(20deg) rotateY(0deg) translateZ(0); filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
                    50% { transform: perspective(800px) rotateX(45deg) rotateY(180deg) translateZ(60px); filter: drop-shadow(0 40px 30px rgba(255,255,255,0.6)); }
                    100% { transform: perspective(800px) rotateX(20deg) rotateY(360deg) translateZ(0); filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
                }
            `}</style>
        </div>
    );
};
