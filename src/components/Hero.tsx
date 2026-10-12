import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

interface HeroProps {
  totalCharacters: number;
  onExplore: () => void;
  onMeetLuffy: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalCharacters,
  onExplore,
  onMeetLuffy,
}) => {
  return (
    <section className="hero">
      <img
        src="/grand-line-banner.jpg"
        alt="Monkey D. Luffy against crimson geometric artwork"
        className="hero-art"
        loading="eager"
        onError={(e) => {
          // If local banner fails, fallback to remote
          const target = e.currentTarget;
          target.src = 'https://grand-line-codex.lovable.app/__l5e/assets-v1/7f1d98cf-2fe0-49ab-a13e-3f5cc04ac565/grand-line-banner.jpg';
        }}
      />

      <div className="hero-content">
        <div className="eyebrow">THE GRAND LINE AWAITS</div>
        <h1>
          CHARACTER<br />
          <span>ENCYCLOPEDIA</span>
        </h1>
        <p className="hero-description">
          The legends. The outlaws. The dreamers.<br />
          Meet the characters who make the world of<br />
          One Piece extraordinary.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="hero-cta primary"
            onClick={onExplore}
          >
            <BookOpen size={16} />
            Explore characters
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            className="hero-cta secondary"
            onClick={onMeetLuffy}
          >
            Meet Luffy
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="hero-footnote">
          {totalCharacters > 0 ? totalCharacters : 694} CHARACTERS &nbsp;/&nbsp; ONE ENDLESS ADVENTURE
        </div>
      </div>

      <div
        className="hero-index"
        onClick={onMeetLuffy}
        style={{ cursor: 'pointer' }}
        title="View Monkey D. Luffy"
      >
        <strong>MONKEY D. LUFFY</strong>
        THE STRAW HAT PIRATE &nbsp;/&nbsp; 001
      </div>
    </section>
  );
};

