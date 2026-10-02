/**
 * Teknik İndikatör Hesaplama Fonksiyonları
 * Tüm indikatörler gerçek fiyat verileriyle hesaplanır
 */

export interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export interface IndicatorResult {
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number; // 0-100
}

// ==================== RSI (Relative Strength Index) ====================
export function calculateRSI(candles: CandleData[], period: number = 14): IndicatorResult {
  if (candles.length < period + 1) {
    return { value: 50, signal: 'neutral', strength: 0 };
  }

  const changes = candles.slice(1).map((c, i) => c.close - candles[i].close);
  const gains = changes.map(c => c > 0 ? c : 0);
  const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (rsi < 30) {
    signal = 'buy';
    strength = Math.min(100, (30 - rsi) * 3);
  } else if (rsi > 70) {
    signal = 'sell';
    strength = Math.min(100, (rsi - 70) * 3);
  } else if (rsi < 40) {
    signal = 'buy';
    strength = 30;
  } else if (rsi > 60) {
    signal = 'sell';
    strength = 30;
  }

  return { value: rsi, signal, strength };
}

// ==================== MACD (Moving Average Convergence Divergence) ====================
export function calculateMACD(
  candles: CandleData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): IndicatorResult {
  if (candles.length < slowPeriod + signalPeriod) {
    return { value: 0, signal: 'neutral', strength: 0 };
  }

  const closes = candles.map(c => c.close);
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);
  const macdLine = fastEMA - slowEMA;

  // Calculate signal line
  const macdValues: number[] = [];
  for (let i = slowPeriod; i < closes.length; i++) {
    const fast = calculateEMA(closes.slice(0, i + 1), fastPeriod);
    const slow = calculateEMA(closes.slice(0, i + 1), slowPeriod);
    macdValues.push(fast - slow);
  }

  const signalLine = calculateEMA(macdValues, signalPeriod);
  const histogram = macdLine - signalLine;

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (histogram > 0 && macdLine > 0) {
    signal = 'buy';
    strength = Math.min(100, Math.abs(histogram) * 10);
  } else if (histogram < 0 && macdLine < 0) {
    signal = 'sell';
    strength = Math.min(100, Math.abs(histogram) * 10);
  }

  return { value: histogram, signal, strength };
}

// ==================== EMA (Exponential Moving Average) ====================
export function calculateEMA(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1] || 0;

  const multiplier = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < data.length; i++) {
    ema = (data[i] - ema) * multiplier + ema;
  }

  return ema;
}

// ==================== Bollinger Bands ====================
export function calculateBollingerBands(
  candles: CandleData[],
  period: number = 20,
  stdDev: number = 2
): { upper: number; middle: number; lower: number; signal: 'buy' | 'sell' | 'neutral'; strength: number } {
  if (candles.length < period) {
    return { upper: 0, middle: 0, lower: 0, signal: 'neutral', strength: 0 };
  }

  const closes = candles.slice(-period).map(c => c.close);
  const middle = closes.reduce((a, b) => a + b, 0) / period;
  
  const variance = closes.reduce((sum, c) => sum + Math.pow(c - middle, 2), 0) / period;
  const standardDeviation = Math.sqrt(variance);

  const upper = middle + (standardDeviation * stdDev);
  const lower = middle - (standardDeviation * stdDev);
  const currentPrice = candles[candles.length - 1].close;

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (currentPrice <= lower) {
    signal = 'buy';
    strength = Math.min(100, ((lower - currentPrice) / lower) * 1000);
  } else if (currentPrice >= upper) {
    signal = 'sell';
    strength = Math.min(100, ((currentPrice - upper) / upper) * 1000);
  }

  return { upper, middle, lower, signal, strength };
}

