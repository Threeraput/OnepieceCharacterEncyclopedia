import React from 'react';
import { Skull, Heart } from 'lucide-react';
import type { CategoryFilter } from '../types/character';

interface HeaderProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  savedCount,
}) => {
  return (
    <header className="site-header">
      <div 
        className="brand" 
        onClick={() => onSelectCategory('characters')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelectCategory('characters'); }}
      >
        <Skull className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-name">
            ONE PIECE<span className="text-primary">.</span>
          </div>
          <div className="brand-sub">CHARACTER ENCYCLOPEDIA</div>
        </div>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        <button
          type="button"
          className={`nav-item ${activeCategory === 'characters' ? 'active' : ''}`}
          onClick={() => onSelectCategory('characters')}
        >
          Characters
        </button>

        <button
          type="button"
          className={`nav-item ${activeCategory === 'bounties' ? 'active' : ''}`}
          onClick={() => onSelectCategory('bounties')}
        >
          Bounties
        </button>

        <button
          type="button"
          className={`nav-item ${activeCategory === 'saved' ? 'active' : ''}`}
          onClick={() => onSelectCategory('saved')}
        >
          <Heart size={14} fill={savedCount > 0 ? 'currentColor' : 'none'} />
          Saved
          {savedCount > 0 && <span className="nav-badge">{savedCount}</span>}
        </button>
      </nav>

      <div className="header-caption">
        <span className="status-dot" />
        THE GRAND LINE ARCHIVES
      </div>
    </header>
  );
};

