/* =========================================================
   OrbitPanel — Signature Cross-Category Shopping Copilot
   =========================================================
   Generates cross-department bundles within a user budget,
   recommends curated mission packs, and provides 1-click cart assembly.
   ========================================================= */
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ALL_PRODUCTS, DEPARTMENTS, formatPrice } from '../data/catalog.js';
import './Orbit.css';

// Preset Missions
const PRESET_MISSIONS = [
  {
    id: 'college_starter',
    title: 'College Dorm & Campus Starter',
    icon: '🎓',
    budgetPaise: 500000, // ₹5,000
    targetDepts: ['fashion', 'electronics', 'grocery'],
    description: 'Everyday campus tee, fast GaN charger, and healthy brain snacks.'
  },
  {
    id: 'wfh_setup',
    title: 'Work From Home Ergonomic Refresh',
    icon: '💼',
    budgetPaise: 2500000, // ₹25,000
    targetDepts: ['home', 'electronics', 'grocery'],
    description: 'Ergonomic seating, USB-C multi-hub, and premium cold brew.'
  },
  {
    id: 'glow_weekend',
    title: 'Weekend Self-Care & Glow Run',
    icon: '✨',
    budgetPaise: 400000, // ₹4,000
    targetDepts: ['beauty', 'fashion', 'grocery'],
    description: 'Hyaluronic serum, dark chocolate almonds, and organic oversized tee.'
  },
  {
    id: 'family_feast',
    title: 'Family Weekend & Kids Joy Pack',
    icon: '🧸',
    budgetPaise: 650000, // ₹6,500
    targetDepts: ['grocery', 'kids', 'home'],
    description: 'STEM building set, organic mangoes, and ambient smart LED lighting.'
  }
];

