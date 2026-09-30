import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QRCodeSVG } from 'qrcode.react';
import { WebARCameraView } from './WebARCameraView';
import { InteractiveCanvasView } from './InteractiveCanvasView';
import { TargetMarkerModal } from './TargetMarkerModal';
import { sound } from './audio';
import './styles.css';

const chapters = [
  {
    id: 1,
    title: 'The Ancient Gate',
    sinhala: 'පුරාණ දොරටුව',
    tagline: 'The portal to the lost world opens.',
    speaker: 'Guardian Elira',
    dialogue: '“Traveller of realms... the seal of ages is finally broken. Step forward into the forgotten citadel.”',
    story: 'Deep in the mists of time, an ancient stone portal stands untouched. When scanned with the sacred vision, the ruins of the lost kingdom awaken to reality.'
  },
  {
    id: 2,
    title: 'The Mystic Guardian',
    sinhala: 'රහස් භාරකරු',
    tagline: 'Ancient magic pulses through the spires.',
    speaker: 'Guardian Elira',
    dialogue: '“Listen closely to the whispers in the wind. The kingdom’s core still beats beneath the ruins.”',
    story: 'The guardian spirit Elira appears on the citadel pathway. Her glowing staff channels mystical energy from the levitating octahedron crystal.'
  },
  {
    id: 3,
    title: 'The Floating Citadel',
    sinhala: 'පාවෙන මාලිගය',
    tagline: 'Towers suspended between earth and sky.',
    speaker: 'Ancient Oracle',
    dialogue: '“Behold! The towers of eternity defy gravity and time itself. The true quest has only begun.”',
    story: 'Surrounded by ancient pine groves and swirling firefly wisps, the high citadel floats above the realm, guarding relics of lost civilization.'
  },
  {
    id: 4,
    title: 'The Final Truth',
    sinhala: 'සදාකාලික රහස',
    tagline: 'The kingdom lives once more in our world.',
    speaker: 'Guardian Elira',
    dialogue: '“You have revived what was lost for centuries. The story now lives within your world.”',
    story: 'As all four runic seals align, the kingdom’s eternal light returns. The physical book and digital world have merged into one living story.'
  }
];

