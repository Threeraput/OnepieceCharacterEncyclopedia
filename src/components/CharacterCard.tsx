import React, { useState } from 'react';
import { Heart, Skull } from 'lucide-react';
import type { Character } from '../types/character';
import { formatBounty, getActiveBounty, getBountyLabel } from '../services/onePieceApi';

interface CharacterCardProps {
  character: Character;
  rankNumber: string;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelect: (character: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  rankNumber,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);
  const activeBounty = getActiveBounty(character);
  const bountyLabel = getBountyLabel(character);
  const statusLower = (character.status || 'unknown').toLowerCase();

  return (
    <article className="character-card">
      <button
        type="button"
        className="portrait-button"
        aria-label={`View ${character.name.en}`}
        onClick={() => onSelect(character)}
      >
        {!imgError && character.image_url ? (
          <img
            src={character.image_url}
            alt={character.name.en}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="portrait-fallback">
            <Skull />
            <span>{character.name.en}</span>
          </div>
        )}
        <span className="character-number">{rankNumber}</span>
      </button>

      <button
        type="button"
        className={`save-button ${isSaved ? 'saved' : ''}`}
        aria-label={isSaved ? 'Remove from saved' : 'Save character'}
        onClick={(e) => onToggleSave(character.id, e)}
        title={isSaved ? 'Saved to collection' : 'Save character'}
      >
        <Heart size={15} fill={isSaved ? 'currentColor' : 'none'} />
      </button>

      <div className="card-info">
        <button
          type="button"
          className="character-name"
          onClick={() => onSelect(character)}
        >
          {character.name.en}
        </button>

        <div className="jp-name">
          {character.name.jp || character.name.romaji || '—'}
        </div>

        <div className="card-stats">
          <div>
            <div className="bounty-label">{bountyLabel}</div>
            <div className="bounty-value">{formatBounty(activeBounty)}</div>
          </div>

          <span className={`alive-tag ${statusLower === 'deceased' ? 'deceased' : statusLower === 'unknown' ? 'unknown' : ''}`}>
            <span className="status-dot" />
            {character.status || 'Unknown'}
          </span>
        </div>
      </div>
    </article>
  );
};

