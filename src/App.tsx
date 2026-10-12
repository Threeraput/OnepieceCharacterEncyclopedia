import React, { useEffect, useMemo, useState, useCallback } from 'react';
import type {
  CategoryFilter,
  Character,
  FilterChipOption,
  SortOption,
  StatusFilter,
  ViewMode,
} from './types/character';
import {
  fetchAllCharacters,
  filterCharacters,
  sortCharacters,
} from './services/onePieceApi';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { Footer } from './components/Footer';

const SAVED_STORAGE_KEY = 'onepiece_encyclopedia_saved_characters';
const DEFAULT_LIMIT = 24;

export const App: React.FC = () => {
  // Read initial query parameters from URL
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => {
    const s = searchParams.get('status');
    if (s === 'Alive' || s === 'Deceased' || s === 'Unknown') return s;
    return 'all';
  });
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    const s = searchParams.get('sort');
    if (s === 'bounty' || s === 'bounty_asc' || s === 'name' || s === 'name_desc' || s === 'featured') {
      return s;
    }
    return 'bounty';
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const v = searchParams.get('view');
    return v === 'list' ? 'list' : 'grid';
  });
  const [activeChip, setActiveChip] = useState<FilterChipOption>(() => {
    const cat = searchParams.get('category');
    if (cat === 'characters') return 'all';
    if (cat === 'bounties') return 'bounties';
    if (cat === 'saved') return 'saved';
    return 'bounties';
  });
  const [displayLimit, setDisplayLimit] = useState(() => {
    const l = parseInt(searchParams.get('limit') || '', 10);
    return !isNaN(l) && l > 0 ? l : DEFAULT_LIMIT;
  });

  // Data states
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedRank, setSelectedRank] = useState<string>('');

  // Saved/favorite characters stored in localStorage
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  // Fetch all characters from One Piece API on mount
  useEffect(() => {
    let mounted = true;

    fetchAllCharacters()
      .then((data) => {
        if (mounted) {
          setCharacters(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching characters:', err);
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Sync state with URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    else params.set('q', '');

    params.set('status', statusFilter);
    params.set('sort', sortOption);
    params.set('view', viewMode);

    const categoryParam = activeChip === 'all' ? 'characters' : activeChip;
    params.set('category', categoryParam);
    params.set('limit', String(displayLimit));

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, statusFilter, sortOption, viewMode, activeChip, displayLimit]);

  // Toggle saving a character
  const handleToggleSave = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage error
      }
      return next;
    });
  }, []);

  // Filter & sort list of characters
  const filteredAndSortedCharacters = useMemo(() => {
    const filtered = filterCharacters(characters, searchQuery, statusFilter, activeChip, savedIds);
    return sortCharacters(filtered, sortOption);
  }, [characters, searchQuery, statusFilter, activeChip, savedIds, sortOption]);

  // Header category selection handler
  const handleHeaderCategorySelect = (cat: CategoryFilter) => {
    if (cat === 'characters') {
      setActiveChip('all');
      setSortOption('featured');
    } else if (cat === 'bounties') {
      setActiveChip('bounties');
      setSortOption('bounty');
    } else if (cat === 'saved') {
      setActiveChip('saved');
    }
    setDisplayLimit(DEFAULT_LIMIT);
  };

  const handleChipChange = (chip: FilterChipOption) => {
    setActiveChip(chip);
    setDisplayLimit(DEFAULT_LIMIT);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setDisplayLimit(DEFAULT_LIMIT);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setDisplayLimit(DEFAULT_LIMIT);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + DEFAULT_LIMIT);
  };

  const handleExplore = () => {
    const el = document.getElementById('characters');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMeetLuffy = () => {
    const luffy = characters.find(
      (c) => c.name?.en?.toLowerCase().includes('monkey d. luffy') || c.id === '7cc1d5ca-fb8c-46d4-b521-521fc7b28b3c'
    );
    if (luffy) {
      setSelectedCharacter(luffy);
      setSelectedRank('#016');
    }
  };

  const activeCategory: CategoryFilter =
    activeChip === 'saved' ? 'saved' : activeChip === 'bounties' ? 'bounties' : 'characters';

  return (
    <div className="app-container">
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleHeaderCategorySelect}
        savedCount={savedIds.size}
      />

      <Hero
        totalCharacters={characters.length}
        onExplore={handleExplore}
        onMeetLuffy={handleMeetLuffy}
      />

      <Catalog
        characters={filteredAndSortedCharacters}
        rawCount={characters.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        activeChip={activeChip}
        onChipChange={handleChipChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
        onSelectCharacter={(char, rank) => {
          setSelectedCharacter(char);
          setSelectedRank(rank);
        }}
        displayLimit={displayLimit}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        totalFilteredCount={filteredAndSortedCharacters.length}
      />

      <Footer />

      {selectedCharacter && (
        <CharacterDetailModal
          character={selectedCharacter}
          rankNumber={selectedRank}
          isSaved={savedIds.has(selectedCharacter.id)}
          onToggleSave={handleToggleSave}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  );
};

export default App;