function App() {
  const [mode, setMode] = useState('landing'); // 'landing' | 'ar' | '3d'
  const [chapter, setChapter] = useState(1);
  const [isMarkerModalOpen, setIsMarkerModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const storyUrl = useMemo(() => window.location.href, []);

  const currentChapter = chapters.find(c => c.id === chapter) || chapters[0];

  const handleStartAR = () => {
    sound.init();
    sound.playClick();
    setMode('ar');
  };

  const handleStart3D = () => {
    sound.init();
    sound.playClick();
    setMode('3d');
  };

  const handleChapterSelect = (chapId) => {
    sound.playChapterChange();
    setChapter(chapId);
    if (mode === '3d') {
      const selected = chapters.find(c => c.id === chapId);
      if (selected) {
        sound.speakNarration(`${selected.speaker} says: ${selected.dialogue}`);
      }
    }
  };

  const handleMuteToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleSpeak = () => {
    sound.speakNarration(`${currentChapter.speaker} says: ${currentChapter.dialogue}`);
  };

  return (
    <div className="app-container">
      {/* 1. LANDING SCREEN */}
      {mode === 'landing' && (
        <main className="landing">
          <div className="ambient-background">
            <div className="glow-orb orb-1" />
            <div className="glow-orb orb-2" />
            <div className="glow-orb orb-3" />
            <div className="grid-overlay" />
          </div>

          <div className="landing-content">
            <div className="badge">
              <span className="sparkle">✦</span> WEBAR DIGITAL 3D STORYBOOK
            </div>

            <h1 className="title">
              THE LOST <span className="highlight">KINGDOM</span>
            </h1>
            <h2 className="title-sinhala">අතුරුදහන් වූ රාජධානිය — 3D WebAR අත්දැකීම</h2>

            <p className="description">
              කැමරාව පොතේ පින්තූරය දෙසට එල්ල කරන්න. 3D කතාව, මාලිගය සහ චරිත පොත උඩින් සජීවීව මතුවන Augmented Reality (WebAR) තාක්ෂණය අත්විඳින්න.
            </p>

            <div className="action-row">
              <button className="primary-btn pulse" onClick={handleStartAR}>
                <span className="btn-icon">📷</span> START WEBAR CAMERA
              </button>
              <button className="secondary-btn" onClick={handleStart3D}>
                <span className="btn-icon">🪐</span> EXPLORE 3D MODE
              </button>
              <button className="ghost-btn" onClick={() => setIsMarkerModalOpen(true)}>
                <span className="btn-icon">📖</span> VIEW BOOK MARKER
              </button>
            </div>

            {/* Mobile Scan Card */}
            <div className="qr-container-card">
              <div className="qr-box">
                <QRCodeSVG
                  value={storyUrl}
                  size={110}
                  bgColor="#ffffff"
                  fgColor="#090d1a"
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="qr-info">
                <div className="qr-badge">MOBILE READY</div>
                <h4>Scan to open on your Phone</h4>
                <p>Scan with your phone camera to experience WebAR image tracking directly on your mobile browser.</p>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="feature-pills">
              <div className="pill">✨ No App Download Needed</div>
              <div className="pill">📱 WebAR Image Tracking</div>
              <div className="pill">🏰 3D Pop-Up Animated Castle</div>
              <div className="pill">🔊 Voice Narration & Audio</div>
            </div>
          </div>
        </main>
      )}

      {/* 2. WEBAR CAMERA IMAGE TRACKING MODE */}
      {mode === 'ar' && (
        <WebARCameraView
          chapter={chapter}
          onChapterChange={handleChapterSelect}
          onExit={() => {
            sound.stopNarration();
            setMode('landing');
          }}
          onOpenMarkerModal={() => setIsMarkerModalOpen(true)}
        />
      )}

      {/* 3. INTERACTIVE 3D EXPLORATION MODE */}
      {mode === '3d' && (
        <main className="story-3d-layout">
          {/* Header */}
          <header className="story-topbar">
            <div className="topbar-left">
              <span className="brand-icon">✦</span>
              <strong className="brand-name">THE LOST KINGDOM</strong>
              <span className="badge-3d">3D MODE</span>
            </div>
            <div className="topbar-center">
              <span className="chapter-indicator">
                CHAPTER 0{chapter}: {currentChapter.title} ({currentChapter.sinhala})
              </span>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" onClick={handleMuteToggle} title="Sound Toggle">
                {isMuted ? '🔇' : '🔊'}
              </button>
              <button className="primary-sm-btn" onClick={handleStartAR}>
                📷 SWITCH TO AR
              </button>
              <button className="ghost-btn" onClick={() => setMode('landing')}>
                EXIT
              </button>
            </div>
          </header>

          {/* 3D Canvas Scene */}
          <section className="story-viewport-container">
            <InteractiveCanvasView chapter={chapter} />

            {/* Interactive Story HUD */}
            <div className="story-hud-overlay">
              {/* Dialogue Box */}
              <div className="dialogue-card">
                <div className="dialogue-header">
                  <div className="speaker-avatar">✦</div>
                  <div>
                    <strong className="speaker-name">{currentChapter.speaker}</strong>
                    <span className="speaker-sub">{currentChapter.tagline}</span>
                  </div>
                  <button className="voice-btn" onClick={handleSpeak} title="Play Voice Narration">
                    🔊 Narrate
                  </button>
                </div>
                <p className="dialogue-quote">{currentChapter.dialogue}</p>
                <p className="dialogue-desc">{currentChapter.story}</p>
              </div>

              {/* Chapter Navigation Tabs */}
              <div className="chapter-nav-grid">
                {chapters.map((chap) => (
                  <button
                    key={chap.id}
                    className={`chap-card-btn ${chapter === chap.id ? 'active' : ''}`}
                    onClick={() => handleChapterSelect(chap.id)}
                  >
                    <div className="chap-num-badge">0{chap.id}</div>
                    <div className="chap-text-col">
                      <span className="chap-name">{chap.title}</span>
                      <span className="chap-sinhala">{chap.sinhala}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Target Marker Modal */}
      <TargetMarkerModal
        isOpen={isMarkerModalOpen}
        onClose={() => setIsMarkerModalOpen(false)}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
