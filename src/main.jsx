import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Environment } from '@react-three/drei';
import { QRCodeSVG } from 'qrcode.react';
import './styles.css';

function Castle() {
  const towers = [
    [-3.2, 1.3, -1.4, 0.85],
    [3.2, 1.3, -1.4, 0.85],
    [-1.7, 1.0, -0.4, 0.7],
    [1.7, 1.0, -0.4, 0.7],
  ];
  return (
    <group>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[4.5, 1.7, 2.4]} />
        <meshStandardMaterial color="#5c647e" roughness={0.75} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[2.2, 1.2, 1.9]} />
        <meshStandardMaterial color="#69738f" roughness={0.7} />
      </mesh>
      {towers.map(([x,y,z,s], i) => (
        <group key={i} position={[x,y,z]}>
          <mesh>
            <cylinderGeometry args={[s, s, 2.7, 20]} />
            <meshStandardMaterial color="#77809a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <coneGeometry args={[s * 1.25, 1.8, 20]} />
            <meshStandardMaterial color="#28334f" roughness={0.55} metalness={0.15} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.8, -1.23]}>
        <boxGeometry args={[0.85, 1.45, 0.08]} />
        <meshStandardMaterial color="#161a28" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[7.8, 0.18, 5.8]} />
        <meshStandardMaterial color="#28331f" roughness={1} />
      </mesh>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.3}>
        <Text position={[0, 3.6, 0]} fontSize={0.42} color="#e9d9a8" anchorX="center">
          THE LOST KINGDOM
        </Text>
      </Float>
    </group>
  );
}

function StoryScene() {
  return (
    <Canvas camera={{ position: [9, 6, 10], fov: 45 }}>
      <color attach="background" args={['#050711']} />
      <fog attach="fog" args={['#050711', 12, 28]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 10, 6]} intensity={3.2} />
      <pointLight position={[0, 3, 2]} intensity={20} distance={12} color="#b89cff" />
      <Stars radius={80} depth={40} count={2500} factor={2} saturation={0} fade speed={0.4} />
      <Castle />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={18} />
      <Environment preset="night" />
    </Canvas>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [chapter, setChapter] = useState(1);
  const [ar, setAr] = useState(false);
  const storyUrl = useMemo(() => window.location.href, []);

  if (!started) {
    return (
      <main className="landing">
        <div className="grain" />
        <div className="landing-content">
          <div className="eyebrow">QR DIGITAL STORY EXPERIENCE</div>
          <h1>The Lost<br /><span>Kingdom</span></h1>
          <p className="tagline">A journey beyond time.</p>
          <p className="intro">Scan. Explore. Experience a story that becomes a living 3D world.</p>
          <button className="primary" onClick={() => setStarted(true)}>BEGIN JOURNEY <span>→</span></button>
          <div className="qr-card">
            <QRCodeSVG value={storyUrl} size={104} bgColor="#ffffff" fgColor="#080a12" includeMargin />
            <div>
              <small>TRY THE QR FLOW</small>
              <strong>Scan this code on your phone</strong>
              <span>Opens the same digital story.</span>
            </div>
          </div>
        </div>
        <div className="landing-orb orb1" />
        <div className="landing-orb orb2" />
      </main>
    );
  }

  return (
    <main className="story">
      <header className="topbar">
        <div className="brand">THE LOST KINGDOM</div>
        <div className="chapter-label">CHAPTER {chapter} / 4</div>
        <button className="ghost" onClick={() => setAr(!ar)}>{ar ? 'EXIT AR' : 'AR MODE'}</button>
      </header>

      <section className="scene">
        <StoryScene />
        <div className="hud">
          <div className="hud-copy">
            <div className="eyebrow">CHAPTER {chapter}</div>
            <h2>{chapter === 1 ? 'The Forgotten Path' : chapter === 2 ? 'The Hidden Village' : chapter === 3 ? 'The Lost Kingdom' : 'The Final Truth'}</h2>
            <p>
              {chapter === 1
                ? 'A forgotten road leads you toward a kingdom hidden beyond the mountains.'
                : 'The world changes as you move deeper into the story. This is where the interactive chapters begin.'}
            </p>
            <div className="character">
              <div className="avatar">E</div>
              <div><strong>Elira</strong><span>“Welcome, traveller. Your journey begins here.”</span></div>
            </div>
          </div>

          <div className="controls">
            {[1,2,3,4].map(n => (
              <button key={n} className={chapter === n ? 'active' : ''} onClick={() => setChapter(n)}>
                <span>0{n}</span>
                {['The Forgotten Path','The Hidden Village','The Lost Kingdom','The Final Truth'][n-1]}
              </button>
            ))}
          </div>
        </div>

        {ar && (
          <div className="ar-overlay">
            <div className="ar-card">
              <div className="ar-icon">✦</div>
              <h3>AR MODE</h3>
              <p>This prototype reserves the camera/AR layer. On a compatible mobile browser, the 3D story object can be placed into your real environment.</p>
              <button className="primary" onClick={() => setAr(false)}>RETURN TO STORY</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
