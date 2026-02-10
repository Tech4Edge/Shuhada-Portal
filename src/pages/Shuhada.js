import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Shuhada.css';

// Data from PPTX - 10 people with their images
export const sampleShuhadaData = [
  {
    id: 1,
    type: 'Mil Shaheed',
    armyNo: '3385001',
    rank: 'L/Nk',
    name: 'Mir Ali Khan',
    unit: '3 LCB',
    ro: 'L/Dir',
    dateOfShahadat: '27 Aug 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'L/Dir',
    image: '/MirAliKhan.jpg'
  },
  {
    id: 2,
    type: 'Mil Shaheed',
    armyNo: '3410042',
    rank: 'Sep',
    name: 'Amir Sohail',
    unit: '3 LCB',
    ro: 'Lakki Marwat',
    dateOfShahadat: '27 Aug 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Arshad Sangar, Orakzai',
    image: '/AmirSohail.jpg'
  },
  {
    id: 3,
    type: 'Mil Shaheed',
    armyNo: '3408250',
    rank: 'Sep',
    name: 'Muhammad Hayat',
    unit: '3 LCB',
    ro: 'Malakand',
    dateOfShahadat: '27 Aug 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Arshad Sangar, Orakzai Agency',
    image: '/MuhammadHayat.jpg'
  },
  {
    id: 4,
    type: 'Mil Shaheed',
    armyNo: '3411723',
    rank: 'Sep',
    name: 'Mushtaq',
    unit: '3 LCB',
    ro: 'Malakand',
    dateOfShahadat: '25 Sep 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Bazah Village, Kurram',
    image: '/Mushtaq.jpg'
  },
  {
    id: 5,
    type: 'Mil Shaheed',
    armyNo: '3415544',
    rank: 'Sep',
    name: 'Muhammad Ahmed',
    unit: '3 LCB',
    ro: 'Sheikhupura',
    dateOfShahadat: '25 Sep 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: 'T Bt',
    awards: '',
    year: 2024,
    location: 'Tekri Patey, Kurram',
    image: '/MuhammadAhmad.jpg'
  },
  {
    id: 6,
    type: 'Mil Shaheed',
    armyNo: '3405635',
    rank: 'Sep',
    name: 'Shoib Haider',
    unit: '8 Cdo',
    ro: 'Jhang',
    dateOfShahadat: '15 Dec 24',
    operation: 'Clearance Operation',
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'S Bt',
    year: 2024,
    location: 'Zarpakha Village, Tirah, Khyber Agency',
    image: '/ShoibHaider.jpg'
  },
  {
    id: 7,
    type: 'Civ Shaheed',
    armyNo: '3293505',
    rank: 'Civ/Dvr',
    name: 'Zarshad',
    unit: '14 Civ GT Coy',
    ro: 'Khyber',
    dateOfShahadat: '12 Nov 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'TS',
    year: 2024,
    location: 'Near Aman Chowk',
    image: '/Zarshad.jpg'
  },
  {
    id: 8,
    type: 'Mil Shaheed',
    armyNo: '50196',
    rank: 'Maj',
    name: 'Syed Moiz Abbas Shah',
    unit: '7 NLI',
    ro: 'Chakwal',
    dateOfShahadat: '25 Sep 24',
    operation: "Militants' Attack",
    natureOfShahadat: 'Bullet Injuries',
    previousAchievements: '',
    awards: 'SJ',
    year: 2024,
    location: 'Area Sanitization Op (SF-1)',
    image: '/SyedMoizAbbasShah.jpg'
  },
  {
    id: 9,
    type: 'Mil Injury',
    armyNo: '56935',
    rank: 'Maj',
    name: 'Arif Hussain',
    unit: '8 Cdo',
    ro: 'Astore',
    dateOfInjury: '15 Dec 24',
    operation: 'Clearance Operation',
    natureOfInjury: 'Bullet Injuries (right arm splinter)',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Zarpakha Village, Tirah, Khyber Agency',
    image: '/ArifHussain.jpg'
  },
  {
    id: 10,
    type: 'Mil Injury',
    armyNo: '61033',
    rank: 'Capt',
    name: 'M. Rehan Yaseen',
    unit: '8 Cdo',
    ro: 'Lahore',
    dateOfInjury: '15 Dec 24',
    operation: 'Clearance Operation',
    natureOfInjury: 'Bullet Injuries (left leg)',
    previousAchievements: '',
    awards: 'T Bt',
    year: 2024,
    location: 'Zarpakha Village, Tirah, Khyber Agency',
    image: '/MRehanYaseen.jpg'
  },
  {
    id: 11,
    type: 'Mil Ghazi',
    armyNo: '3456789',
    rank: 'Lt Col',
    name: 'Ali Raza',
    unit: '11 Corps',
    ro: 'Rawalpindi',
    operation: 'Counter Terrorism Operations',
    previousAchievements: '',
    awards: 'HJ',
    year: 2023,
    location: 'Khyber Pakhtunkhwa',
    image: '/image2.jpg'
  }
];