// ==================== Stochastic Oscillator ====================
export function calculateStochastic(
  candles: CandleData[],
  kPeriod: number = 14,
  dPeriod: number = 3
): { k: number; d: number; signal: 'buy' | 'sell' | 'neutral'; strength: number } {
  if (candles.length < kPeriod) {
    return { k: 50, d: 50, signal: 'neutral', strength: 0 };
  }

  const recentCandles = candles.slice(-kPeriod);
  const highestHigh = Math.max(...recentCandles.map(c => c.high));
  const lowestLow = Math.min(...recentCandles.map(c => c.low));
  const currentClose = candles[candles.length - 1].close;

  const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;

  // Calculate %D (SMA of %K)
  const kValues: number[] = [];
  for (let i = candles.length - dPeriod; i < candles.length; i++) {
    const periodCandles = candles.slice(i - kPeriod + 1, i + 1);
    const hh = Math.max(...periodCandles.map(c => c.high));
    const ll = Math.min(...periodCandles.map(c => c.low));
    kValues.push(((candles[i].close - ll) / (hh - ll)) * 100);
  }
  const d = kValues.reduce((a, b) => a + b, 0) / kValues.length;

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (k < 20 && d < 20) {
    signal = 'buy';
    strength = Math.min(100, (20 - k) * 3);
  } else if (k > 80 && d > 80) {
    signal = 'sell';
    strength = Math.min(100, (k - 80) * 3);
  }

  return { k, d, signal, strength };
}

// ==================== ATR (Average True Range) ====================
export function calculateATR(candles: CandleData[], period: number = 14): number {
  if (candles.length < period + 1) return 0;

  const trueRanges: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trueRanges.push(tr);
  }

  let atr = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < trueRanges.length; i++) {
    atr = (atr * (period - 1) + trueRanges[i]) / period;
  }

  return atr;
}

// ==================== ADX (Average Directional Index) ====================
export function calculateADX(candles: CandleData[], period: number = 14): { adx: number; plusDI: number; minusDI: number; signal: 'buy' | 'sell' | 'neutral'; strength: number } {
  if (candles.length < period * 2) {
    return { adx: 0, plusDI: 0, minusDI: 0, signal: 'neutral', strength: 0 };
  }

  const plusDM: number[] = [];
  const minusDM: number[] = [];
  const tr: number[] = [];

  for (let i = 1; i < candles.length; i++) {
    const highDiff = candles[i].high - candles[i - 1].high;
    const lowDiff = candles[i - 1].low - candles[i].low;

    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);

    const trueRange = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close)
    );
    tr.push(trueRange);
  }

  const smoothPlusDM = calculateEMA(plusDM, period);
  const smoothMinusDM = calculateEMA(minusDM, period);
  const smoothTR = calculateEMA(tr, period);

  const plusDI = (smoothPlusDM / smoothTR) * 100;
  const minusDI = (smoothMinusDM / smoothTR) * 100;
  const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
  const adx = dx;

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (adx > 25) {
    if (plusDI > minusDI) {
      signal = 'buy';
      strength = Math.min(100, adx * 2);
    } else {
      signal = 'sell';
      strength = Math.min(100, adx * 2);
    }
  }

  return { adx, plusDI, minusDI, signal, strength };
}

// ==================== Volume Analysis ====================
export function calculateVolumeSignal(candles: CandleData[], period: number = 20): IndicatorResult {
  if (candles.length < period) {
    return { value: 0, signal: 'neutral', strength: 0 };
  }

  const volumes = candles.slice(-period).map(c => c.volume);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / period;
  const currentVolume = candles[candles.length - 1].volume;
  const priceChange = candles[candles.length - 1].close - candles[candles.length - 2].close;

  const volumeRatio = currentVolume / avgVolume;

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (volumeRatio > 1.5) {
    if (priceChange > 0) {
      signal = 'buy';
      strength = Math.min(100, (volumeRatio - 1) * 50);
    } else {
      signal = 'sell';
      strength = Math.min(100, (volumeRatio - 1) * 50);
    }
  }

  return { value: volumeRatio, signal, strength };
}