export default function OrbitPanel() {
  const { toggleOrbit, addToCart, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('copilot'); // 'copilot' | 'bundle'
  const [budgetRupees, setBudgetRupees] = useState(6000);
  const [selectedDepts, setSelectedDepts] = useState(['fashion', 'electronics', 'grocery']);
  const [query, setQuery] = useState('');
  const [generatedBundle, setGeneratedBundle] = useState(null);
  const [copilotHistory, setCopilotHistory] = useState([
    {
      role: 'assistant',
      text: 'Greetings traveler! I am ORBIT, your Multiverse copilot. Tell me your budget and what you need across our 6 departments, or pick a curated Mission Bundle below.'
    }
  ]);

  const toggleDept = (deptId) => {
    setSelectedDepts(prev => 
      prev.includes(deptId) 
        ? (prev.length > 1 ? prev.filter(d => d !== deptId) : prev)
        : [...prev, deptId]
    );
  };

  // Algorithmic cross-department bundle generator
  const handleGenerateBundle = (customBudgetPaise = null, customDepts = null) => {
    const targetBudget = customBudgetPaise || (budgetRupees * 100);
    const deptsToUse = customDepts || selectedDepts;

    // Pick top rated or featured item from each selected department that fits
    let budgetLeft = targetBudget;
    const bundleItems = [];

    deptsToUse.forEach(deptId => {
      const candidates = ALL_PRODUCTS.filter(p => p.department === deptId && p.inStock);
      // Sort candidates by rating descending
      candidates.sort((a, b) => b.rating - a.rating);

      // Find best candidate fitting remaining budget
      const picked = candidates.find(p => p.pricePaise <= budgetLeft && !bundleItems.some(bi => bi.id === p.id)) 
                  || candidates[candidates.length - 1]; // or cheapest available

      if (picked && picked.pricePaise <= budgetLeft) {
        bundleItems.push(picked);
        budgetLeft -= picked.pricePaise;
      }
    });

    const bundleTotalPaise = bundleItems.reduce((acc, item) => acc + item.pricePaise, 0);

    setGeneratedBundle({
      items: bundleItems,
      totalPaise: bundleTotalPaise,
      budgetPaise: targetBudget,
      savedPaise: Math.max(0, targetBudget - bundleTotalPaise),
      departments: [...new Set(bundleItems.map(i => i.department))]
    });
  };

  const handleApplyPreset = (preset) => {
    setBudgetRupees(preset.budgetPaise / 100);
    setSelectedDepts(preset.targetDepts);
    handleGenerateBundle(preset.budgetPaise, preset.targetDepts);
    setActiveTab('bundle');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setQuery('');
    
    // Add user message
    const newHistory = [...copilotHistory, { role: 'user', text: userText }];
    setCopilotHistory(newHistory);

    // Rule-based intelligent copilot response & bundle synthesis
    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();

      // Check for budget extraction
      const numMatch = userText.match(/\d+/);
      let detectedBudget = numMatch ? parseInt(numMatch[0], 10) * 100 : budgetRupees * 100;
      if (detectedBudget < 50000) detectedBudget *= 100; // treat smaller numbers as rupees

      if (lower.includes('student') || lower.includes('college') || lower.includes('dorm')) {
        reply = `Assembled an optimized College Multiverse Kit within ${formatPrice(detectedBudget)}! Combining essential streetwear, high-speed GaN charging, and quick breakfast snacks.`;
        handleGenerateBundle(detectedBudget, ['fashion', 'electronics', 'grocery']);
      } else if (lower.includes('work') || lower.includes('office') || lower.includes('desk') || lower.includes('wfh')) {
        reply = `Configuring your ergonomic workstation across The Grid, The Sanctuary, and The Dailyverse!`;
        handleGenerateBundle(detectedBudget, ['home', 'electronics', 'grocery']);
      } else if (lower.includes('beauty') || lower.includes('glow') || lower.includes('skincare')) {
        reply = `Cross-referencing The Lab with The Runway and The Dailyverse for an all-around aesthetic glow pack.`;
        handleGenerateBundle(detectedBudget, ['beauty', 'fashion', 'grocery']);
      } else {
        reply = `Synthesized a cross-multiverse bundle across ${selectedDepts.length} departments calibrated to ${formatPrice(detectedBudget)}. Check the bundle breakdown!`;
        handleGenerateBundle(detectedBudget, selectedDepts);
      }

      setCopilotHistory(prev => [...prev, { role: 'assistant', text: reply }]);
      setActiveTab('bundle');
    }, 400);
  };

  const handleAddAllToCart = () => {
    if (!generatedBundle || generatedBundle.items.length === 0) return;
    generatedBundle.items.forEach(item => {
      addToCart(item.id);
    });
    addToast(`Added ${generatedBundle.items.length} cross-department items to your unified cart!`, 'success', 3500);
  };

  return (
    <div className="orbit-overlay animate-fade-in" onClick={toggleOrbit} role="dialog" aria-modal="true" aria-labelledby="orbit-title">
      <div className="orbit-panel glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="orbit-header">
          <div className="orbit-title-wrap">
            <span className="orbit-avatar">◈</span>
            <div>
              <h2 id="orbit-title" className="orbit-title">ORBIT Copilot</h2>
              <p className="orbit-tagline">Cross-Department Multiverse Engine</p>
            </div>
          </div>
          <button className="orbit-close-btn" onClick={toggleOrbit} aria-label="Close ORBIT">✕</button>
        </div>

        {/* Navigation Tabs */}
        <div className="orbit-tabs">
          <button 
            className={`orbit-tab ${activeTab === 'copilot' ? 'active' : ''}`}
            onClick={() => setActiveTab('copilot')}
          >
            💬 Assistant & Missions
          </button>
          <button 
            className={`orbit-tab ${activeTab === 'bundle' ? 'active' : ''}`}
            onClick={() => {
              if (!generatedBundle) handleGenerateBundle();
              setActiveTab('bundle');
            }}
          >
            ⚡ Bundle Synthesizer {generatedBundle ? `(${generatedBundle.items.length})` : ''}
          </button>
        </div>

        {/* Tab 1: Copilot & Presets */}
        {activeTab === 'copilot' && (
          <div className="orbit-tab-content">
            {/* Conversation Log */}
            <div className="orbit-messages">
              {copilotHistory.map((msg, i) => (
                <div key={i} className={`orbit-bubble ${msg.role}`}>
                  {msg.role === 'assistant' && <span className="bubble-icon">◈</span>}
                  <div className="bubble-text">{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Bar */}
            <form onSubmit={handleSendMessage} className="orbit-input-bar">
              <input
                type="text"
                placeholder="e.g., 'Student pack under ₹5,000' or 'WFH setup'..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Ask ORBIT"
              />
              <button type="submit" className="btn btn-primary btn-sm">Ask ORBIT</button>
            </form>

            {/* Curated Mission Presets */}
            <div className="orbit-presets-section">
              <h4 className="presets-title">🌟 Curated Cross-Multiverse Missions</h4>
              <div className="presets-grid">
                {PRESET_MISSIONS.map(preset => (
                  <div 
                    key={preset.id} 
                    className="preset-card glass-card"
                    onClick={() => handleApplyPreset(preset)}
                  >
                    <div className="preset-card-top">
                      <span className="preset-icon">{preset.icon}</span>
                      <span className="preset-budget">Max {formatPrice(preset.budgetPaise)}</span>
                    </div>
                    <h5 className="preset-name">{preset.title}</h5>
                    <p className="preset-desc">{preset.description}</p>
                    <div className="preset-depts">
                      {preset.targetDepts.map(d => (
                        <span key={d} className="badge badge-cyan">{d}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Custom Bundle Synthesizer */}
        {activeTab === 'bundle' && (
          <div className="orbit-tab-content">
            <div className="bundle-controls glass-card">
              <div className="budget-slider-row">
                <div className="slider-label">
                  <span>Target Budget:</span>
                  <strong>{formatPrice(budgetRupees * 100)}</strong>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="40000"
                  step="500"
                  value={budgetRupees}
                  onChange={e => setBudgetRupees(Number(e.target.value))}
                  className="budget-slider"
                />
              </div>

              <div className="dept-selector-row">
                <span className="selector-title">Multiverse Portals to Combine:</span>
                <div className="dept-tags-grid">
                  {DEPARTMENTS.map(dept => {
                    const active = selectedDepts.includes(dept.id);
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        className={`dept-tag-btn ${active ? 'active' : ''}`}
                        style={{ '--dept-color': dept.color }}
                        onClick={() => toggleDept(dept.id)}
                      >
                        {dept.icon} {dept.subtitle}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                type="button" 
                className="btn btn-primary synth-btn"
                onClick={() => handleGenerateBundle()}
              >
                ⚡ Synthesize Cross-Multiverse Bundle
              </button>
            </div>

            {/* Generated Bundle Result */}
            {generatedBundle && (
              <div className="generated-bundle-result animate-fade-in">
                <div className="bundle-summary-bar">
                  <div>
                    <span className="bundle-count">{generatedBundle.items.length} Cross-Category Items</span>
                    <div className="bundle-savings">
                      Unused Budget: <strong>{formatPrice(generatedBundle.savedPaise)}</strong>
                    </div>
                  </div>
                  <div className="bundle-total-wrap">
                    <span className="total-label">Bundle Total</span>
                    <span className="total-val">{formatPrice(generatedBundle.totalPaise)}</span>
                  </div>
                </div>

                <div className="bundle-items-list">
                  {generatedBundle.items.map(item => (
                    <div key={item.id} className="bundle-item-row">
                      <span className="item-dept-badge">{item.department}</span>
                      <div className="item-info">
                        <strong className="item-name">{item.name}</strong>
                        <span className="item-cat">{item.category} • ★ {item.rating.toFixed(1)}</span>
                      </div>
                      <span className="item-price">{formatPrice(item.pricePaise)}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className="btn btn-primary add-all-btn"
                  onClick={handleAddAllToCart}
                >
                  🛒 Add Entire Bundle To Unified Cart ({formatPrice(generatedBundle.totalPaise)})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
