import React, { useEffect, useRef, useState } from 'react';
import { createKingdomWorld } from './createKingdomWorld';
import { sound } from './audio';

export function WebARCameraView({ chapter, onChapterChange, onExit, onOpenMarkerModal }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetFound, setTargetFound] = useState(false);
  const [muted, setMuted] = useState(false);
  const mindarRef = useRef(null);
  const worldRef = useRef(null);

  // Chapter content in English & Sinhala
  const chapterData = {
    1: {
      title: "The Ancient Gate",
      sinhalaTitle: "පුරාණ දොරටුව",
      desc: "Point your camera at the book marker. The sacred gate awakens, revealing the lost path beyond the realm of mortals.",
      dialogue: "“Traveller of realms... the seal of ages is finally broken. Step forward into the forgotten citadel.”",
      speaker: "Guardian Elira"
    },
    2: {
      title: "The Mystic Guardian",
      sinhalaTitle: "රහස් භාරකරු",
      desc: "The glowing runic stones hum with eternal energy. The guardian channels the power of the crystal beacon.",
      dialogue: "“Listen closely to the whispers in the wind. The kingdom's core still beats beneath the ruins.”",
      speaker: "Elira"
    },
    3: {
      title: "The Floating Citadel",
      sinhalaTitle: "පාවෙන මාලිගය",
      desc: "Towering spires rise above misty valleys. The floating citadels protect the secret of forgotten kings.",
      dialogue: "“Behold! The towers of eternity defy gravity and time itself. The true quest has only begun.”",
      speaker: "Ancient Oracle"
    },
    4: {
      title: "The Final Truth",
      sinhalaTitle: "සදාකාලික රහස",
      desc: "All four elemental runes converge. The lost kingdom's memory is restored to your reality.",
      dialogue: "“You have revived what was lost for centuries. The story now lives within your world.”",
      speaker: "Elira"
    }
  };

  const currentChapter = chapterData[chapter] || chapterData[1];

  useEffect(() => {
    let isCancelled = false;
    let mindarThree = null;

    async function startAR() {
      try {
        setLoading(true);
        setError(null);

        // 1. Check Camera Media Devices
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Your browser does not support camera access (getUserMedia). Please open in Chrome or Safari with HTTPS/localhost.");
        }

        // 2. Poll for window.MINDAR.IMAGE.MindARThree
        let MindARThreeClass = null;
        for (let i = 0; i < 40; i++) {
          if (window.MINDAR && window.MINDAR.IMAGE && window.MINDAR.IMAGE.MindARThree) {
            MindARThreeClass = window.MINDAR.IMAGE.MindARThree;
            break;
          }
          await new Promise(r => setTimeout(r, 100));
        }

        if (!MindARThreeClass) {
          throw new Error("MindAR WebAR library could not be loaded. Please refresh the page.");
        }

        if (isCancelled || !containerRef.current) return;

        // 3. Initialize MindAR Three
        mindarThree = new MindARThreeClass({
          container: containerRef.current,
          imageTargetSrc: '/targets/card.mind',
          filterMinCF: 0.0001,
          filterBeta: 0.001,
          warmupTolerance: 3,
          missTolerance: 5
        });

        const { renderer, scene, camera } = mindarThree;

        // 4. Build Kingdom 3D Pop-Up World
        const world = createKingdomWorld();
        worldRef.current = world;
        world.setChapterTheme(chapter);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(world.group);

        // 5. Target Detection Listeners
        anchor.onTargetFound = () => {
          if (isCancelled) return;
          setTargetFound(true);
          world.setVisible(true);
          sound.playTargetFound();
          sound.speakNarration(`${currentChapter.speaker} says: ${currentChapter.dialogue}`);
        };

        anchor.onTargetLost = () => {
          if (isCancelled) return;
          setTargetFound(false);
          world.setVisible(false);
        };

        // 6. Start Camera Stream & AR Engine
        await mindarThree.start();

        if (isCancelled) {
          mindarThree.stop();
          return;
        }

        mindarRef.current = mindarThree;
        setLoading(false);

        // 7. Render Loop
        renderer.setAnimationLoop(() => {
          world.update();
          renderer.render(scene, camera);
        });
      } catch (err) {
        console.error("WebAR Start Error:", err);
        if (!isCancelled) {
          setError(err.message || "Camera access was denied or device camera is busy.");
          setLoading(false);
        }
      }
    }

    startAR();

    return () => {
      isCancelled = true;
      sound.stopNarration();
      if (mindarRef.current) {
        try {
          const { renderer } = mindarRef.current;
          if (renderer) renderer.setAnimationLoop(null);
          mindarRef.current.stop();
        } catch (e) {
          console.warn("AR cleanup notice:", e);
        }
      }
    };
  }, []);

  // When chapter changes, update 3D world colors and play narration
  useEffect(() => {
    if (worldRef.current) {
      worldRef.current.setChapterTheme(chapter);
    }
    if (targetFound) {
      sound.playChapterChange();
      sound.speakNarration(`${currentChapter.speaker} says: ${currentChapter.dialogue}`);
    }
  }, [chapter, targetFound]);

  const handleMuteToggle = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
  };

  const handleSpeakDialogue = () => {
    sound.speakNarration(`${currentChapter.speaker} says: ${currentChapter.dialogue}`);
  };

  return (
    <div className="webar-container">
      {/* MindAR Camera & 3D Canvas Mount Point */}
      <div ref={containerRef} className="ar-video-viewport" />

      {/* Loading Overlay */}
      {loading && !error && (
        <div className="ar-status-card">
          <div className="spinner" />
          <h3>INITIALIZING AR CAMERA...</h3>
          <p>කරුණාකර Browser එකෙන් Camera Permission Allow කරන්න.</p>
        </div>
      )}

      {/* Error Fallback */}
      {error && (
        <div className="ar-status-card error-card">
          <div className="error-icon">⚠️</div>
          <h3>Camera / AR Notice</h3>
          <p>{error}</p>
          <p className="small-text" style={{ marginTop: '0.6rem', color: '#cbd5e0' }}>
            Browser එකේ Camera icon එක click කර Allow permission ලබා දෙන්න හෝ 3D Mode එකෙන් explore කරන්න.
          </p>
          <div className="btn-group">
            <button className="primary" onClick={onExit}>SWITCH TO 3D MODE</button>
            <button className="ghost" onClick={() => window.location.reload()}>RETRY CAMERA</button>
          </div>
        </div>
      )}

      {/* Main AR UI Overlay */}
      {!loading && !error && (
        <>
          {/* Top Bar Navigation */}
          <div className="ar-topbar">
            <div className="brand-badge">
              <span className="dot live" /> WEBAR MODE
            </div>
            <div className="marker-helper-btn" onClick={onOpenMarkerModal}>
              <span className="icon">📷</span> VIEW BOOK MARKER
            </div>
            <div className="topbar-actions">
              <button className="icon-btn" onClick={handleMuteToggle} title="Mute/Unmute Audio">
                {muted ? '🔇' : '🔊'}
              </button>
              <button className="ghost-btn" onClick={onExit}>EXIT AR</button>
            </div>
          </div>

          {/* Target Tracking Scanning Guide */}
          <div className={`scan-guide ${targetFound ? 'detected' : 'searching'}`}>
            <div className="reticle-box">
              <div className="corner tl" />
              <div className="corner tr" />
              <div className="corner bl" />
              <div className="corner br" />
              <div className="scan-line" />
            </div>
            <div className="scan-pill">
              {targetFound ? (
                <span className="pill-found">✦ 3D STORY POP-UP ACTIVE</span>
              ) : (
                <span className="pill-search">🔍 POINT CAMERA AT BOOK COVER / TARGET IMAGE</span>
              )}
            </div>
          </div>

          {/* Bottom Interactive Story HUD */}
          <div className="ar-hud-panel">
            <div className="chapter-selector">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`chap-tab ${chapter === num ? 'active' : ''}`}
                  onClick={() => {
                    sound.playClick();
                    onChapterChange(num);
                  }}
                >
                  <span className="chap-num">CH 0{num}</span>
                  <span className="chap-title">{chapterData[num].title}</span>
                </button>
              ))}
            </div>

            <div className="story-dialogue-box">
              <div className="speaker-row">
                <div className="avatar-orb">✦</div>
                <div className="speaker-info">
                  <strong>{currentChapter.speaker}</strong>
                  <span className="sinhala-sub">{currentChapter.sinhalaTitle}</span>
                </div>
                <button className="voice-narrate-btn" onClick={handleSpeakDialogue} title="Read Aloud">
                  🔊 Listen
                </button>
              </div>
              <p className="dialogue-text">{currentChapter.dialogue}</p>
              <p className="desc-text">{currentChapter.desc}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