// ==================== Fibonacci Retracement ====================
export function calculateFibonacci(candles: CandleData[]): { level: number; signal: 'buy' | 'sell' | 'neutral'; strength: number } {
  if (candles.length < 20) {
    return { level: 0, signal: 'neutral', strength: 0 };
  }

  const recentCandles = candles.slice(-50);
  const highestHigh = Math.max(...recentCandles.map(c => c.high));
  const lowestLow = Math.min(...recentCandles.map(c => c.low));
  const currentPrice = candles[candles.length - 1].close;

  const diff = highestHigh - lowestLow;
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  
  let closestLevel = 0;
  let minDistance = Infinity;

  for (const level of fibLevels) {
    const price = lowestLow + (diff * level);
    const distance = Math.abs(currentPrice - price);
    if (distance < minDistance) {
      minDistance = distance;
      closestLevel = level;
    }
  }

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (closestLevel === 0.618 || closestLevel === 0.5) {
    signal = 'buy';
    strength = 70;
  } else if (closestLevel === 0.786 || closestLevel === 1) {
    signal = 'sell';
    strength = 60;
  }

  return { level: closestLevel, signal, strength };
}

// ==================== Ichimoku Cloud ====================
export function calculateIchimoku(candles: CandleData[]): { signal: 'buy' | 'sell' | 'neutral'; strength: number } {
  if (candles.length < 52) {
    return { signal: 'neutral', strength: 0 };
  }

  const tenkan = calculateHighestHigh(candles.slice(-9)) - calculateLowestLow(candles.slice(-9));
  const kijun = calculateHighestHigh(candles.slice(-26)) - calculateLowestLow(candles.slice(-26));
  
  const currentPrice = candles[candles.length - 1].close;
  const cloudTop = Math.max(tenkan, kijun);
  const cloudBottom = Math.min(tenkan, kijun);

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (currentPrice > cloudTop) {
    signal = 'buy';
    strength = 65;
  } else if (currentPrice < cloudBottom) {
    signal = 'sell';
    strength = 65;
  }

  return { signal, strength };
}

function calculateHighestHigh(candles: CandleData[]): number {
  return Math.max(...candles.map(c => c.high));
}

function calculateLowestLow(candles: CandleData[]): number {
  return Math.min(...candles.map(c => c.low));
}

// ==================== OBV (On Balance Volume) ====================
export function calculateOBV(candles: CandleData[]): IndicatorResult {
  if (candles.length < 2) {
    return { value: 0, signal: 'neutral', strength: 0 };
  }

  let obv = 0;
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].close > candles[i - 1].close) {
      obv += candles[i].volume;
    } else if (candles[i].close < candles[i - 1].close) {
      obv -= candles[i].volume;
    }
  }

  const obvMA = calculateEMA(candles.slice(-20).map(c => c.volume), 10);
  const currentOBV = obv;

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (currentOBV > obvMA) {
    signal = 'buy';
    strength = 50;
  } else {
    signal = 'sell';
    strength = 50;
  }

  return { value: currentOBV, signal, strength };
}

// ==================== VWAP (Volume Weighted Average Price) ====================
export function calculateVWAP(candles: CandleData[]): IndicatorResult {
  if (candles.length === 0) {
    return { value: 0, signal: 'neutral', strength: 0 };
  }

  let cumulativeVolume = 0;
  let cumulativeTPV = 0;

  for (const candle of candles) {
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    cumulativeTPV += typicalPrice * candle.volume;
    cumulativeVolume += candle.volume;
  }

  const vwap = cumulativeTPV / cumulativeVolume;
  const currentPrice = candles[candles.length - 1].close;

  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 0;

  if (currentPrice > vwap) {
    signal = 'buy';
    strength = Math.min(100, ((currentPrice - vwap) / vwap) * 1000);
  } else {
    signal = 'sell';
    strength = Math.min(100, ((vwap - currentPrice) / vwap) * 1000);
  }

  return { value: vwap, signal, strength };
}

