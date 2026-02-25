import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, TrendingDown, RefreshCcw, Search } from 'lucide-react';

const SentimentNode = () => {
  const [news, setNews] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockNews = [
    { id: 1, ticker: 'RELIANCE', headline: 'Reliance expands green energy footprint in Gujarat.', sentiment: 0.8 },
    { id: 2, ticker: 'TCS', headline: 'TCS quarterly profits beat street expectations.', sentiment: 0.6 },
    { id: 3, ticker: 'HDFCBANK', headline: 'Regulatory concerns impact banking sector outlook.', sentiment: -0.4 },
    { id: 4, ticker: 'ZOMATO', headline: 'Zomato hits all-time high as delivery volumes surge.', sentiment: 0.9 },
  ];

  useEffect(() => {
    setNews(mockNews);
  }, []);

  const getSentimentLabel = (score) => {
    if (score > 0.3) return { label: 'BULLISH', color: 'var(--accent-primary)' };
    if (score < -0.3) return { label: 'BEARISH', color: '#ef4444' };
    return { label: 'NEUTRAL', color: 'var(--text-muted)' };
  };

  return (
    <div className="reveal-node" style={{ padding: '2.5rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            <Newspaper size={24} color="var(--accent-primary)" /> Sentiment_Terminal
          </h2>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            NODE: NLP_INFERENCE_ENGINE // CORPUS: GLOBAL_FINANCE_API
          </p>
        </div>
        <button 
          onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1000); }}
          style={{ background: 'none', border: '1px solid var(--surface-border)', padding: '0.6rem', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          <RefreshCcw size={16} className={isRefreshing ? 'spin-anim' : ''} />
        </button>
      </div>

      {/* ── Sentiment Grid ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {news.map((item) => {
          const status = getSentimentLabel(item.sentiment);
          return (
            <div key={item.id} style={{ 
              padding: '1.5rem', background: 'var(--surface-glass)', 
              border: '1px solid var(--surface-border)', borderRadius: '16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem 0.8rem', background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)', borderRadius: '8px', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 900 }}>
                  {item.ticker}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.headline}</h4>
                  <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--text-muted)' }}>SOURCE: REUTERS_TERMINAL // 5m ago</p>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ color: status.color, fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  {item.sentiment > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                  {status.label}
                </div>
                <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  CONFIDENCE: 94.2%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .spin-anim { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SentimentNode;