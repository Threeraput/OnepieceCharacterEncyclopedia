import React from 'react';
import { Search, X, Grid2X2, List, ChevronDown, Skull } from 'lucide-react';
import type { Character, FilterChipOption, SortOption, StatusFilter, ViewMode } from '../types/character';
import { CharacterCard } from './CharacterCard';

interface CatalogProps {
  characters: Character[];
  rawCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeChip: FilterChipOption;
  onChipChange: (chip: FilterChipOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
  savedIds: Set<string>;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectCharacter: (character: Character, rankNumber: string) => void;
  displayLimit: number;
  onLoadMore: () => void;
  isLoading: boolean;
  totalFilteredCount: number;
}

export const Catalog: React.FC<CatalogProps> = ({
  characters,
  rawCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortOption,
  onSortChange,
  activeChip,
  onChipChange,
  viewMode,
  onViewModeChange,
  savedIds,
  onToggleSave,
  onSelectCharacter,
  displayLimit,
  onLoadMore,
  isLoading,
  totalFilteredCount,
}) => {
  const displayedCharacters = characters.slice(0, displayLimit);
  const hasMore = displayLimit < totalFilteredCount;

  // Title for catalog section
  const sectionTitle = activeChip === 'bounties'
    ? 'BOUNTY ARCHIVE'
    : activeChip === 'saved'
    ? 'SAVED CREW'
    : activeChip === 'alive'
    ? 'ACTIVE LEGENDS'
    : activeChip === 'deceased'
    ? 'FALLEN WARRIORS'
    : 'CHARACTER ARCHIVE';

  return (
    <main id="characters" className="catalog">
      <div className="catalog-heading">
        <h2>
          <span>/</span> {sectionTitle}
        </h2>
        <span className="result-count">
          {totalFilteredCount} {totalFilteredCount === 1 ? 'character' : 'characters'} in the archive
        </span>
      </div>

      {/* Filter Bar */}
      <div className="filters">
        <label className="search-field">
          <Search />
          <input
            type="text"
            aria-label="Search characters"
            placeholder="Search a character (e.g. Luffy, Zoro, Shanks)…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </label>

        <select
          className="select-field"
          aria-label="Character status"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="Alive">Alive</option>
          <option value="Deceased">Deceased</option>
          <option value="Unknown">Unknown</option>
        </select>

        <select
          className="select-field"
          aria-label="Sort characters"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="bounty">Sort: Highest bounty</option>
          <option value="bounty_asc">Sort: Lowest bounty</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="name_desc">Sort: Name Z–A</option>
          <option value="featured">Sort: Featured</option>
        </select>

        <div className="view-switch" role="group" aria-label="Layout view">
          <button
            type="button"
            className={viewMode === 'grid' ? 'selected' : ''}
            title="Grid view"
            aria-label="Grid view"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid2X2 size={18} />
          </button>
          <button
            type="button"
            className={viewMode === 'list' ? 'selected' : ''}
            title="List view"
            aria-label="List view"
            onClick={() => onViewModeChange('list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="filter-chips" role="group" aria-label="Filter chips">
        <button
          type="button"
          className={`filter-chip ${activeChip === 'all' ? 'selected' : ''}`}
          onClick={() => onChipChange('all')}
        >
          All characters
        </button>

        <button
          type="button"
          className={`filter-chip ${activeChip === 'bounties' ? 'selected' : ''}`}
          onClick={() => onChipChange('bounties')}
        >
          With bounties
        </button>

        <button
          type="button"
          className={`filter-chip ${activeChip === 'alive' ? 'selected' : ''}`}
          onClick={() => onChipChange('alive')}
        >
          Alive
        </button>

        <button
          type="button"
          className={`filter-chip ${activeChip === 'deceased' ? 'selected' : ''}`}
          onClick={() => onChipChange('deceased')}
        >
          Deceased
        </button>

        <button
          type="button"
          className={`filter-chip ${activeChip === 'saved' ? 'selected' : ''}`}
          onClick={() => onChipChange('saved')}
        >
          Saved ({savedIds.size})
        </button>
      </div>

      {/* Grid or List Display */}
      {isLoading ? (
        <div className="empty-state">
          <div className="status-dot" style={{ width: 12, height: 12, marginBottom: 8 }} />
          <div>Accessing Grand Line Database...</div>
        </div>
      ) : displayedCharacters.length === 0 ? (
        <div className="empty-state">
          <Skull size={48} />
          {rawCount === 0 ? (
            <>
              <p style={{ fontSize: 16, color: 'var(--foreground)' }}>Unable to load characters</p>
              <p style={{ fontSize: 12 }}>Check your network connection and reload.</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 16, color: 'var(--foreground)' }}>No characters found</p>
              <p style={{ fontSize: 12 }}>Try adjusting your search query or filters.</p>
              {(searchQuery || statusFilter !== 'all' || activeChip !== 'all') && (
                <button
                  type="button"
                  className="hero-cta secondary"
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    onSearchChange('');
                    onStatusChange('all');
                    onChipChange('all');
                  }}
                >
                  Reset all filters
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <div className={`character-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {displayedCharacters.map((char, index) => {
              const rankNumber = `#${String(index + 1).padStart(3, '0')}`;
              return (
                <CharacterCard
                  key={char.id}
                  character={char}
                  rankNumber={rankNumber}
                  isSaved={savedIds.has(char.id)}
                  onToggleSave={onToggleSave}
                  onSelect={(c) => onSelectCharacter(c, rankNumber)}
                />
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="load-more">
              <button
                type="button"
                className="load-more-btn"
                onClick={onLoadMore}
              >
                Load more characters
                <ChevronDown size={16} />
              </button>
              <div className="load-more-progress">
                Showing {displayedCharacters.length} of {totalFilteredCount} characters
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};
