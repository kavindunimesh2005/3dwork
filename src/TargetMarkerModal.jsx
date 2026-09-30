import React from 'react';

export function TargetMarkerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>📖 AR BOOK TARGET MARKER</h3>
            <span className="sinhala-sub">ස්කෑන් කළ යුතු පොතේ පින්තූරය / Marker Card එක</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            Phone Camera එක මෙම Marker Image එක දෙසට එල්ල කරන්න. 3D කතාව සහ Castle එක මෙම පින්තූරය උඩින් Augmented Reality (WebAR) ආකාරයට දිස්වනු ඇත!
          </p>

          <div className="marker-image-card">
            <img src="/targets/card.png" alt="AR Book Page Target Marker" />
            <div className="marker-badge">TARGET MARKER #01</div>
          </div>

          <div className="instruction-steps">
            <div className="step-item">
              <span className="step-num">1</span>
              <span>මෙම පින්තූරය වෙනත් Screen එකකින් (Laptop / Phone) විවෘත කරගන්න හෝ Print කරගන්න.</span>
            </div>
            <div className="step-item">
              <span className="step-num">2</span>
              <span>ඔබගේ Phone Camera එකෙන් මෙම පින්තූරය කෙළින්ම ස්කෑන් කරන්න.</span>
            </div>
            <div className="step-item">
              <span className="step-num">3</span>
              <span>පින්තූරය හඳුනාගත් සැනින් 3D Pop-Up Story එක සජීවීව ක්‍රියාත්මක වේ.</span>
            </div>
          </div>

          <div className="modal-actions">
            <a href="/targets/card.png" download="ar-book-marker.png" className="secondary-btn">
              ⬇ Download Marker Image
            </a>
            <button className="primary" onClick={onClose}>
              GOT IT / BACK TO CAMERA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