const defaultFilters = {
    type: 'All Shaheeds', // Default: Show all Shaheeds (Mil Shaheed and Civ Shaheed)
    name: '',
    armyNo: '',
    unit: '',
    ro: '',
    rank: '',
    operation: '',
    date: '',
    year: ''
};

const Shuhada = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for searchable dropdowns
  const [searchInputs, setSearchInputs] = useState({
    unit: '',
    ro: '',
    rank: '',
    operation: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState({
    unit: false,
    ro: false,
    rank: false,
    operation: false
  });

  // Track if we came from Summaries (vs Home)
  const [cameFromSummaries, setCameFromSummaries] = useState(() => {
    return !!(location.state && location.state.fromSummary);
  });

  // Store return path for back button
  const [returnPath, setReturnPath] = useState(() => {
    if (location.state && location.state.returnPath) {
      return location.state.returnPath;
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = window.sessionStorage.getItem('shuhadaReturnPath');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  // Load filters from sessionStorage or navigation state
  const [filters, setFilters] = useState(() => {
    // First check if we're coming from Summaries page
    if (location.state && location.state.fromSummary) {
      const summaryFilters = { ...defaultFilters };
      
      // If filtering by awards, show all types (not just Shaheeds)
      // This must be set before type filter to ensure it takes precedence
      if (location.state.awards) {
        summaryFilters.type = 'All Types';
      } else if (location.state.type) {
        summaryFilters.type = location.state.type;
      }
      if (location.state.year && location.state.year !== 'All') {
        summaryFilters.year = location.state.year.toString();
      }
      if (location.state.rank) {
        summaryFilters.rank = location.state.rank;
      }
      if (location.state.unit) {
        summaryFilters.unit = location.state.unit;
      }
      if (location.state.ro) {
        summaryFilters.ro = location.state.ro;
      }
      if (location.state.monthLabel) {
        // For monthly clicks, we'll need to parse the month
        // This will be handled in the filteredData logic
      }
      
      // Store return path
      if (location.state.returnPath) {
        setReturnPath(location.state.returnPath);
      }
      
      // Save to sessionStorage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('shuhadaFilters', JSON.stringify(summaryFilters));
        if (location.state.returnPath) {
          window.sessionStorage.setItem('shuhadaReturnPath', JSON.stringify(location.state.returnPath));
        }
      }
      
      return summaryFilters;
    }
    
    // Otherwise, always start with default filters (don't restore from sessionStorage)
    // Filters are cleared when going back, so we always start fresh when not coming from Summaries
    return defaultFilters;
  });

  // Store navigation state for filtering
  const [navigationState, setNavigationState] = useState(location.state || null);

  // Track previous pathname to detect navigation from detail page
  const prevPathnameRef = useRef(location.pathname);

  // Update navigation state when location changes
  useEffect(() => {
    if (location.state && location.state.fromSummary) {
      setCameFromSummaries(true);
      setNavigationState(location.state);
      if (location.state.returnPath) {
        setReturnPath(location.state.returnPath);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('shuhadaReturnPath', JSON.stringify(location.state.returnPath));
        }
      }
    } else {
      // If not coming from Summaries, clear navigation state and flag
      setCameFromSummaries(false);
      setNavigationState(null);
      // Clear returnPath if not from Summaries
      setReturnPath(null);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('shuhadaReturnPath');
      }
      
      // If type is "All Types" and we're not coming from Summaries, reset it to default
      setFilters(prev => {
        if (prev.type === 'All Types') {
          const updated = { ...prev, type: defaultFilters.type };
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('shuhadaFilters', JSON.stringify(updated));
          }
          return updated;
        }
        return prev;
      });
    }
  }, [location.state]);

  // Restore filters when returning from detail page
  useEffect(() => {
    const currentPath = location.pathname;
    
    // If we're on /shuhada and we have the flag indicating we navigated to detail page, restore filters
    // Also check that we're not coming from Summaries (no fromSummary in state)
    if (currentPath === '/shuhada' && 
        (!location.state || !location.state.fromSummary) &&
        typeof window !== 'undefined') {
      const navigatingToDetail = window.sessionStorage.getItem('navigatingToDetail');
      
      if (navigatingToDetail === 'true') {
        // Clear the flag
        window.sessionStorage.removeItem('navigatingToDetail');
        
        // Restore filters from sessionStorage
        try {
          const saved = window.sessionStorage.getItem('shuhadaFilters');
          if (saved) {
            const parsed = JSON.parse(saved);
            const loadedFilters = { ...defaultFilters, ...parsed };
            
            // If "All Types" is set but we're not coming from Summaries with awards,
            // reset to default
            if (loadedFilters.type === 'All Types' && (!navigationState || !navigationState.awards)) {
              loadedFilters.type = defaultFilters.type;
            }
            
            // Only restore if filters are different from current to avoid unnecessary updates
            setFilters(prev => {
              const hasChanged = Object.keys(loadedFilters).some(key => prev[key] !== loadedFilters[key]);
              return hasChanged ? loadedFilters : prev;
            });
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }
    
    // Update ref for next comparison
    prevPathnameRef.current = currentPath;
  }, [location.pathname, location.state, navigationState]);

  // Get unique values for dropdowns
  const units = [...new Set(sampleShuhadaData.map(item => item.unit))].sort();
  const residents = [...new Set(sampleShuhadaData.map(item => item.ro))].sort();
  const ranks = [...new Set(sampleShuhadaData.map(item => item.rank))].sort();
  const operations = [...new Set(sampleShuhadaData.map(item => item.operation))].sort();
  const years = [...new Set(sampleShuhadaData.map(item => item.year))].sort((a, b) => b - a);

  // Filter options based on search input
  const filteredUnits = units.filter(unit => 
    unit.toLowerCase().includes(searchInputs.unit.toLowerCase())
  );
  const filteredResidents = residents.filter(res => 
    res.toLowerCase().includes(searchInputs.ro.toLowerCase())
  );
  const filteredRanks = ranks.filter(rank => 
    rank.toLowerCase().includes(searchInputs.rank.toLowerCase())
  );
  const filteredOperations = operations.filter(op => 
    op.toLowerCase().includes(searchInputs.operation.toLowerCase())
  );

  // Filter data
  const filteredData = useMemo(() => {
    return sampleShuhadaData.filter(item => {
      // Type filter - default shows all Shaheeds (Mil Shaheed and Civ Shaheed)
      let typeMatch = true;
      if (filters.type === 'All Types') {
        // Show all types - no filtering
        typeMatch = true;
      } else if (filters.type === 'All Shaheeds') {
        typeMatch = item.type === 'Mil Shaheed' || item.type === 'Civ Shaheed';
      } else if (filters.type !== '') {
        typeMatch = item.type === filters.type;
      }
      
      const nameMatch = filters.name === '' || 
        item.name.toLowerCase().includes(filters.name.toLowerCase());
      const armyNoMatch = filters.armyNo === '' || 
        item.armyNo.toLowerCase().startsWith(filters.armyNo.toLowerCase());
      const unitMatch = filters.unit === '' || 
        item.unit.toLowerCase().includes(filters.unit.toLowerCase());
      const roMatch = filters.ro === '' || 
        item.ro.toLowerCase().includes(filters.ro.toLowerCase());
      const rankMatch = filters.rank === '' || 
        item.rank.toLowerCase().includes(filters.rank.toLowerCase());
      const operationMatch = filters.operation === '' || 
        item.operation.toLowerCase().includes(filters.operation.toLowerCase());
      // Date matching - parse and compare dates (works for both dateOfShahadat and dateOfInjury)
      let dateMatch = true;
      if (filters.date !== '') {
        // Parse the date from format like "27 Aug 24" to YYYY-MM-DD
        const parseDate = (dateString) => {
          if (!dateString) return null;
          const months = {
            'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
            'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
            'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
          };
          const parts = dateString.toLowerCase().split(' ');
          if (parts.length >= 2) {
            const day = parts[0].padStart(2, '0');
            const month = months[parts[1].substring(0, 3)];
            const year = parts.length > 2 ? `20${parts[2]}` : new Date().getFullYear();
            if (month) {
              return `${year}-${month}-${day}`;
            }
          }
          return null;
        };
        
        const itemDate = parseDate(item.dateOfShahadat || item.dateOfInjury);
        if (itemDate) {
          dateMatch = itemDate === filters.date;
        } else {
          dateMatch = false;
        }
      }
      const yearMatch = filters.year === '' || item.year.toString() === filters.year;

      // Navigation state filters (from Summaries page)
      let awardMatch = true;
      if (navigationState && navigationState.awards) {
        if (item.awards) {
          // Split awards by comma and check if any match
          const awardsList = item.awards.split(',').map(a => a.trim());
          awardMatch = awardsList.includes(navigationState.awards.trim());
        } else {
          awardMatch = false;
        }
      }

      let monthMatch = true;
      if (navigationState && navigationState.monthLabel) {
        const monthMap = {
          'Jan': 'jan', 'Feb': 'feb', 'Mar': 'mar', 'Apr': 'apr',
          'May': 'may', 'Jun': 'jun', 'Jul': 'jul', 'Aug': 'aug',
          'Sep': 'sep', 'Oct': 'oct', 'Nov': 'nov', 'Dec': 'dec'
        };
        const monthKey = monthMap[navigationState.monthLabel];
        if (monthKey) {
          const dateStr = (item.dateOfShahadat || item.dateOfInjury || '').toLowerCase();
          monthMatch = dateStr.includes(monthKey);
        }
      }

      return typeMatch && nameMatch && armyNoMatch && unitMatch && roMatch && rankMatch && 
             operationMatch && dateMatch && yearMatch && awardMatch && monthMatch;
    });
  }, [filters, navigationState]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const updated = {
        ...prev,
        [key]: value
      };
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('shuhadaFilters', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearFilters = () => {
    setFilters(() => {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('shuhadaFilters', JSON.stringify(defaultFilters));
      }
      return defaultFilters;
    });
  };

  const clearSingleFilter = (key) => {
    setFilters(prev => {
      const updated = {
        ...prev,
        [key]: key === 'type' ? defaultFilters.type : ''
      };
      // If clearing type filter and we're not coming from Summaries with awards,
      // ensure it resets to default (not "All Types")
      if (key === 'type' && (!navigationState || !navigationState.awards)) {
        updated.type = defaultFilters.type;
      }
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('shuhadaFilters', JSON.stringify(updated));
      }
      return updated;
    });
    // Clear search input when clearing filter
    if (['unit', 'ro', 'rank', 'operation'].includes(key)) {
      setSearchInputs(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const handleSearchableSelect = (key, value) => {
    // Set the exact selected value
    handleFilterChange(key, value);
    setSearchInputs(prev => ({
      ...prev,
      [key]: value
    }));
    setDropdownOpen(prev => ({
      ...prev,
      [key]: false
    }));
  };

  const handleSearchInputChange = (key, value) => {
    setSearchInputs(prev => ({
      ...prev,
      [key]: value
    }));
    // Update filter with the search value (for partial matching)
    handleFilterChange(key, value);
  };

  // Sync search inputs with filters when filters change externally
  useEffect(() => {
    setSearchInputs(prev => ({
      ...prev,
      unit: filters.unit || '',
      ro: filters.ro || '',
      rank: filters.rank || '',
      operation: filters.operation || ''
    }));
  }, [filters.unit, filters.ro, filters.rank, filters.operation]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.searchable-select-container')) {
        setDropdownOpen({
          unit: false,
          ro: false,
          rank: false,
          operation: false
        });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="shuhada-container screen-fade">
      <div className="logo-top-right">
        <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
      </div>
      <button className="btn-back" onClick={() => {
        // Clear all filters when going back
        setFilters(defaultFilters);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('shuhadaFilters', JSON.stringify(defaultFilters));
          // Clear the navigatingToDetail flag
          window.sessionStorage.removeItem('navigatingToDetail');
        }
        
        if (cameFromSummaries && returnPath) {
          // Save to sessionStorage as backup
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('summariesReturnPath', JSON.stringify(returnPath));
          }
          navigate('/summaries', { state: { returnPath } });
        } else {
          navigate('/');
        }
      }}>
        Back
      </button>

      <div className="shuhada-content">
        <h1 className="shuhada-title">Shuhada</h1>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-item">
              <div className="filter-label-row">
                <label>Type</label>
                {filters.type !== defaultFilters.type && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('type')}
                  >
                    ×
                  </button>
                )}
              </div>
              <select
                value={filters.type}
                onChange={(e) => {
                  handleFilterChange('type', e.target.value);
                }}
                className="filter-select"
              >
                <option value="All Shaheeds">All Shaheeds</option>
                {(navigationState && navigationState.awards) || filters.type === 'All Types' ? (
                  <option value="All Types">All Types</option>
                ) : null}
                <option value="Mil Shaheed">Mil Shaheed</option>
                <option value="Mil Injury">Mil Injury</option>
                <option value="Civ Shaheed">Civ Shaheed</option>
                <option value="Civ Injury">Civ Injury</option>
                <option value="Mil Ghazi">Mil Ghazi</option>
              </select>
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Name Search</label>
                {filters.name && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('name')}
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Search by name..."
                className="filter-input"
              />
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Army No Search</label>
                {filters.armyNo && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('armyNo')}
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                type="text"
                value={filters.armyNo}
                onChange={(e) => handleFilterChange('armyNo', e.target.value)}
                placeholder="Search by army no..."
                className="filter-input"
              />
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Unit</label>
                {filters.unit && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('unit')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="searchable-select-container">
                <input
                  type="text"
                  value={searchInputs.unit}
                  onChange={(e) => handleSearchInputChange('unit', e.target.value)}
                  onFocus={() => setDropdownOpen(prev => ({ ...prev, unit: true }))}
                  placeholder="Search or select unit..."
                  className="filter-input searchable-input"
                />
                {dropdownOpen.unit && (
                  <div className="searchable-dropdown">
                    {filteredUnits.length > 0 ? (
                      filteredUnits.map(unit => (
                        <div
                          key={unit}
                          className={`dropdown-option ${filters.unit === unit ? 'selected' : ''}`}
                          onClick={() => handleSearchableSelect('unit', unit)}
                        >
                          {unit}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-option no-results">No units found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Resident Of</label>
                {filters.ro && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('ro')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="searchable-select-container">
                <input
                  type="text"
                  value={searchInputs.ro}
                  onChange={(e) => handleSearchInputChange('ro', e.target.value)}
                  onFocus={() => setDropdownOpen(prev => ({ ...prev, ro: true }))}
                  placeholder="Search or select location..."
                  className="filter-input searchable-input"
                />
                {dropdownOpen.ro && (
                  <div className="searchable-dropdown">
                    {filteredResidents.length > 0 ? (
                      filteredResidents.map(res => (
                        <div
                          key={res}
                          className={`dropdown-option ${filters.ro === res ? 'selected' : ''}`}
                          onClick={() => handleSearchableSelect('ro', res)}
                        >
                          {res}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-option no-results">No locations found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Rank</label>
                {filters.rank && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('rank')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="searchable-select-container">
                <input
                  type="text"
                  value={searchInputs.rank}
                  onChange={(e) => handleSearchInputChange('rank', e.target.value)}
                  onFocus={() => setDropdownOpen(prev => ({ ...prev, rank: true }))}
                  placeholder="Search or select rank..."
                  className="filter-input searchable-input"
                />
                {dropdownOpen.rank && (
                  <div className="searchable-dropdown">
                    {filteredRanks.length > 0 ? (
                      filteredRanks.map(rank => (
                        <div
                          key={rank}
                          className={`dropdown-option ${filters.rank === rank ? 'selected' : ''}`}
                          onClick={() => handleSearchableSelect('rank', rank)}
                        >
                          {rank}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-option no-results">No ranks found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Operation</label>
                {filters.operation && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('operation')}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="searchable-select-container">
                <input
                  type="text"
                  value={searchInputs.operation}
                  onChange={(e) => handleSearchInputChange('operation', e.target.value)}
                  onFocus={() => setDropdownOpen(prev => ({ ...prev, operation: true }))}
                  placeholder="Search or select operation..."
                  className="filter-input searchable-input"
                />
                {dropdownOpen.operation && (
                  <div className="searchable-dropdown">
                    {filteredOperations.length > 0 ? (
                      filteredOperations.map(op => (
                        <div
                          key={op}
                          className={`dropdown-option ${filters.operation === op ? 'selected' : ''}`}
                          onClick={() => handleSearchableSelect('operation', op)}
                        >
                          {op}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-option no-results">No operations found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Date of Shahadat</label>
                {filters.date && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('date')}
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="filter-input filter-date"
              />
            </div>

            <div className="filter-item">
              <div className="filter-label-row">
                <label>Year</label>
                {filters.year && (
                  <button
                    type="button"
                    className="filter-clear"
                    onClick={() => clearSingleFilter('year')}
                  >
                    ×
                  </button>
                )}
              </div>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="filter-select"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-item filter-button">
              <button className="btn-clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
        </div>

        {/* Shuhada Cards */}
        <div className="shuhada-cards">
          {filteredData.length > 0 ? (
            filteredData.map(shuhada => (
              <div 
                key={shuhada.id} 
                className="shuhada-card"
                onClick={() => {
                  // Ensure filters are saved before navigating to detail page
                  if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem('shuhadaFilters', JSON.stringify(filters));
                    // Mark that we're navigating to detail page
                    window.sessionStorage.setItem('navigatingToDetail', 'true');
                  }
                  navigate(`/shuhada/${shuhada.id}`);
                }}
              >
                <div className="card-portrait">
                  {shuhada.image ? (
                    <img 
                      src={shuhada.image} 
                      alt={shuhada.name}
                      className="card-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="portrait-placeholder" style={{ display: shuhada.image ? 'none' : 'flex' }}>
                    {shuhada.rank}
                  </div>
                  <div className="card-type-tag" data-type={shuhada.type}>
                    {shuhada.type.includes('Shaheed') ? 'Shaheed' : 
                     shuhada.type.includes('Injury') ? 'Injured' : 
                     shuhada.type.includes('Ghazi') ? 'Ghazi' : shuhada.type}
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-rank">{shuhada.rank}</div>
                  <div className="card-name">{shuhada.name}</div>
                  <div className="card-details">
                    <div className="card-unit">{shuhada.unit} | {shuhada.dateOfShahadat || shuhada.dateOfInjury || '-'}</div>
                    <div className="card-location">{shuhada.year} | {shuhada.location}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No Shuhada found matching the filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shuhada;
