import { useState, useEffect, useCallback, useRef } from 'react';
import { binanceAPI } from '../api/binanceService';
import { WsTicker, WsKline, WsTrade, WsDepth, BinanceTicker, BinanceKline } from '../api/binance';

/**
 * Hook for fetching all ticker prices
 */
export function useAllPrices() {
  const [prices, setPrices] = useState<{ symbol: string; price: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await binanceAPI.getAllPrices();
      setPrices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}

/**
 * Hook for fetching 24hr ticker statistics
 */
export function use24hrTicker(symbol?: string) {
  const [ticker, setTicker] = useState<BinanceTicker | BinanceTicker[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicker = useCallback(async () => {
    try {
      setLoading(true);
      const data = await binanceAPI.get24hrTicker(symbol);
      setTicker(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticker');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchTicker]);

  return { ticker, loading, error, refetch: fetchTicker };
}

/**
 * Hook for fetching kline/candlestick data
 */
export function useKlines(symbol: string, interval: string = '1h', limit: number = 100) {
  const [klines, setKlines] = useState<BinanceKline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKlines = useCallback(async () => {
    try {
      setLoading(true);
      const data = await binanceAPI.getKlines(symbol, interval, limit);
      setKlines(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch klines');
    } finally {
      setLoading(false);
    }
  }, [symbol, interval, limit]);

  useEffect(() => {
    fetchKlines();
  }, [fetchKlines]);

  return { klines, loading, error, refetch: fetchKlines };
}

/**
 * Hook for WebSocket ticker subscription
 */
export function useWsTicker(symbol: string) {
  const [ticker, setTicker] = useState<WsTicker | null>(null);
  const [connected, setConnected] = useState(false);
  const streamName = `${symbol.toLowerCase()}@ticker`;

  useEffect(() => {
    binanceAPI.setOnStatusChange(() => {
      const status = binanceAPI.getWebSocketStatus(streamName) as string;
      setConnected(status === 'connected');
    });

    const unsubscribe = binanceAPI.subscribeTicker(symbol, (data) => {
      setTicker(data);
      setConnected(true);
    });

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, [symbol, streamName]);

  return { ticker, connected };
}

/**
 * Hook for WebSocket kline subscription
 */
export function useWsKline(symbol: string, interval: string = '1m') {
  const [kline, setKline] = useState<WsKline | null>(null);
  const [klines, setKlines] = useState<WsKline[]>([]);
  const [connected, setConnected] = useState(false);
  const streamName = `${symbol.toLowerCase()}@kline_${interval}`;

  useEffect(() => {
    binanceAPI.setOnStatusChange(() => {
      const status = binanceAPI.getWebSocketStatus(streamName) as string;
      setConnected(status === 'connected');
    });

    const unsubscribe = binanceAPI.subscribeKline(symbol, interval, (data) => {
      setKline(data);
      setKlines(prev => {
        const newKlines = [...prev, data];
        if (newKlines.length > 100) newKlines.shift();
        return newKlines;
      });
      setConnected(true);
    });

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, [symbol, interval, streamName]);

  return { kline, klines, connected };
}

/**
 * Hook for WebSocket trade subscription
 */
export function useWsTrade(symbol: string) {
  const [trades, setTrades] = useState<WsTrade[]>([]);
  const [connected, setConnected] = useState(false);
  const streamName = `${symbol.toLowerCase()}@trade`;

  useEffect(() => {
    binanceAPI.setOnStatusChange(() => {
      const status = binanceAPI.getWebSocketStatus(streamName) as string;
      setConnected(status === 'connected');
    });

    const unsubscribe = binanceAPI.subscribeTrade(symbol, (data) => {
      setTrades(prev => {
        const newTrades = [data, ...prev];
        if (newTrades.length > 50) newTrades.pop();
        return newTrades;
      });
      setConnected(true);
    });

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, [symbol, streamName]);

  return { trades, connected };
}

/**
 * Hook for WebSocket depth subscription
 */
export function useWsDepth(symbol: string) {
  const [depth, setDepth] = useState<WsDepth | null>(null);
  const [connected, setConnected] = useState(false);
  const streamName = `${symbol.toLowerCase()}@depth`;

  useEffect(() => {
    binanceAPI.setOnStatusChange(() => {
      const status = binanceAPI.getWebSocketStatus(streamName) as string;
      setConnected(status === 'connected');
    });

    const unsubscribe = binanceAPI.subscribeDepth(symbol, (data) => {
      setDepth(data);
      setConnected(true);
    });

    return () => {
      unsubscribe();
      setConnected(false);
    };
  }, [symbol, streamName]);

  return { depth, connected };
}

/**
 * Hook for all tickers WebSocket subscription
 */
export function useAllTickers() {
  const [tickers, setTickers] = useState<WsTicker[]>([]);
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');

  useEffect(() => {
    // Set up status change listener
    binanceAPI.setOnStatusChange(() => {
      const status = binanceAPI.getWebSocketStatus('!ticker@arr') as string;
      setConnectionStatus(status as any);
      setConnected(status === 'connected');
    });

    const unsubscribe = binanceAPI.subscribeAllTickers((data) => {
      if (Array.isArray(data)) {
        setTickers(data);
        setConnected(true);
        setConnectionStatus('connected');
      }
    });

    return () => {
      unsubscribe();
      setConnected(false);
      setConnectionStatus('disconnected');
    };
  }, []);

  const reconnect = () => {
    setConnectionStatus('connecting');
    // The auto-reconnect mechanism will handle this
  };

  return { tickers, connected, connectionStatus, reconnect };
}

/**
 * Hook for API connection status
 */
export function useConnectionStatus() {
  const [connected, setConnected] = useState(false);
  const [serverTime, setServerTime] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    setChecking(true);
    try {
      const isAlive = await binanceAPI.ping();
      setConnected(isAlive);
      
      if (isAlive) {
        const time = await binanceAPI.getServerTime();
        setServerTime(time);
      }
    } catch (error) {
      setConnected(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkConnection]);

  return { connected, serverTime, checking, refetch: checkConnection };
}

/**
 * Hook for account balance (requires API credentials)
 */
export function useAccountBalance() {
  const [balances, setBalances] = useState<{ asset: string; free: string; locked: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      const accountInfo = await binanceAPI.getAccountInfo();
      setBalances(accountInfo.balances.filter(b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  }, []);

  return { balances, loading, error, refetch: fetchBalance };
}
