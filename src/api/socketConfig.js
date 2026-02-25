/**
 * marketSocket.js
 * Authenticated WebSocket client for real-time market pulse data.
 * Supports auto-reconnect, heartbeat, and multi-listener dispatch.
 */

class MarketSocket {
  constructor() {
    this.socket            = null;
    this.listeners         = new Set();
    this.url               = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws/pulse';
    this.reconnectTimeout  = null;
    this.heartbeatInterval = null;
    this._manualClose      = false;
    this._reconnectDelay   = 5000;   // ms before retry
    this._heartbeatDelay   = 30000;  // ms between pings
  }

  /* ─────────────────────────────────────────
     CONNECTION
  ───────────────────────────────────────── */

  connect() {
    const token = localStorage.getItem('token');

    if (this.socket?.readyState === WebSocket.OPEN) return;

    if (!token) {
      console.warn('[MarketSocket] SOCKET_DENIED: No identity token found.');
      return;
    }

    this._manualClose = false;
    this.socket = new WebSocket(`${this.url}?token=${token}`);

    this.socket.onopen = () => {
      console.log('[MarketSocket] ✅ MARKET_PULSE_ESTABLISHED');
      this.startHeartbeat();
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Skip pong frames — only dispatch real market events
        if (data?.type === 'pong') return;
        this.listeners.forEach((cb) => cb(data));
      } catch (err) {
        console.error('[MarketSocket] PULSE_PARSE_ERROR:', err);
      }
    };

    this.socket.onclose = (event) => {
      this.stopHeartbeat();
      if (!this._manualClose && event.code !== 1000) {
        console.warn(`[MarketSocket] ⚠️ CLOSED (code ${event.code}). Reconnecting in ${this._reconnectDelay / 1000}s...`);
        this._scheduleReconnect();
      }
    };

    this.socket.onerror = (err) => {
      console.error('[MarketSocket] SOCKET_CRITICAL_FAILURE:', err);
      // onerror is always followed by onclose — let onclose handle reconnect
      this.socket?.close();
    };
  }

  disconnect() {
    this._manualClose = true;
    this.stopHeartbeat();
    this._cancelReconnect();
    if (this.socket) {
      this.socket.close(1000, 'User logout');
      this.socket = null;
    }
    console.log('[MarketSocket] 🔌 DISCONNECTED');
  }

  /* ─────────────────────────────────────────
     HEARTBEAT
  ───────────────────────────────────────── */

  startHeartbeat() {
    this.stopHeartbeat(); // clear any stale interval first
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, this._heartbeatDelay);
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }

  /* ─────────────────────────────────────────
     RECONNECT
  ───────────────────────────────────────── */

  _scheduleReconnect() {
    if (this.reconnectTimeout) return; // already pending
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, this._reconnectDelay);
  }

  _cancelReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /* ─────────────────────────────────────────
     SUBSCRIPTIONS
  ───────────────────────────────────────── */

  /**
   * Subscribe to live ticker updates.
   * @param {string[]} tickers — e.g. ['RELIANCE.NS', 'TCS.NS']
   */
  subscribe(tickers) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action: 'subscribe', tickers }));
    } else {
      console.error('[MarketSocket] SUBSCRIBE_FAILED: Socket not ready.');
    }
  }

  /**
   * Unsubscribe from ticker updates.
   * @param {string[]} tickers
   */
  unsubscribe(tickers) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action: 'unsubscribe', tickers }));
    }
  }

  /* ─────────────────────────────────────────
     LISTENER MANAGEMENT
  ───────────────────────────────────────── */

  /**
   * Register a data handler. Returns a cleanup function for useEffect.
   * @param {Function} callback — receives parsed JSON market data
   * @returns {Function} unsubscribe
   *
   * Usage in React:
   *   useEffect(() => marketSocket.addListener(setData), []);
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Remove all listeners — useful on full app unmount.
   */
  clearListeners() {
    this.listeners.clear();
  }

  /* ─────────────────────────────────────────
     STATUS HELPERS
  ───────────────────────────────────────── */

  get isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  get status() {
    if (!this.socket) return 'OFFLINE';
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN:       return 'LIVE';
      case WebSocket.CLOSING:    return 'CLOSING';
      case WebSocket.CLOSED:     return 'OFFLINE';
      default:                   return 'UNKNOWN';
    }
  }
}

/* Singleton — one connection shared across the whole app */
const marketSocket = new MarketSocket();
export default marketSocket;