import { useState, useEffect } from 'react';
import { binanceAPI } from '../api/binanceService';
import { analyzeMarket, FullAnalysis, CandleData } from '../utils/indicators';

export interface ScanResult {
  symbol: string;
  analysis: FullAnalysis;
  timestamp: number;
}

export function useMarketScanner(symbols: string[] = [], interval: string = '1h') {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [lastScan, setLastScan] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultSymbols = [
    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
    'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
    'LINKUSDT', 'UNIUSDT', 'ATOMUSDT', 'FILUSDT', 'NEARUSDT', 'APTUSDT'
  ];

  const scanSymbols = symbols.length > 0 ? symbols : defaultSymbols;

  const scan = async () => {
    setScanning(true);
    setError(null);
    const scanResults: ScanResult[] = [];

    try {
      for (const symbol of scanSymbols) {
        try {
          // Get kline data
          const klines = await binanceAPI.getKlines(symbol, interval, 100);
          
          // Convert to CandleData format
          const candles: CandleData[] = klines.map(k => ({
            open: parseFloat(k.open),
            high: parseFloat(k.high),
            low: parseFloat(k.low),
            close: parseFloat(k.close),
            volume: parseFloat(k.volume),
            timestamp: k.openTime,
          }));

          // Analyze market
          const analysis = analyzeMarket(candles, symbol);
          
          scanResults.push({
            symbol,
            analysis,
            timestamp: Date.now(),
          });

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.error(`Error scanning ${symbol}:`, err);
        }
      }

      // Sort by confidence
      scanResults.sort((a, b) => b.analysis.confidence - a.analysis.confidence);
      
      setResults(scanResults);
      setLastScan(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  // Auto scan every 5 minutes
  useEffect(() => {
    scan();
    const intervalId = setInterval(scan, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const strongBuySignals = results.filter(r => r.analysis.overallSignal === 'STRONG_BUY');
  const buySignals = results.filter(r => r.analysis.overallSignal === 'BUY');
  const sellSignals = results.filter(r => r.analysis.overallSignal === 'SELL' || r.analysis.overallSignal === 'STRONG_SELL');
  const neutralSignals = results.filter(r => r.analysis.overallSignal === 'NEUTRAL');

  return {
    scanning,
    results,
    lastScan,
    error,
    scan,
    strongBuySignals,
    buySignals,
    sellSignals,
    neutralSignals,
  };
}
