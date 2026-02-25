import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // 1. IMPORT YOUR THEME HOOK
import api from '../api/axiosConfig';
import { Zap, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Activity, ShieldCheck, Box } from 'lucide-react';

const LiveMarketPage = () => {
    const { token } = useContext(AuthContext);
    const { isDark } = useTheme(); // 2. CONSUME THE THEME STATE

    const [history, setHistory] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [stocks, setStocks] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                const res = await api.get('/portfolio/history');
                setHistory(res.data);
                if (res.data.length > 0) initializeStocks(res.data[0].holdings);
            } catch (err) { console.error("VAULT_OFFLINE"); }
        };
        fetchVault();
    }, []);

    const initializeStocks = (holdingsData) => {
        try {
            let tickers = typeof holdingsData === 'string' ? JSON.parse(holdingsData) : holdingsData;
            if (typeof tickers === 'string') tickers = JSON.parse(tickers);
            setStocks(tickers.map(t => ({ 
                ticker: t, 
                price: Math.floor(Math.random() * 2000) + 500, 
                change: 0.00 
            })));
        } catch (e) { setStocks([]); }
    };

    useEffect(() => {
        if (!token) return;
        const ws = new WebSocket(`ws://localhost:8000/ws/pulse?token=${token}`);
        ws.onopen = () => setIsConnected(true);
        ws.onmessage = () => {
            setStocks(prev => prev.map(s => {
                const move = (Math.random() - 0.5) * 12;
                return { ...s, price: parseFloat((s.price + move).toFixed(2)), change: parseFloat(move.toFixed(2)) };
            }));
        };
        ws.onclose = () => setIsConnected(false);
        return () => ws.close();
    }, [token, currentIndex]);

    const navigate = (dir) => {
        let newIdx = currentIndex + dir;
        if (newIdx >= 0 && newIdx < history.length) {
            setCurrentIndex(newIdx);
            initializeStocks(history[newIdx].holdings);
        }
    };

    const activeNode = history[currentIndex];

    // 3. APPLY THEME-BASED DYNAMIC STYLES
    return (
        <div style={viewportWrapper(isDark)}>
            <div style={compactTerminal(isDark)}>
                <header style={headerSection(isDark)}>
                    <div style={navRow}>
                        <button 
                            onClick={() => navigate(1)} 
                            disabled={currentIndex === history.length - 1}
                            style={navBtn(currentIndex === history.length - 1)}
                        >
                            <ChevronLeft size={24}/> <span style={{fontSize: '1.1rem'}}>PREVIOUS</span>
                        </button>

                        <div style={nodeDisplay(isDark)}>
                            <Box size={22} color="var(--accent-primary)" />
                            <span style={nodeTitle(isDark)}>{activeNode ? activeNode.goal : 'CORE_SYNCING...'}</span>
                        </div>

                        <button 
                            onClick={() => navigate(-1)} 
                            disabled={currentIndex === 0}
                            style={navBtn(currentIndex === 0)}
                        >
                            <span style={{fontSize: '1.1rem'}}>NEXT</span> <ChevronRight size={24}/>
                        </button>
                    </div>

                    <div style={statusRow}>
                        <div style={statusBadge(isConnected)}>
                            <Activity size={20} /> {isConnected ? 'LIVE_UPLINK_ACTIVE' : 'OFFLINE'}
                        </div>
                        <div style={riskBadge(isDark)}>
                            <ShieldCheck size={20} /> EXPOSURE: {activeNode?.risk_score || 0}%
                        </div>
                        <div style={counterTag}>{currentIndex + 1} / {history.length}</div>
                    </div>
                </header>

                <main style={scrollArea}>
                    <div style={gridStyle}>
                        {stocks.map((stock, i) => (
                            <div key={i} style={stockCard(stock.change >= 0, isDark)}>
                                <div style={cardHeader}>
                                    <span style={tickerName}>{stock.ticker}</span>
                                    <Zap size={24} color={stock.change >= 0 ? "#10b981" : "#ef4444"} />
                                </div>
                                <div style={priceContainer}>
                                    <span style={priceLabel(isDark)}>LAST_TRADED_PRICE</span>
                                    <span style={priceText(isDark)}>₹{stock.price.toLocaleString()}</span>
                                </div>
                                <div style={changeRow(stock.change >= 0)}>
                                    {stock.change >= 0 ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
                                    <span>{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

/* --- Visual Styles (Refactored for Theme Variables) --- */
const viewportWrapper = (isDark) => ({ 
    height: 'calc(100vh - 80px)', 
    background: 'var(--bg-primary)', 
    display: 'flex', 
    justifyContent: 'center', 
    padding: '30px', 
    boxSizing: 'border-box', 
    overflow: 'hidden' 
});

const compactTerminal = (isDark) => ({ 
    width: '100%', 
    maxWidth: '1300px', 
    height: '100%', 
    background: 'var(--nav-bg)', 
    borderRadius: '24px', 
    border: '2px solid var(--surface-border)', 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden', 
    boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.1)' 
});

const headerSection = (isDark) => ({ 
    padding: '1.5rem 2.5rem', 
    borderBottom: '2px solid var(--surface-border)', 
    flexShrink: 0,
    background: 'var(--bg-secondary, transparent)'
});

const navRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' };
const navBtn = (dis) => ({ 
    background: 'none', 
    border: 'none', 
    color: dis ? 'var(--text-muted)' : 'var(--accent-primary)', 
    cursor: dis ? 'default' : 'pointer', 
    fontWeight: 900, 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    fontFamily: 'monospace'
});

const nodeDisplay = (isDark) => ({ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px', 
    background: 'var(--bg-input)', 
    padding: '10px 20px', 
    borderRadius: '10px', 
    border: '1px solid var(--surface-border)' 
});

const nodeTitle = (isDark) => ({ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' });

const statusRow = { display: 'flex', gap: '3rem', alignItems: 'center' };
const statusBadge = (on) => ({ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    fontSize: '0.9rem', 
    fontWeight: 900, 
    color: on ? '#10b981' : '#ef4444' 
});

const riskBadge = (isDark) => ({ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    fontSize: '0.9rem', 
    fontWeight: 900, 
    color: 'var(--text-muted)' 
});

const counterTag = { 
    marginLeft: 'auto', 
    fontSize: '0.9rem', 
    color: 'var(--accent-primary)', 
    background: 'rgba(16,185,129,0.1)', 
    padding: '4px 14px', 
    borderRadius: '8px',
    fontWeight: 900
};

const scrollArea = { flex: 1, padding: '2.5rem', overflowY: 'auto' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' };

const stockCard = (up, isDark) => ({ 
    padding: '2rem', 
    background: 'var(--bg-input)', 
    border: '1px solid var(--surface-border)', 
    borderRadius: '20px', 
    borderLeft: `6px solid ${up ? '#10b981' : '#ef4444'}`,
    color: 'var(--text-primary)'
});

const cardHeader = { display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' };
const tickerName = { fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'monospace' };
const priceContainer = { display: 'flex', flexDirection: 'column', marginBottom: '1rem' };
const priceLabel = (isDark) => ({ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 });
const priceText = (isDark) => ({ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace' });
const changeRow = (up) => ({ color: up ? '#10b981' : '#ef4444', fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' });

export default LiveMarketPage;