// ==================== All Indicators Combined ====================
export interface FullAnalysis {
  symbol: string;
  price: number;
  rsi: IndicatorResult;
  macd: IndicatorResult;
  bollinger: { upper: number; middle: number; lower: number; signal: 'buy' | 'sell' | 'neutral'; strength: number };
  stochastic: { k: number; d: number; signal: 'buy' | 'sell' | 'neutral'; strength: number };
  atr: number;
  adx: { adx: number; plusDI: number; minusDI: number; signal: 'buy' | 'sell' | 'neutral'; strength: number };
  volume: IndicatorResult;
  fibonacci: { level: number; signal: 'buy' | 'sell' | 'neutral'; strength: number };
  ichimoku: { signal: 'buy' | 'sell' | 'neutral'; strength: number };
  obv: IndicatorResult;
  vwap: IndicatorResult;
  overallSignal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  recommendedAction: 'SPOT_BUY' | 'FUTURES_LONG' | 'FUTURES_SHORT' | 'WAIT';
  recommendedLeverage: number;
}

export function analyzeMarket(candles: CandleData[], symbol: string): FullAnalysis {
  const rsi = calculateRSI(candles);
  const macd = calculateMACD(candles);
  const bollinger = calculateBollingerBands(candles);
  const stochastic = calculateStochastic(candles);
  const atr = calculateATR(candles);
  const adx = calculateADX(candles);
  const volume = calculateVolumeSignal(candles);
  const fibonacci = calculateFibonacci(candles);
  const ichimoku = calculateIchimoku(candles);
  const obv = calculateOBV(candles);
  const vwap = calculateVWAP(candles);

  // Calculate overall signal
  const signals = [
    rsi.signal,
    macd.signal,
    bollinger.signal,
    stochastic.signal,
    adx.signal,
    volume.signal,
    fibonacci.signal,
    ichimoku.signal,
    obv.signal,
    vwap.signal,
  ];

  const buyCount = signals.filter(s => s === 'buy').length;
  const sellCount = signals.filter(s => s === 'sell').length;

  let overallSignal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  let confidence = 0;

  if (buyCount >= 8) {
    overallSignal = 'STRONG_BUY';
    confidence = Math.min(100, buyCount * 10);
  } else if (buyCount >= 6) {
    overallSignal = 'BUY';
    confidence = buyCount * 10;
  } else if (sellCount >= 8) {
    overallSignal = 'STRONG_SELL';
    confidence = Math.min(100, sellCount * 10);
  } else if (sellCount >= 6) {
    overallSignal = 'SELL';
    confidence = sellCount * 10;
  } else {
    overallSignal = 'NEUTRAL';
    confidence = 50;
  }

  // Determine recommended action
  let recommendedAction: 'SPOT_BUY' | 'FUTURES_LONG' | 'FUTURES_SHORT' | 'WAIT';
  let recommendedLeverage = 1;

  if (overallSignal === 'STRONG_BUY' && adx.adx > 25) {
    recommendedAction = 'FUTURES_LONG';
    recommendedLeverage = Math.min(10, Math.floor(adx.adx / 10));
  } else if (overallSignal === 'BUY') {
    recommendedAction = 'SPOT_BUY';
  } else if (overallSignal === 'STRONG_SELL' && adx.adx > 25) {
    recommendedAction = 'FUTURES_SHORT';
    recommendedLeverage = Math.min(10, Math.floor(adx.adx / 10));
  } else {
    recommendedAction = 'WAIT';
  }

  return {
    symbol,
    price: candles[candles.length - 1].close,
    rsi,
    macd,
    bollinger,
    stochastic,
    atr,
    adx,
    volume,
    fibonacci,
    ichimoku,
    obv,
    vwap,
    overallSignal,
    confidence,
    recommendedAction,
    recommendedLeverage,
  };
}
