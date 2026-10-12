import React, { useEffect, useState } from 'react';
import { X, Heart, Share2, Check, Skull } from 'lucide-react';
import type { Character } from '../types/character';
import { formatBounty, getActiveBounty, getBountyLabel } from '../services/onePieceApi';

interface CharacterDetailModalProps {
  character: Character | null;
  rankNumber?: string;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  rankNumber,
  isSaved,
  onToggleSave,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!character) return null;

  const activeBounty = getActiveBounty(character);
  const bountyLabel = getBountyLabel(character);
  const statusLower = (character.status || 'unknown').toLowerCase();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${character.name.en} - One Piece Character Encyclopedia (${window.location.origin}/?q=${encodeURIComponent(character.name.en)})`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Sort bounties chronologically if multiple exist
  const sortedBounties = character.bounties && character.bounties.length > 0
    ? [...character.bounties].sort((a, b) => (a.amount || 0) - (b.amount || 0))
    : [];

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-detail-title"
    >
      <div className="detail-dialog">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="detail-layout">
          <div className="detail-image-box">
            {!imgError && character.image_url ? (
              <img
                src={character.image_url}
                alt={character.name.en}
                className="detail-image"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="portrait-fallback" style={{ height: '100%', minHeight: 400 }}>
                <Skull size={56} />
                <span>{character.name.en}</span>
              </div>
            )}
            {rankNumber && (
              <span className="character-number" style={{ top: 20, left: 20, fontSize: 12 }}>
                {rankNumber}
              </span>
            )}
          </div>

          <div className="detail-content">
            <div className="detail-header">
              {rankNumber && <div className="detail-number-badge">{rankNumber} / ARCHIVE</div>}
              <h2 id="character-detail-title" className="detail-title">
                {character.name.en}
              </h2>

              <div className="detail-jp-names">
                <span>{character.name.jp || '—'}</span>
                {character.name.romaji && <span>• {character.name.romaji}</span>}
                <span className={`alive-tag ${statusLower === 'deceased' ? 'deceased' : statusLower === 'unknown' ? 'unknown' : ''}`}>
                  <span className="status-dot" />
                  {character.status || 'Unknown'}
                </span>
              </div>
            </div>

            <dl className="detail-stats">
              <div>
                <dt>Status</dt>
                <dd>{character.status || 'Unknown'}</dd>
              </div>

              <div>
                <dt>Age</dt>
                <dd>{character.age ? `${character.age} years old` : 'Unknown'}</dd>
              </div>

              <div>
                <dt>Height</dt>
                <dd>{character.height ? `${character.height} cm` : 'Unknown'}</dd>
              </div>

              <div>
                <dt>Blood Type</dt>
                <dd>{character.blood_type || 'Unknown'}</dd>
              </div>

              <div>
                <dt>Birthday</dt>
                <dd>{character.birthday?.label?.en || character.birthday?.label?.jp || 'Unknown'}</dd>
              </div>

              {character.birthday?.trivia?.en && (
                <div className="birthday-trivia">
                  <strong>Birthday Trivia: </strong>
                  {character.birthday.trivia.en}
                </div>
              )}
            </dl>

            <div className="detail-bounty">
              <div className="detail-bounty-header">
                <span className="bounty-label">{bountyLabel}</span>
              </div>
              <strong>{formatBounty(activeBounty)}</strong>

              {sortedBounties.length > 1 && (
                <div className="bounty-history-section">
                  <div className="bounty-history-label">BOUNTY PROGRESSION</div>
                  <div className="bounty-history-pills">
                    {sortedBounties.map((b) => (
                      <span
                        key={b.id}
                        className={`bounty-pill ${b.is_active ? 'active' : ''}`}
                        title={b.is_active ? 'Current Bounty' : 'Previous Bounty'}
                      >
                        ฿ {(b.amount || 0).toLocaleString('en-US')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className={`modal-action-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => onToggleSave(character.id)}
              >
                <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved to Collection' : 'Save Character'}
              </button>

              <button
                type="button"
                className="modal-action-btn"
                onClick={handleShare}
              >
                {copied ? <Check size={16} color="#22c55e" /> : <Share2 size={16} />}
                {copied ? 'Copied link!' : 'Share Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

