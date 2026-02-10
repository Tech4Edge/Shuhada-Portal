import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Summaries.css';
import { sampleShuhadaData } from './Shuhada';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Month labels for line chart
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Plugin to draw value labels on points / bars (no hover in kiosk)
const valueLabelPlugin = {
  id: 'valueLabelPlugin',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        if (!value || value === 0) return;
        
        // For bars, get the top position
        const barTop = element.y;
        const barLeft = element.x;
        
        // Draw value on top of bar
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.fillText(String(value), barLeft, barTop - 8);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });
    });
    ctx.restore();
  },
};

const Summaries = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'shuhada-mil', label: 'Shuhada (Mil)' },
    { id: 'shuhada-civ', label: 'Shuhada (Civ)' },
    { id: 'injured-mil', label: 'Injured (Mil)' },
    { id: 'award-holders', label: 'Award Holders' },
    { id: 'khawarjis-killed', label: 'Khawarjis Killed' },
  ];

  const [activeTab, setActiveTab] = useState('shuhada-mil');
  const [milView, setMilView] = useState('monthly'); // 'monthly' | 'rank' | 'unit' | 'district'
  const [civView, setCivView] = useState('monthly'); // 'monthly' | 'district'
  const [injuredView, setInjuredView] = useState('monthly'); // 'monthly' | 'rank' | 'unit' | 'district'
  const [yearFilter, setYearFilter] = useState('');
  const [civYearFilter, setCivYearFilter] = useState('');
  const [injuredYearFilter, setInjuredYearFilter] = useState('');
  const [awardYearFilter, setAwardYearFilter] = useState('');
  
  // Filter dropdowns for rank/unit/district/award
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCivDistrict, setSelectedCivDistrict] = useState('');
  const [selectedInjuredRank, setSelectedInjuredRank] = useState('');
  const [selectedInjuredUnit, setSelectedInjuredUnit] = useState('');
  const [selectedInjuredDistrict, setSelectedInjuredDistrict] = useState('');
  const [selectedAward, setSelectedAward] = useState('');

  // Refs for tracking tab changes and restoration
  const prevActiveTabRef = useRef(activeTab);
  const isRestoringRef = useRef(false);

  // Track if we've handled the initial state
  const hasHandledInitialStateRef = useRef(false);

  // Restore state when returning from Shuhada page, or reset to first tab when coming from Home
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const currentState = location.state;
    
    // Check if we're coming from Shuhada (has returnPath in location.state)
    if (currentState && currentState.returnPath) {
      const returnPath = currentState.returnPath;
      // Save to sessionStorage as backup
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('summariesReturnPath', JSON.stringify(returnPath));
      }
      
      // Restore the tab and view
      const { activeTab: tab, view, yearFilter: year } = returnPath;
      if (tab) {
        // Set flag to prevent reset when restoring
        isRestoringRef.current = true;
        setActiveTab(tab);
        if (tab === 'shuhada-mil' && view) {
          setMilView(view);
          if (year !== undefined) {
            setYearFilter(year === 'All' || year === '' ? '' : year);
          }
          // Trigger animation when restoring
          setTimeout(() => {
            setAnimationKey(prev => prev + 1);
          }, 100);
        } else if (tab === 'shuhada-civ' && view) {
          setCivView(view);
          if (year !== undefined) {
            setCivYearFilter(year === 'All' || year === '' ? '' : year);
          }
          // Trigger animation when restoring
          setTimeout(() => {
            setCivAnimationKey(prev => prev + 1);
          }, 100);
        } else if (tab === 'injured-mil' && view) {
          setInjuredView(view);
          if (year !== undefined) {
            setInjuredYearFilter(year === 'All' || year === '' ? '' : year);
          }
          // Trigger animation when restoring
          setTimeout(() => {
            setInjuredAnimationKey(prev => prev + 1);
          }, 100);
        } else if (tab === 'award-holders') {
          if (year !== undefined) {
            setAwardYearFilter(year === 'All' || year === '' ? '' : year);
          }
          // Trigger animation when restoring
          setTimeout(() => {
            setAwardAnimationKey(prev => prev + 1);
          }, 100);
        }
      }
      hasHandledInitialStateRef.current = true;
    } 
    // Coming from Home (no returnPath) - reset to first tab only on initial load or when state changes to null
    else if (!hasHandledInitialStateRef.current || (!currentState || !currentState.returnPath)) {
      // Only reset if we're not already on the first tab and not restoring
      if (activeTab !== 'shuhada-mil' && !isRestoringRef.current) {
        setActiveTab('shuhada-mil');
        setMilView('monthly');
        setCivView('monthly');
        setInjuredView('monthly');
        setYearFilter('');
        setCivYearFilter('');
        setInjuredYearFilter('');
        setAwardYearFilter('');
      }
      // Clear saved returnPath when coming from Home
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('summariesReturnPath');
      }
      hasHandledInitialStateRef.current = true;
    }
  }, [location.state]);

  // Reset views to default when switching tabs (but not when restoring from returnPath)
  useEffect(() => {
    // If we're restoring from returnPath, skip reset
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      prevActiveTabRef.current = activeTab;
      return;
    }
    
    const prevTab = prevActiveTabRef.current;
    
    // If tab changed, reset the previous tab's view to default and clear filters
    if (prevTab !== activeTab) {
      if (prevTab === 'shuhada-mil') {
        setMilView('monthly');
        setSelectedRank('');
        setSelectedUnit('');
        setSelectedDistrict('');
        setAnimationKey(prev => prev + 1);
      } else if (prevTab === 'shuhada-civ') {
        setCivView('monthly');
        setSelectedCivDistrict('');
        setCivAnimationKey(prev => prev + 1);
      } else if (prevTab === 'injured-mil') {
        setInjuredView('monthly');
        setSelectedInjuredRank('');
        setSelectedInjuredUnit('');
        setSelectedInjuredDistrict('');
        setInjuredAnimationKey(prev => prev + 1);
      } else if (prevTab === 'award-holders') {
        setSelectedAward('');
      }
      
      // Update the ref
      prevActiveTabRef.current = activeTab;
    }
  }, [activeTab]);

  // Reset filter dropdowns when switching views
  useEffect(() => {
    if (milView !== 'rank') setSelectedRank('');
    if (milView !== 'unit') setSelectedUnit('');
    if (milView !== 'district') setSelectedDistrict('');
  }, [milView]);

  useEffect(() => {
    if (civView !== 'district') setSelectedCivDistrict('');
  }, [civView]);

  useEffect(() => {
    if (injuredView !== 'rank') setSelectedInjuredRank('');
    if (injuredView !== 'unit') setSelectedInjuredUnit('');
    if (injuredView !== 'district') setSelectedInjuredDistrict('');
  }, [injuredView]);

  const [animationKey, setAnimationKey] = useState(0);
  const [civAnimationKey, setCivAnimationKey] = useState(0);
  const [injuredAnimationKey, setInjuredAnimationKey] = useState(0);
  const [awardAnimationKey, setAwardAnimationKey] = useState(0);
  const rankChartRef = useRef(null);
  const unitChartRef = useRef(null);
  const districtChartRef = useRef(null);
  const civDistrictChartRef = useRef(null);
  const injuredRankChartRef = useRef(null);
  const injuredUnitChartRef = useRef(null);
  const injuredDistrictChartRef = useRef(null);
  const awardChartRef = useRef(null);

  // Only military Shaheeds
  const milShuhadaAll = useMemo(
    () => sampleShuhadaData.filter((s) => s.type === 'Mil Shaheed'),
    []
  );

  const years = useMemo(
    () => Array.from(new Set(milShuhadaAll.map((s) => s.year))).sort((a, b) => a - b),
    [milShuhadaAll]
  );

  const selectedYear = useMemo(() => {
    if (!years.length) return undefined;
    if (!yearFilter || yearFilter === 'All') {
      return 'All';
    }
    const numeric = Number(yearFilter);
    return Number.isNaN(numeric) ? 'All' : numeric;
  }, [yearFilter, years]);

  // Shuhada for selected year or all years
  const milShuhada = useMemo(
    () =>
      selectedYear === 'All'
        ? milShuhadaAll
        : selectedYear
        ? milShuhadaAll.filter((s) => s.year === selectedYear)
        : [],
    [milShuhadaAll, selectedYear]
  );

  // Monthly counts, parsing month from dateOfShahadat text
  const monthlyCounts = useMemo(() => {
    const counts = new Array(12).fill(0);
    const monthMap = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    milShuhada.forEach((s) => {
      if (!s.dateOfShahadat) return;
      const lower = s.dateOfShahadat.toLowerCase();
      const parts = lower.split(/\s+/);
      // expected like "27 August 2024" -> day month year
      if (parts.length >= 2) {
        const monthToken = parts[1].slice(0, 3);
        const idx = monthMap[monthToken];
        if (idx !== undefined) counts[idx] += 1;
      }
    });

    return counts;
  }, [milShuhada]);

  const rankCounts = useMemo(() => {
    const map = {};
    let filteredData = milShuhada;
    
    // If a specific rank is selected, filter by it
    if (selectedRank) {
      filteredData = milShuhada.filter((s) => s.rank === selectedRank);
      // Return only the selected rank with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedRank]: count };
      }
      return {};
    }
    
    // Otherwise show all ranks
    filteredData.forEach((s) => {
      map[s.rank] = (map[s.rank] || 0) + 1;
    });
    return map;
  }, [milShuhada, selectedRank]);

  const unitCounts = useMemo(() => {
    const map = {};
    let filteredData = milShuhada;
    
    // If a specific unit is selected, filter by it
    if (selectedUnit) {
      filteredData = milShuhada.filter((s) => s.unit === selectedUnit);
      // Return only the selected unit with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedUnit]: count };
      }
      return {};
    }
    
    // Otherwise show all units
    filteredData.forEach((s) => {
      map[s.unit] = (map[s.unit] || 0) + 1;
    });
    return map;
  }, [milShuhada, selectedUnit]);

  const roCounts = useMemo(() => {
    const map = {};
    let filteredData = milShuhada;
    
    // If a specific district is selected, filter by it
    if (selectedDistrict) {
      filteredData = milShuhada.filter((s) => s.ro === selectedDistrict);
      // Return only the selected district with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedDistrict]: count };
      }
      return {};
    }
    
    // Otherwise show all districts
    filteredData.forEach((s) => {
      map[s.ro] = (map[s.ro] || 0) + 1;
    });
    return map;
  }, [milShuhada, selectedDistrict]);

  // Civilian Shuhada data
  const civShuhadaAll = useMemo(
    () => sampleShuhadaData.filter((s) => s.type === 'Civ Shaheed'),
    []
  );

  const civYears = useMemo(
    () => Array.from(new Set(civShuhadaAll.map((s) => s.year))).sort((a, b) => a - b),
    [civShuhadaAll]
  );

  const selectedCivYear = useMemo(() => {
    if (!civYears.length) return undefined;
    if (!civYearFilter || civYearFilter === 'All') {
      return 'All';
    }
    const numeric = Number(civYearFilter);
    return Number.isNaN(numeric) ? 'All' : numeric;
  }, [civYearFilter, civYears]);

  const civShuhada = useMemo(
    () =>
      selectedCivYear === 'All'
        ? civShuhadaAll
        : selectedCivYear
        ? civShuhadaAll.filter((s) => s.year === selectedCivYear)
        : [],
    [civShuhadaAll, selectedCivYear]
  );

  // Monthly counts for civilian Shuhada
  const civMonthlyCounts = useMemo(() => {
    const counts = new Array(12).fill(0);
    const monthMap = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    civShuhada.forEach((s) => {
      if (!s.dateOfShahadat) return;
      const lower = s.dateOfShahadat.toLowerCase();
      const parts = lower.split(/\s+/);
      // expected like "27 August 2024" -> day month year
      if (parts.length >= 2) {
        const monthToken = parts[1].slice(0, 3);
        const idx = monthMap[monthToken];
        if (idx !== undefined) counts[idx] += 1;
      }
    });

    return counts;
  }, [civShuhada]);

  const civDistrictCounts = useMemo(() => {
    const map = {};
    let filteredData = civShuhada;
    
    // If a specific district is selected, filter by it
    if (selectedCivDistrict) {
      filteredData = civShuhada.filter((s) => s.ro === selectedCivDistrict);
      // Return only the selected district with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedCivDistrict]: count };
      }
      return {};
    }
    
    // Otherwise show all districts
    filteredData.forEach((s) => {
      map[s.ro] = (map[s.ro] || 0) + 1;
    });
    return map;
  }, [civShuhada, selectedCivDistrict]);

  // Military Injured data
  const injuredAll = useMemo(
    () => sampleShuhadaData.filter((s) => s.type === 'Mil Injury'),
    []
  );

  const injuredYears = useMemo(
    () => Array.from(new Set(injuredAll.map((s) => s.year))).sort((a, b) => a - b),
    [injuredAll]
  );

  const selectedInjuredYear = useMemo(() => {
    if (!injuredYears.length) return undefined;
    if (!injuredYearFilter || injuredYearFilter === 'All') {
      return 'All';
    }
    const numeric = Number(injuredYearFilter);
    return Number.isNaN(numeric) ? 'All' : numeric;
  }, [injuredYearFilter, injuredYears]);

  const injured = useMemo(
    () =>
      selectedInjuredYear === 'All'
        ? injuredAll
        : selectedInjuredYear
        ? injuredAll.filter((s) => s.year === selectedInjuredYear)
        : [],
    [injuredAll, selectedInjuredYear]
  );

  // Monthly counts for injured, parsing month from dateOfInjury text
  const injuredMonthlyCounts = useMemo(() => {
    const counts = new Array(12).fill(0);
    const monthMap = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    injured.forEach((s) => {
      if (!s.dateOfInjury) return;
      const lower = s.dateOfInjury.toLowerCase();
      const parts = lower.split(/\s+/);
      // expected like "27 August 2024" -> day month year
      if (parts.length >= 2) {
        const monthToken = parts[1].slice(0, 3);
        const idx = monthMap[monthToken];
        if (idx !== undefined) counts[idx] += 1;
      }
    });

    return counts;
  }, [injured]);

  const injuredRankCounts = useMemo(() => {
    const map = {};
    let filteredData = injured;
    
    // If a specific rank is selected, filter by it
    if (selectedInjuredRank) {
      filteredData = injured.filter((s) => s.rank === selectedInjuredRank);
      // Return only the selected rank with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedInjuredRank]: count };
      }
      return {};
    }
    
    // Otherwise show all ranks
    filteredData.forEach((s) => {
      map[s.rank] = (map[s.rank] || 0) + 1;
    });
    return map;
  }, [injured, selectedInjuredRank]);

  const injuredUnitCounts = useMemo(() => {
    const map = {};
    let filteredData = injured;
    
    // If a specific unit is selected, filter by it
    if (selectedInjuredUnit) {
      filteredData = injured.filter((s) => s.unit === selectedInjuredUnit);
      // Return only the selected unit with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedInjuredUnit]: count };
      }
      return {};
    }
    
    // Otherwise show all units
    filteredData.forEach((s) => {
      map[s.unit] = (map[s.unit] || 0) + 1;
    });
    return map;
  }, [injured, selectedInjuredUnit]);

  const injuredDistrictCounts = useMemo(() => {
    const map = {};
    let filteredData = injured;
    
    // If a specific district is selected, filter by it
    if (selectedInjuredDistrict) {
      filteredData = injured.filter((s) => s.ro === selectedInjuredDistrict);
      // Return only the selected district with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedInjuredDistrict]: count };
      }
      return {};
    }
    
    // Otherwise show all districts
    filteredData.forEach((s) => {
      map[s.ro] = (map[s.ro] || 0) + 1;
    });
    return map;
  }, [injured, selectedInjuredDistrict]);

  // Award Holders data - filter all people with awards (Ghazi, Mil Shaheed, Civ Shaheed)
  const awardHoldersAll = useMemo(
    () => sampleShuhadaData.filter((s) => s.awards && s.awards.trim() !== ''),
    []
  );

  const awardYears = useMemo(
    () => Array.from(new Set(awardHoldersAll.map((s) => s.year))).sort((a, b) => a - b),
    [awardHoldersAll]
  );

  const selectedAwardYear = useMemo(() => {
    if (!awardYears.length) return undefined;
    if (!awardYearFilter || awardYearFilter === 'All') {
      return 'All';
    }
    const numeric = Number(awardYearFilter);
    return Number.isNaN(numeric) ? 'All' : numeric;
  }, [awardYearFilter, awardYears]);

  // Filter award holders by selected year or all years
  const awardHolders = useMemo(
    () =>
      selectedAwardYear === 'All'
        ? awardHoldersAll
        : selectedAwardYear
        ? awardHoldersAll.filter((s) => s.year === selectedAwardYear)
        : [],
    [awardHoldersAll, selectedAwardYear]
  );

  // Group by award type
  const awardCounts = useMemo(() => {
    const map = {};
    let filteredData = awardHolders;
    
    // If a specific award is selected, filter by it
    if (selectedAward) {
      filteredData = awardHolders.filter((s) => {
        const awards = s.awards ? s.awards.split(',').map(a => a.trim()) : [];
        return awards.includes(selectedAward);
      });
      // Return only the selected award with its count
      const count = filteredData.length;
      if (count > 0) {
        return { [selectedAward]: count };
      }
      return {};
    }
    
    // Otherwise show all awards
    filteredData.forEach((s) => {
      const award = s.awards ? s.awards.trim() : '';
      if (award) {
        // Handle comma-separated awards
        const awards = award.split(',').map(a => a.trim());
        awards.forEach(a => {
          if (a) {
            map[a] = (map[a] || 0) + 1;
          }
        });
      }
    });
    return map;
  }, [awardHolders, selectedAward]);

  // State to control animation - start with zeros, then update to real data
  const [rankData, setRankData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Civilian animation state
  const [civDistrictData, setCivDistrictData] = useState([]);
  const [isCivAnimating, setIsCivAnimating] = useState(false);
  
  // Injured animation state
  const [injuredRankData, setInjuredRankData] = useState([]);
  const [injuredUnitData, setInjuredUnitData] = useState([]);
  const [injuredDistrictData, setInjuredDistrictData] = useState([]);
  const [isInjuredAnimating, setIsInjuredAnimating] = useState(false);
  
  // Award animation state
  const [awardData, setAwardData] = useState([]);
  const [isAwardAnimating, setIsAwardAnimating] = useState(false);

  // Reset data immediately when view changes
  useEffect(() => {
    // Get the real values first
    const rankValues = Object.values(rankCounts);
    const unitValues = Object.values(unitCounts);
    const roValues = Object.values(roCounts);
    
    // Immediately reset to empty to hide chart
    setRankData([]);
    setUnitData([]);
    setDistrictData([]);
    setIsAnimating(false);
    
    // Use requestAnimationFrame to ensure zeros are set before next paint
    requestAnimationFrame(() => {
      // Set zeros first
      setRankData(rankValues.map(() => 0));
      setUnitData(unitValues.map(() => 0));
      setDistrictData(roValues.map(() => 0));
      
      // Use another requestAnimationFrame to ensure zeros are rendered
      requestAnimationFrame(() => {
        setIsAnimating(true);
        
        // Then update to real values after a delay to trigger animation
        setTimeout(() => {
          setRankData(rankValues);
          setUnitData(unitValues);
          setDistrictData(roValues);
        }, 250);
      });
    });
  }, [milView, selectedYear, animationKey, rankCounts, unitCounts, roCounts]);

  // Reset civilian data immediately when view or year changes
  useEffect(() => {
    // Only animate for district view
    if (civView !== 'district') {
      setCivDistrictData([]);
      setIsCivAnimating(false);
      return;
    }
    
    // Get the real values first
    const civRoValues = Object.values(civDistrictCounts);
    
    // Immediately reset to empty to hide chart
    setCivDistrictData([]);
    setIsCivAnimating(false);
    
    // Use requestAnimationFrame to ensure zeros are set before next paint
    requestAnimationFrame(() => {
      // Set zeros first
      setCivDistrictData(civRoValues.map(() => 0));
      
      // Use another requestAnimationFrame to ensure zeros are rendered
      requestAnimationFrame(() => {
        setIsCivAnimating(true);
        
        // Then update to real values after a delay to trigger animation
        setTimeout(() => {
          setCivDistrictData(civRoValues);
        }, 250);
      });
    });
  }, [civView, selectedCivYear, civAnimationKey, civDistrictCounts]);

  // Reset injured data immediately when view changes
  useEffect(() => {
    // Get the real values first
    const injuredRankValues = Object.values(injuredRankCounts);
    const injuredUnitValues = Object.values(injuredUnitCounts);
    const injuredRoValues = Object.values(injuredDistrictCounts);
    
    // Immediately reset to empty to hide chart
    setInjuredRankData([]);
    setInjuredUnitData([]);
    setInjuredDistrictData([]);
    setIsInjuredAnimating(false);
    
    // Use requestAnimationFrame to ensure zeros are set before next paint
    requestAnimationFrame(() => {
      // Set zeros first
      setInjuredRankData(injuredRankValues.map(() => 0));
      setInjuredUnitData(injuredUnitValues.map(() => 0));
      setInjuredDistrictData(injuredRoValues.map(() => 0));
      
      // Use another requestAnimationFrame to ensure zeros are rendered
      requestAnimationFrame(() => {
        setIsInjuredAnimating(true);
        
        // Then update to real values after a delay to trigger animation
        setTimeout(() => {
          setInjuredRankData(injuredRankValues);
          setInjuredUnitData(injuredUnitValues);
          setInjuredDistrictData(injuredRoValues);
        }, 250);
      });
    });
  }, [injuredView, selectedInjuredYear, injuredAnimationKey, injuredRankCounts, injuredUnitCounts, injuredDistrictCounts]);

  // Reset award data immediately when tab or year changes
  useEffect(() => {
    // Only animate when award-holders tab is active
    if (activeTab !== 'award-holders') {
      setAwardData([]);
      setIsAwardAnimating(false);
      return;
    }
    
    // Get the real values first
    const awardValues = Object.values(awardCounts);
    
    // Immediately reset to empty to hide chart
    setAwardData([]);
    setIsAwardAnimating(false);
    
    // Use requestAnimationFrame to ensure zeros are set before next paint
    requestAnimationFrame(() => {
      // Set zeros first
      setAwardData(awardValues.map(() => 0));
      
      // Use another requestAnimationFrame to ensure zeros are rendered
      requestAnimationFrame(() => {
        setIsAwardAnimating(true);
        
        // Then update to real values after a delay to trigger animation
        setTimeout(() => {
          setAwardData(awardValues);
        }, 250);
      });
    });
  }, [activeTab, selectedAwardYear, awardAnimationKey, awardCounts]);


  const barOptionsCommon = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 25,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutCubic',
      delay: (context) => {
        if (context.type === 'data' && context.mode === 'default') {
          return context.dataIndex * 80;
        }
        return 0;
      },
      onProgress: (animation) => {
        animation.chart.draw();
      },
      onComplete: (animation) => {
        animation.chart.draw();
      },
    },
    scales: {
      x: {
        ticks: { 
          color: '#C3B091',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { 
          color: '#C3B091', 
          precision: 0, 
          stepSize: 1,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        grid: { color: 'rgba(195, 176, 145, 0.25)' },
      },
    },
  }), []);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 25,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: {
      duration: 900,
      easing: 'easeOutCubic',
    },
    scales: {
      x: {
        ticks: { 
          color: '#C3B091',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        grid: { color: 'rgba(195, 176, 145, 0.15)' },
      },
      y: {
        beginAtZero: true,
        ticks: { 
          color: '#C3B091', 
          precision: 0, 
          stepSize: 1,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        grid: { color: 'rgba(195, 176, 145, 0.25)' },
      },
    },
    elements: {
      line: { tension: 0.35, borderWidth: 3 },
      point: { radius: 4, hitRadius: 10 },
    },
    onClick: (_, elements, chart) => {
      if (!elements.length) return;
      const index = elements[0].index;
      const monthLabel = chart.data.labels[index];
      navigate('/shuhada', {
        state: {
          fromSummary: true,
          year: selectedYear,
          monthLabel,
          returnPath: {
            activeTab: 'shuhada-mil',
            view: 'monthly',
            yearFilter: yearFilter || 'All',
          },
        },
      });
    },
  };

  return (
    <div className="summaries-container screen-fade">
      <div className="logo-top-right">
        <img src="/logo.png" alt="11 Corps Logo" className="corps-logo" />
      </div>

      <button className="btn-back" onClick={() => navigate('/')}>
        Back
      </button>

      {/* Ayah Section */}
      <div className="summaries-ayah-section">
        <div className="summaries-ayah-container">
          <div className="summaries-ayah-arabic">
            وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا ۚ بَلْ أَحْيَاءٌ عِندَ رَبِّهِمْ يُرْزَقُونَ
          </div>
          <div className="summaries-ayah-translation">
            "And never think of those who have been killed in the cause of Allah as dead. Rather, they are alive with their Lord, receiving provision."
          </div>
          <div className="summaries-ayah-reference">
            — Al-Quran 3:169
          </div>
        </div>
      </div>

      <div className="summaries-content">
        <aside className="summaries-sidebar">
          <h2 className="summaries-sidebar-title">Summaries</h2>
          <div className="summaries-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`summaries-tab${
                  activeTab === tab.id ? ' summaries-tab-active' : ''
                }`}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'award-holders') {
                    setAwardAnimationKey(prev => prev + 1);
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="summaries-main">
          {activeTab === 'shuhada-mil' ? (
            <div className="summaries-shuhada-mil">
              <div className="summaries-filters-row">
                <div className="summaries-filter-group">
                  <label>Year</label>
                  <select
                    value={yearFilter || 'All'}
                    onChange={(e) => {
                      setYearFilter(e.target.value === 'All' ? '' : e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }}
                  >
                    <option value="All">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="summaries-view-tabs">
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      milView === 'monthly' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setMilView('monthly');
                      setAnimationKey(prev => prev + 1);
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      milView === 'rank' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setMilView('rank');
                      setAnimationKey(prev => prev + 1);
                    }}
                  >
                    Rank wise
                  </button>
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      milView === 'unit' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setMilView('unit');
                      setAnimationKey(prev => prev + 1);
                    }}
                  >
                    Unit wise
                  </button>
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      milView === 'district'
                        ? ' summaries-view-tab-active'
                        : ''
                    }`}
                    onClick={() => {
                      setMilView('district');
                      setAnimationKey(prev => prev + 1);
                    }}
                  >
                    District wise
                  </button>
                </div>

                {/* Dropdown filter - always visible, changes based on tab, disabled when Monthly is selected */}
                <div className="summaries-filter-group">
                  <label>
                    {milView === 'rank' ? 'Select Rank' : 
                     milView === 'unit' ? 'Select Unit' : 
                     milView === 'district' ? 'Select District' : 'Select'}
                  </label>
                  <select
                    value={
                      milView === 'rank' ? (selectedRank || 'All') :
                      milView === 'unit' ? (selectedUnit || 'All') :
                      milView === 'district' ? (selectedDistrict || 'All') : 'All'
                    }
                    onChange={(e) => {
                      const value = e.target.value === 'All' ? '' : e.target.value;
                      if (milView === 'rank') {
                        setSelectedRank(value);
                      } else if (milView === 'unit') {
                        setSelectedUnit(value);
                      } else if (milView === 'district') {
                        setSelectedDistrict(value);
                      }
                      setAnimationKey(prev => prev + 1);
                    }}
                    disabled={milView === 'monthly'}
                  >
                    {milView === 'rank' && (
                      <>
                        <option value="All">All Ranks</option>
                        {Array.from(new Set(milShuhada.map(s => s.rank))).sort().map((rank) => (
                          <option key={rank} value={rank}>
                            {rank}
                          </option>
                        ))}
                      </>
                    )}
                    {milView === 'unit' && (
                      <>
                        <option value="All">All Units</option>
                        {Array.from(new Set(milShuhada.map(s => s.unit))).sort().map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </>
                    )}
                    {milView === 'district' && (
                      <>
                        <option value="All">All Districts</option>
                        {Array.from(new Set(milShuhada.map(s => s.ro))).sort().map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </>
                    )}
                    {milView === 'monthly' && (
                      <option value="All">N/A</option>
                    )}
                  </select>
                </div>
              </div>

              {(!selectedYear || !milShuhada.length) && (
                <div className="summaries-placeholder">
                  <p className="summaries-placeholder-text">
                    {selectedYear === 'All' 
                      ? 'No Shuhada data available.'
                      : 'No Shuhada data available for the selected year.'}
                  </p>
                </div>
              )}

              {selectedYear && milShuhada.length > 0 && (
                <>
                  {milView === 'monthly' && (
                    <div className="summaries-line-chart">
                      <Line
                        data={{
                          labels: MONTH_LABELS,
                          datasets: [
                            {
                              label: 'Shuhada per month',
                              data: monthlyCounts,
                              borderColor: '#4DA6FF',
                              backgroundColor: 'rgba(77, 166, 255, 0.25)',
                              pointBackgroundColor: '#E0F0FF',
                            },
                          ],
                        }}
                        options={lineOptions}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}

                  {milView === 'rank' && isAnimating && rankData.length > 0 && (
                    <div className="summaries-bar-chart">
                      <Bar
                        ref={rankChartRef}
                        key={`rank-${selectedYear}-${animationKey}-${isAnimating}`}
                        data={{
                          labels: Object.keys(rankCounts),
                          datasets: [
                            {
                              label: 'Count',
                              data: rankData,
                              backgroundColor: 'rgba(77, 166, 255, 0.9)',
                              borderColor: 'rgba(0, 60, 143, 0.95)',
                              borderWidth: 2,
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          ...barOptionsCommon,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const idx = elements[0].index;
                            const rank = chart.data.labels[idx];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedYear,
                                rank: selectedRank || rank,
                                returnPath: {
                                  activeTab: 'shuhada-mil',
                                  view: 'rank',
                                  yearFilter: yearFilter || 'All',
                                  selectedRank: selectedRank || '',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}

                  {milView === 'unit' && isAnimating && unitData.length > 0 && (
                    <div className="summaries-bar-chart">
                      <Bar
                        ref={unitChartRef}
                        key={`unit-${selectedYear}-${animationKey}-${isAnimating}`}
                        data={{
                          labels: Object.keys(unitCounts),
                          datasets: [
                            {
                              label: 'Count',
                              data: unitData,
                              backgroundColor: 'rgba(77, 166, 255, 0.9)',
                              borderColor: 'rgba(0, 60, 143, 0.95)',
                              borderWidth: 2,
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          ...barOptionsCommon,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const idx = elements[0].index;
                            const unit = chart.data.labels[idx];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedYear,
                                unit: selectedUnit || unit,
                                returnPath: {
                                  activeTab: 'shuhada-mil',
                                  view: 'unit',
                                  yearFilter: yearFilter || 'All',
                                  selectedUnit: selectedUnit || '',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}

                  {milView === 'district' && isAnimating && districtData.length > 0 && (
                    <div className="summaries-bar-chart">
                      <Bar
                        ref={districtChartRef}
                        key={`district-${selectedYear}-${animationKey}-${isAnimating}`}
                        data={{
                          labels: Object.keys(roCounts),
                          datasets: [
                            {
                              label: 'Count',
                              data: districtData,
                              backgroundColor: 'rgba(77, 166, 255, 0.9)',
                              borderColor: 'rgba(0, 60, 143, 0.95)',
                              borderWidth: 2,
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          ...barOptionsCommon,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const idx = elements[0].index;
                            const ro = chart.data.labels[idx];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedYear,
                                ro: selectedDistrict || ro,
                                returnPath: {
                                  activeTab: 'shuhada-mil',
                                  view: 'district',
                                  yearFilter: yearFilter || 'All',
                                  selectedDistrict: selectedDistrict || '',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ) : activeTab === 'shuhada-civ' ? (
            <div className="summaries-shuhada-mil">
              <div className="summaries-filters-row">
                <div className="summaries-filter-group">
                  <label>Year</label>
                  <select
                    value={civYearFilter || 'All'}
                    onChange={(e) => {
                      setCivYearFilter(e.target.value === 'All' ? '' : e.target.value);
                      setCivAnimationKey(prev => prev + 1);
                    }}
                  >
                    <option value="All">All Years</option>
                    {civYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="summaries-view-tabs">
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      civView === 'monthly' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setCivView('monthly');
                      setCivAnimationKey(prev => prev + 1);
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      civView === 'district' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setCivView('district');
                      setCivAnimationKey(prev => prev + 1);
                    }}
                  >
                    District wise
                  </button>
                </div>

                {/* Dropdown filter - always visible, disabled when Monthly is selected */}
                <div className="summaries-filter-group">
                  <label>Select District</label>
                  <select
                    value={selectedCivDistrict || 'All'}
                    onChange={(e) => {
                      setSelectedCivDistrict(e.target.value === 'All' ? '' : e.target.value);
                      setCivAnimationKey(prev => prev + 1);
                    }}
                    disabled={civView === 'monthly'}
                  >
                    <option value="All">All Districts</option>
                    {Array.from(new Set(civShuhada.map(s => s.ro))).sort().map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(!selectedCivYear || !civShuhada.length) && (
                <div className="summaries-placeholder">
                  <p className="summaries-placeholder-text">
                    {selectedCivYear === 'All' 
                      ? 'No Civilian Shuhada data available.'
                      : 'No Civilian Shuhada data available for the selected year.'}
                  </p>
                </div>
              )}

              {selectedCivYear && civShuhada.length > 0 && (
                <>
                  {civView === 'monthly' && (
                    <div className="summaries-line-chart">
                      <Line
                        data={{
                          labels: MONTH_LABELS,
                          datasets: [
                            {
                              label: 'Shuhada per month',
                              data: civMonthlyCounts,
                              borderColor: '#4DA6FF',
                              backgroundColor: 'rgba(77, 166, 255, 0.25)',
                              pointBackgroundColor: '#E0F0FF',
                            },
                          ],
                        }}
                        options={{
                          ...lineOptions,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const index = elements[0].index;
                            const monthLabel = chart.data.labels[index];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedCivYear,
                                monthLabel,
                                type: 'Civ Shaheed',
                                returnPath: {
                                  activeTab: 'shuhada-civ',
                                  view: 'monthly',
                                  yearFilter: civYearFilter || 'All',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}

                  {civView === 'district' && isCivAnimating && civDistrictData.length > 0 && (
                    <div className="summaries-bar-chart">
                      <Bar
                        ref={civDistrictChartRef}
                        key={`civ-district-${selectedCivYear}-${civAnimationKey}-${isCivAnimating}`}
                        data={{
                          labels: Object.keys(civDistrictCounts),
                          datasets: [
                            {
                              label: 'Count',
                              data: civDistrictData,
                              backgroundColor: 'rgba(77, 166, 255, 0.9)',
                              borderColor: 'rgba(0, 60, 143, 0.95)',
                              borderWidth: 2,
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          ...barOptionsCommon,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const idx = elements[0].index;
                            const ro = chart.data.labels[idx];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedCivYear,
                                ro: selectedCivDistrict || ro,
                                type: 'Civ Shaheed',
                                returnPath: {
                                  activeTab: 'shuhada-civ',
                                  view: 'district',
                                  yearFilter: civYearFilter || 'All',
                                  selectedCivDistrict: selectedCivDistrict || '',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ) : activeTab === 'injured-mil' ? (
            <div className="summaries-shuhada-mil">
              <div className="summaries-filters-row">
                <div className="summaries-filter-group">
                  <label>Year</label>
                  <select
                    value={injuredYearFilter || 'All'}
                    onChange={(e) => {
                      setInjuredYearFilter(e.target.value === 'All' ? '' : e.target.value);
                      setInjuredAnimationKey(prev => prev + 1);
                    }}
                  >
                    <option value="All">All Years</option>
                    {injuredYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="summaries-view-tabs">
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      injuredView === 'monthly' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setInjuredView('monthly');
                      setInjuredAnimationKey(prev => prev + 1);
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      injuredView === 'rank' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setInjuredView('rank');
                      setInjuredAnimationKey(prev => prev + 1);
                    }}
                  >
                    Rank wise
                  </button>
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      injuredView === 'unit' ? ' summaries-view-tab-active' : ''
                    }`}
                    onClick={() => {
                      setInjuredView('unit');
                      setInjuredAnimationKey(prev => prev + 1);
                    }}
                  >
                    Unit wise
                  </button>
                  <button
                    type="button"
                    className={`summaries-view-tab${
                      injuredView === 'district'
                        ? ' summaries-view-tab-active'
                        : ''
                    }`}
                    onClick={() => {
                      setInjuredView('district');
                      setInjuredAnimationKey(prev => prev + 1);
                    }}
                  >
                    District wise
                  </button>
                </div>

                {/* Dropdown filter - always visible, changes based on tab, disabled when Monthly is selected */}
                <div className="summaries-filter-group">
                  <label>
                    {injuredView === 'rank' ? 'Select Rank' : 
                     injuredView === 'unit' ? 'Select Unit' : 
                     injuredView === 'district' ? 'Select District' : 'Select'}
                  </label>
                  <select
                    value={
                      injuredView === 'rank' ? (selectedInjuredRank || 'All') :
                      injuredView === 'unit' ? (selectedInjuredUnit || 'All') :
                      injuredView === 'district' ? (selectedInjuredDistrict || 'All') : 'All'
                    }
                    onChange={(e) => {
                      const value = e.target.value === 'All' ? '' : e.target.value;
                      if (injuredView === 'rank') {
                        setSelectedInjuredRank(value);
                      } else if (injuredView === 'unit') {
                        setSelectedInjuredUnit(value);
                      } else if (injuredView === 'district') {
                        setSelectedInjuredDistrict(value);
                      }
                      setInjuredAnimationKey(prev => prev + 1);
                    }}
                    disabled={injuredView === 'monthly'}
                  >
                    {injuredView === 'rank' && (
                      <>
                        <option value="All">All Ranks</option>
                        {Array.from(new Set(injured.map(s => s.rank))).sort().map((rank) => (
                          <option key={rank} value={rank}>
                            {rank}
                          </option>
                        ))}
                      </>
                    )}
                    {injuredView === 'unit' && (
                      <>
                        <option value="All">All Units</option>
                        {Array.from(new Set(injured.map(s => s.unit))).sort().map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </>
                    )}
                    {injuredView === 'district' && (
                      <>
                        <option value="All">All Districts</option>
                        {Array.from(new Set(injured.map(s => s.ro))).sort().map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </>
                    )}
                    {injuredView === 'monthly' && (
                      <option value="All">N/A</option>
                    )}
                  </select>
                </div>
              </div>

              {(!selectedInjuredYear || !injured.length) && (
                <div className="summaries-placeholder">
                  <p className="summaries-placeholder-text">
                    {selectedInjuredYear === 'All' 
                      ? 'No Injured personnel data available.'
                      : 'No Injured personnel data available for the selected year.'}
                  </p>
                </div>
              )}

              {selectedInjuredYear && injured.length > 0 && (
                <>
                  {injuredView === 'monthly' && (
                    <div className="summaries-line-chart">
                      <Line
                        data={{
                          labels: MONTH_LABELS,
                          datasets: [
                            {
                              label: 'Injured per month',
                              data: injuredMonthlyCounts,
                              borderColor: '#4DA6FF',
                              backgroundColor: 'rgba(77, 166, 255, 0.25)',
                              pointBackgroundColor: '#E0F0FF',
                            },
                          ],
                        }}
                        options={{
                          ...lineOptions,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const index = elements[0].index;
                            const monthLabel = chart.data.labels[index];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedInjuredYear,
                                monthLabel,
                                type: 'Mil Injury',
                                returnPath: {
                                  activeTab: 'injured-mil',
                                  view: 'monthly',
                                  yearFilter: injuredYearFilter || 'All',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}

                  {injuredView === 'rank' && isInjuredAnimating && injuredRankData.length > 0 && (
                    <div className="summaries-bar-chart">
                      <Bar
                        ref={injuredRankChartRef}
                        key={`injured-rank-${selectedInjuredYear}-${injuredAnimationKey}-${isInjuredAnimating}`}
                        data={{
                          labels: Object.keys(injuredRankCounts),
                          datasets: [
                            {
                              label: 'Count',
                              data: injuredRankData,
                              backgroundColor: 'rgba(77, 166, 255, 0.9)',
                              borderColor: 'rgba(0, 60, 143, 0.95)',
                              borderWidth: 2,
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          ...barOptionsCommon,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const idx = elements[0].index;
                            const rank = chart.data.labels[idx];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedInjuredYear,
                                rank: selectedInjuredRank || rank,
                                type: 'Mil Injury',
                                returnPath: {
                                  activeTab: 'injured-mil',
                                  view: 'rank',
                                  yearFilter: injuredYearFilter || 'All',
                                  selectedInjuredRank: selectedInjuredRank || '',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}

                  {injuredView === 'unit' && isInjuredAnimating && injuredUnitData.length > 0 && (
                    <div className="summaries-bar-chart">
                      <Bar
                        ref={injuredUnitChartRef}
                        key={`injured-unit-${selectedInjuredYear}-${injuredAnimationKey}-${isInjuredAnimating}`}
                        data={{
                          labels: Object.keys(injuredUnitCounts),
                          datasets: [
                            {
                              label: 'Count',
                              data: injuredUnitData,
                              backgroundColor: 'rgba(77, 166, 255, 0.9)',
                              borderColor: 'rgba(0, 60, 143, 0.95)',
                              borderWidth: 2,
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          ...barOptionsCommon,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const idx = elements[0].index;
                            const unit = chart.data.labels[idx];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedInjuredYear,
                                unit: selectedInjuredUnit || unit,
                                type: 'Mil Injury',
                                returnPath: {
                                  activeTab: 'injured-mil',
                                  view: 'unit',
                                  yearFilter: injuredYearFilter || 'All',
                                  selectedInjuredUnit: selectedInjuredUnit || '',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}

                  {injuredView === 'district' && isInjuredAnimating && injuredDistrictData.length > 0 && (
                    <div className="summaries-bar-chart">
                      <Bar
                        ref={injuredDistrictChartRef}
                        key={`injured-district-${selectedInjuredYear}-${injuredAnimationKey}-${isInjuredAnimating}`}
                        data={{
                          labels: Object.keys(injuredDistrictCounts),
                          datasets: [
                            {
                              label: 'Count',
                              data: injuredDistrictData,
                              backgroundColor: 'rgba(77, 166, 255, 0.9)',
                              borderColor: 'rgba(0, 60, 143, 0.95)',
                              borderWidth: 2,
                              borderRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          ...barOptionsCommon,
                          onClick: (_, elements, chart) => {
                            if (!elements.length) return;
                            const idx = elements[0].index;
                            const ro = chart.data.labels[idx];
                            navigate('/shuhada', {
                              state: {
                                fromSummary: true,
                                year: selectedInjuredYear,
                                ro: selectedInjuredDistrict || ro,
                                type: 'Mil Injury',
                                returnPath: {
                                  activeTab: 'injured-mil',
                                  view: 'district',
                                  yearFilter: injuredYearFilter || 'All',
                                  selectedInjuredDistrict: selectedInjuredDistrict || '',
                                },
                              },
                            });
                          },
                        }}
                        plugins={[valueLabelPlugin]}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ) : activeTab === 'award-holders' ? (
            <div className="summaries-shuhada-mil">
              <div className="summaries-filters-row">
                <div className="summaries-filter-group">
                  <label>Year</label>
                  <select
                    value={awardYearFilter || 'All'}
                    onChange={(e) => {
                      setAwardYearFilter(e.target.value === 'All' ? '' : e.target.value);
                      setAwardAnimationKey(prev => prev + 1);
                    }}
                  >
                    <option value="All">All Years</option>
                    {awardYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="summaries-view-tabs">
                  <button
                    type="button"
                    className="summaries-view-tab summaries-view-tab-active"
                  >
                    Awards wise
                  </button>
                </div>

                {/* Dropdown filter for award */}
                <div className="summaries-filter-group">
                  <label>Select Award</label>
                  <select
                    value={selectedAward || 'All'}
                    onChange={(e) => {
                      setSelectedAward(e.target.value === 'All' ? '' : e.target.value);
                      setAwardAnimationKey(prev => prev + 1);
                    }}
                  >
                    <option value="All">All Awards</option>
                    {Array.from(new Set(
                      awardHolders.flatMap(s => {
                        const awards = s.awards ? s.awards.split(',').map(a => a.trim()) : [];
                        return awards.filter(a => a);
                      })
                    )).sort().map((award) => (
                      <option key={award} value={award}>
                        {award}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(!selectedAwardYear || awardHolders.length === 0) && (
                <div className="summaries-placeholder">
                  <p className="summaries-placeholder-text">
                    {selectedAwardYear === 'All' 
                      ? 'No award holders found.'
                      : 'No award holders found for the selected year.'}
                  </p>
                </div>
              )}

              {selectedAwardYear && awardHolders.length > 0 && isAwardAnimating && awardData.length > 0 && (
                <div className="summaries-bar-chart">
                  <Bar
                    ref={awardChartRef}
                    key={`awards-${selectedAwardYear}-${awardAnimationKey}-${isAwardAnimating}`}
                    data={{
                      labels: Object.keys(awardCounts),
                      datasets: [
                        {
                          label: 'Count',
                          data: awardData,
                          backgroundColor: 'rgba(77, 166, 255, 0.9)',
                          borderColor: 'rgba(0, 60, 143, 0.95)',
                          borderWidth: 2,
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      ...barOptionsCommon,
                      onClick: (_, elements, chart) => {
                        if (!elements.length) return;
                        const idx = elements[0].index;
                        const award = chart.data.labels[idx];
                        navigate('/shuhada', {
                          state: {
                            fromSummary: true,
                            year: selectedAwardYear,
                            awards: selectedAward || award,
                            returnPath: {
                              activeTab: 'award-holders',
                              view: 'awards',
                              yearFilter: awardYearFilter || 'All',
                              selectedAward: selectedAward || '',
                            },
                          },
                        });
                      },
                    }}
                    plugins={[valueLabelPlugin]}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="summaries-placeholder">
              <p className="summaries-placeholder-text">
                This category will be configured later.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Summaries;

