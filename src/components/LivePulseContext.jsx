import React, { createContext, useContext, useState, useEffect } from 'react';
import marketSocket from '../api/marketSocket';

const LivePulseContext = createContext();

export const LivePulseProvider = ({ children }) => {
  const [marketStatus, setMarketStatus] = useState('SYNCING');
  const [pulseData, setPulseData]       = useState({});

  useEffect(() => {
    // Reflect socket connection status
    const timer = setTimeout(() => {
      setMarketStatus(marketSocket.isConnected ? 'LIVE' : 'OFFLINE');
    }, 1500);

    // Subscribe to incoming market events
    const unsub = marketSocket.addListener((data) => {
      if (data?.type === 'market_update') {
        setPulseData(prev => ({ ...prev, ...data.payload }));
      }
      if (data?.type === 'status') {
        setMarketStatus(data.status);
      }
    });

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  return (
    <LivePulseContext.Provider value={{ marketStatus, pulseData }}>
      {children}
    </LivePulseContext.Provider>
  );
};

export const useLivePulse = () => {
  const context = useContext(LivePulseContext);
  if (!context) throw new Error('useLivePulse must be used within a LivePulseProvider');
  return context;
};