import { Bot, Trade, Strategy, MarketData, Indicator, LiveActivity, OpenPosition } from './types';

export const mockBots: Bot[] = [
  {
    id: '1', name: 'BTC Grid Bot', pair: 'BTC/USDT', strategy: 'Grid Trading',
    status: 'stopped', profit: 0, profitPercent: 0, trades: 0, winRate: 0,
    investment: 0, currentValue: 0, createdAt: new Date().toISOString().split('T')[0],
    leverage: 1, isSpot: true, currentAction: 'Bot başlatılmadı',
    nextAction: 'Bot başlatıldığında aktif olacak', currentIndicator: 'Hazır'
  },
  {
    id: '2', name: 'ETH DCA Bot', pair: 'ETH/USDT', strategy: 'DCA',
    status: 'stopped', profit: 0, profitPercent: 0, trades: 0, winRate: 0,
    investment: 0, currentValue: 0, createdAt: new Date().toISOString().split('T')[0],
    leverage: 1, isSpot: true, currentAction: 'Bot başlatılmadı',
    nextAction: 'Bot başlatıldığında aktif olacak', currentIndicator: 'Hazır'
  },
  {
    id: '3', name: 'SOL Scalper', pair: 'SOL/USDT', strategy: 'Scalping',
    status: 'stopped', profit: 0, profitPercent: 0, trades: 0, winRate: 0,
    investment: 0, currentValue: 0, createdAt: new Date().toISOString().split('T')[0],
    leverage: 5, isSpot: false, currentAction: 'Bot başlatılmadı',
    nextAction: 'Bot başlatıldığında aktif olacak', currentIndicator: 'Hazır'
  },
];

export const mockTrades: Trade[] = [];

export const mockStrategies: Strategy[] = [
  { id: '1', name: 'Grid Trading', description: 'Belirli bir fiyat aralığında otomatik alım-satım emirleri yerleştirir. Yatay piyasalarda yüksek kar sağlar.', risk: 'medium', avgReturn: 15.5, maxDrawdown: 8.2, winRate: 78, tradesPerDay: 12, indicators: ['Bollinger Bands', 'RSI', 'Volume'] },
  { id: '2', name: 'DCA (Dollar Cost Averaging)', description: 'Düzenli aralıklarla sabit miktarlarda alım yapar. Uzun vadeli yatırımlar için idealdir.', risk: 'low', avgReturn: 8.3, maxDrawdown: 5.1, winRate: 85, tradesPerDay: 2, indicators: ['Moving Average', 'RSI', 'MACD'] },
  { id: '3', name: 'Scalping', description: 'Küçük fiyat hareketlerinden hızlı kar elde eder. Yüksek frekanslı işlemler yapar.', risk: 'high', avgReturn: 22.1, maxDrawdown: 12.5, winRate: 71, tradesPerDay: 50, indicators: ['EMA Cross', 'Stochastic', 'Order Book'] },
  { id: '4', name: 'Momentum', description: 'Güçlü trend yönünde işlem açar. Trend takip stratejisi kullanır.', risk: 'medium', avgReturn: 18.7, maxDrawdown: 10.3, winRate: 65, tradesPerDay: 5, indicators: ['ADX', 'MACD', 'RSI', 'Volume'] },
  { id: '5', name: 'Arbitrage', description: 'Farklı borsalar arası fiyat farklarından kar elde eder. Düşük riskli hızlı işlemler.', risk: 'low', avgReturn: 5.2, maxDrawdown: 2.1, winRate: 92, tradesPerDay: 30, indicators: ['Price Spread', 'Latency', 'Order Book Depth'] },
  { id: '6', name: 'Mean Reversion', description: 'Fiyat ortalamadan uzaklaştığında tersine dönüş bekler. İstatistiksel arbitraj temelli.', risk: 'medium', avgReturn: 12.4, maxDrawdown: 7.8, winRate: 74, tradesPerDay: 8, indicators: ['Bollinger Bands', 'Z-Score', 'RSI'] },
  { id: '7', name: 'Breakout', description: 'Destek/direnç kırılımlarında işlem açar. Hacim onayı ile güçlü sinyaller üretir.', risk: 'high', avgReturn: 25.3, maxDrawdown: 15.2, winRate: 58, tradesPerDay: 3, indicators: ['Volume Profile', 'Support/Resistance', 'RSI', 'ATR'] },
  { id: '8', name: 'Swing Trading', description: 'Orta vadeli fiyat dalgalanmalarından kar elde eder. Fibonacci ve trend analizi kullanır.', risk: 'medium', avgReturn: 16.8, maxDrawdown: 9.5, winRate: 70, tradesPerDay: 2, indicators: ['Fibonacci', 'MACD', 'EMA', 'Ichimoku'] },
];

export const mockMarketData: MarketData[] = [
  { pair: 'BTC/USDT', symbol: 'BTC', price: 67250.00, change24h: 2.35, change7d: 5.8, volume24h: 28500000000, high24h: 67800, low24h: 65200, marketCap: 1320000000000, signal: 'BUY', recommendedLeverage: 1, recommendedPosition: 15, isSpot: true, rsi: 58, macdSignal: 'Pozitif', trend: 'bullish', volatility: 3.2 },
  { pair: 'ETH/USDT', symbol: 'ETH', price: 3420.50, change24h: 1.85, change7d: 4.2, volume24h: 15200000000, high24h: 3480, low24h: 3350, marketCap: 411000000000, signal: 'BUY', recommendedLeverage: 1, recommendedPosition: 12, isSpot: true, rsi: 55, macdSignal: 'Pozitif', trend: 'bullish', volatility: 3.8 },
  { pair: 'SOL/USDT', symbol: 'SOL', price: 145.80, change24h: 5.42, change7d: 12.3, volume24h: 4800000000, high24h: 148.50, low24h: 137.20, marketCap: 64000000000, signal: 'STRONG_BUY', recommendedLeverage: 5, recommendedPosition: 8, isSpot: false, rsi: 68, macdSignal: 'Güçlü Pozitif', trend: 'bullish', volatility: 6.5 },
  { pair: 'BNB/USDT', symbol: 'BNB', price: 585.30, change24h: -0.85, change7d: -2.1, volume24h: 1900000000, high24h: 595, low24h: 580, marketCap: 88000000000, signal: 'NEUTRAL', recommendedLeverage: 1, recommendedPosition: 5, isSpot: true, rsi: 45, macdSignal: 'Nötr', trend: 'sideways', volatility: 2.1 },
  { pair: 'XRP/USDT', symbol: 'XRP', price: 0.58, change24h: -1.20, change7d: -3.5, volume24h: 1200000000, high24h: 0.595, low24h: 0.572, marketCap: 32000000000, signal: 'SELL', recommendedLeverage: 1, recommendedPosition: 0, isSpot: true, rsi: 38, macdSignal: 'Negatif', trend: 'bearish', volatility: 3.1 },
  { pair: 'ADA/USDT', symbol: 'ADA', price: 0.62, change24h: 3.15, change7d: 7.8, volume24h: 850000000, high24h: 0.635, low24h: 0.598, marketCap: 22000000000, signal: 'BUY', recommendedLeverage: 1, recommendedPosition: 6, isSpot: true, rsi: 52, macdSignal: 'Pozitif', trend: 'bullish', volatility: 4.2 },
  { pair: 'DOGE/USDT', symbol: 'DOGE', price: 0.162, change24h: 4.85, change7d: 9.2, volume24h: 2100000000, high24h: 0.168, low24h: 0.152, marketCap: 23000000000, signal: 'STRONG_BUY', recommendedLeverage: 3, recommendedPosition: 5, isSpot: false, rsi: 64, macdSignal: 'Pozitif', trend: 'bullish', volatility: 7.8 },
  { pair: 'AVAX/USDT', symbol: 'AVAX', price: 38.50, change24h: 2.10, change7d: 6.5, volume24h: 780000000, high24h: 39.20, low24h: 37.10, marketCap: 14500000000, signal: 'BUY', recommendedLeverage: 1, recommendedPosition: 5, isSpot: true, rsi: 56, macdSignal: 'Pozitif', trend: 'bullish', volatility: 5.1 },
  { pair: 'DOT/USDT', symbol: 'DOT', price: 7.85, change24h: -0.50, change7d: 1.2, volume24h: 420000000, high24h: 7.95, low24h: 7.72, marketCap: 10200000000, signal: 'NEUTRAL', recommendedLeverage: 1, recommendedPosition: 3, isSpot: true, rsi: 48, macdSignal: 'Nötr', trend: 'sideways', volatility: 3.5 },
  { pair: 'MATIC/USDT', symbol: 'MATIC', price: 0.92, change24h: 1.65, change7d: 3.8, volume24h: 560000000, high24h: 0.94, low24h: 0.89, marketCap: 8500000000, signal: 'BUY', recommendedLeverage: 1, recommendedPosition: 4, isSpot: true, rsi: 53, macdSignal: 'Pozitif', trend: 'bullish', volatility: 4.8 },
  { pair: 'LINK/USDT', symbol: 'LINK', price: 14.80, change24h: 3.20, change7d: 8.5, volume24h: 680000000, high24h: 15.10, low24h: 14.20, marketCap: 8700000000, signal: 'STRONG_BUY', recommendedLeverage: 3, recommendedPosition: 5, isSpot: false, rsi: 62, macdSignal: 'Güçlü Pozitif', trend: 'bullish', volatility: 5.5 },
  { pair: 'UNI/USDT', symbol: 'UNI', price: 7.45, change24h: -2.10, change7d: -4.5, volume24h: 320000000, high24h: 7.68, low24h: 7.30, marketCap: 4500000000, signal: 'SELL', recommendedLeverage: 1, recommendedPosition: 0, isSpot: true, rsi: 35, macdSignal: 'Negatif', trend: 'bearish', volatility: 4.2 },
  { pair: 'ATOM/USDT', symbol: 'ATOM', price: 9.20, change24h: 0.85, change7d: 2.1, volume24h: 280000000, high24h: 9.35, low24h: 9.05, marketCap: 3500000000, signal: 'NEUTRAL', recommendedLeverage: 1, recommendedPosition: 3, isSpot: true, rsi: 50, macdSignal: 'Nötr', trend: 'sideways', volatility: 3.0 },
  { pair: 'FIL/USDT', symbol: 'FIL', price: 6.15, change24h: -3.20, change7d: -6.8, volume24h: 210000000, high24h: 6.40, low24h: 6.05, marketCap: 3200000000, signal: 'STRONG_SELL', recommendedLeverage: 1, recommendedPosition: 0, isSpot: true, rsi: 28, macdSignal: 'Güçlü Negatif', trend: 'bearish', volatility: 5.8 },
  { pair: 'NEAR/USDT', symbol: 'NEAR', price: 5.80, change24h: 6.20, change7d: 15.3, volume24h: 450000000, high24h: 5.95, low24h: 5.40, marketCap: 6100000000, signal: 'STRONG_BUY', recommendedLeverage: 5, recommendedPosition: 4, isSpot: false, rsi: 72, macdSignal: 'Güçlü Pozitif', trend: 'bullish', volatility: 8.2 },
  { pair: 'APT/USDT', symbol: 'APT', price: 8.90, change24h: 1.50, change7d: 4.5, volume24h: 350000000, high24h: 9.05, low24h: 8.70, marketCap: 3800000000, signal: 'BUY', recommendedLeverage: 1, recommendedPosition: 4, isSpot: true, rsi: 55, macdSignal: 'Pozitif', trend: 'bullish', volatility: 4.5 },
];

export const mockIndicators: Indicator[] = [
  {
    id: 'rsi', name: 'RSI', fullName: 'Relative Strength Index', category: 'momentum',
    description: 'Fiyatın aşırı alım/satım bölgelerini belirler. 0-100 arası değer üretir.',
    whenToUse: 'Trend dönüş noktalarını tespit etmek için. Yatay ve trend piyasalarında kullanılabilir.',
    buySignal: 'RSI 30 altına düştüğünde (aşırı satım) - AL sinyali',
    sellSignal: 'RSI 70 üzerine çıktığında (aşırı alım) - SAT sinyali',
    bestTimeframe: '4H, 1D',
    parameters: [{ name: 'Periyot', defaultValue: 14, min: 5, max: 50 }],
    currentValue: 58, signal: 'neutral'
  },
  {
    id: 'macd', name: 'MACD', fullName: 'Moving Average Convergence Divergence', category: 'trend',
    description: 'İki hareketli ortalama arasındaki farkı gösterir. Trend yönünü ve gücünü belirler.',
    whenToUse: 'Trend başlangıç ve bitişlerini tespit etmek için. Orta vadeli işlemlerde etkilidir.',
    buySignal: 'MACD çizgisi sinyal çizgisini yukarı kestiğinde - AL',
    sellSignal: 'MACD çizgisi sinyal çizgisini aşağı kestiğinde - SAT',
    bestTimeframe: '1H, 4H, 1D',
    parameters: [{ name: 'Hızlı EMA', defaultValue: 12, min: 5, max: 30 }, { name: 'Yavaş EMA', defaultValue: 26, min: 15, max: 50 }, { name: 'Sinyal', defaultValue: 9, min: 3, max: 20 }],
    currentValue: 125, signal: 'buy'
  },
  {
    id: 'bb', name: 'BB', fullName: 'Bollinger Bands', category: 'volatility',
    description: 'Fiyatın volatilite bantlarını çizer. Üst ve alt bantlar standart sapma ile hesaplanır.',
    whenToUse: 'Volatilite ölçümü ve fiyat kanalını belirlemek için. Sıkışma ve patlama anlarında kullanılır.',
    buySignal: 'Fiyat alt banda değdiğinde veya altına indiğinde - AL',
    sellSignal: 'Fiyat üst banda değdiğinde veya üzerine çıktığında - SAT',
    bestTimeframe: '1H, 4H',
    parameters: [{ name: 'Periyot', defaultValue: 20, min: 10, max: 50 }, { name: 'Std Sapma', defaultValue: 2, min: 1, max: 4 }],
    currentValue: 0.72, signal: 'neutral'
  },
  {
    id: 'ema', name: 'EMA', fullName: 'Exponential Moving Average', category: 'trend',
    description: 'Son fiyatlara daha fazla ağırlık veren hareketli ortalama. Trend yönünü gösterir.',
    whenToUse: 'Trend yönünü belirlemek için. EMA kesişimleri güçlü sinyal üretir.',
    buySignal: 'Kısa EMA, uzun EMA\'yı yukarı kestiğinde (Golden Cross) - AL',
    sellSignal: 'Kısa EMA, uzun EMA\'yı aşağı kestiğinde (Death Cross) - SAT',
    bestTimeframe: '15m, 1H, 4H, 1D',
    parameters: [{ name: 'Kısa Periyot', defaultValue: 9, min: 3, max: 20 }, { name: 'Uzun Periyot', defaultValue: 21, min: 15, max: 50 }],
    currentValue: 67100, signal: 'buy'
  },
  {
    id: 'stoch', name: 'Stochastic', fullName: 'Stochastic Oscillator', category: 'momentum',
    description: 'Kapanış fiyatını belirli bir periyottaki fiyat aralığına göre karşılaştırır.',
    whenToUse: 'Kısa vadeli aşırı alım/satım sinyalleri için. Scalping stratejilerinde etkilidir.',
    buySignal: '%K 20 altına düşüp %D\'yi yukarı kestiğinde - AL',
    sellSignal: '%K 80 üzerine çıkıp %D\'yi aşağı kestiğinde - SAT',
    bestTimeframe: '5m, 15m, 1H',
    parameters: [{ name: '%K Periyot', defaultValue: 14, min: 5, max: 30 }, { name: '%D Periyot', defaultValue: 3, min: 1, max: 10 }],
    currentValue: 72, signal: 'neutral'
  },
  {
    id: 'atr', name: 'ATR', fullName: 'Average True Range', category: 'volatility',
    description: 'Piyasa volatilitesini ölçer. Stop loss ve take profit seviyelerini belirlemede kullanılır.',
    whenToUse: 'Stop loss mesafesi belirlemek ve volatilite bazlı pozisyon boyutu hesaplamak için.',
    buySignal: 'ATR artışı trend başlangıcını gösterir - Trend yönünde AL',
    sellSignal: 'ATR azalışı trend zayıflamasını gösterir - Pozisyon kapat',
    bestTimeframe: '1H, 4H, 1D',
    parameters: [{ name: 'Periyot', defaultValue: 14, min: 5, max: 30 }],
    currentValue: 1250, signal: 'neutral'
  },
  {
    id: 'adx', name: 'ADX', fullName: 'Average Directional Index', category: 'trend',
    description: 'Trendin gücünü ölçer. 0-100 arası değer üretir. Yön belirtmez, sadece güç gösterir.',
    whenToUse: 'Trendin güçlü olup olmadığını anlamak için. ADX > 25 güçlü trend demektir.',
    buySignal: 'ADX > 25 ve +DI > -DI olduğunda - Güçlü YÜKSELİŞ trendi, AL',
    sellSignal: 'ADX > 25 ve -DI > +DI olduğunda - Güçlü DÜŞÜŞ trendi, SAT',
    bestTimeframe: '4H, 1D',
    parameters: [{ name: 'Periyot', defaultValue: 14, min: 7, max: 30 }],
    currentValue: 28, signal: 'buy'
  },
  {
    id: 'vol', name: 'Volume', fullName: 'Volume Analysis', category: 'volume',
    description: 'İşlem hacmini analiz eder. Hacim artışı trendin gücünü doğrular.',
    whenToUse: 'Trend doğrulaması ve kırılım onayı için. Hacimsiz kırılımlar güvenilmezdir.',
    buySignal: 'Hacim artışı ile fiyat yükselişi - GÜÇLÜ AL sinyali',
    sellSignal: 'Hacim artışı ile fiyat düşüşü - GÜÇLÜ SAT sinyali',
    bestTimeframe: 'Tüm zaman dilimleri',
    parameters: [{ name: 'MA Periyot', defaultValue: 20, min: 10, max: 50 }],
    currentValue: 1500000, signal: 'buy'
  },
  {
    id: 'fib', name: 'Fibonacci', fullName: 'Fibonacci Retracement', category: 'trend',
    description: 'Fibonacci seviyelerini hesaplar. Destek ve direnç noktalarını belirler.',
    whenToUse: 'Düzeltme seviyelerini bulmak ve giriş/çıkış noktalarını belirlemek için.',
    buySignal: 'Fiyat 0.618 veya 0.5 seviyesinden döndüğünde - AL',
    sellSignal: 'Fiyat 0.618 veya 0.786 direncinden reddedildiğinde - SAT',
    bestTimeframe: '4H, 1D',
    parameters: [{ name: 'Swing High', defaultValue: 0, min: 0, max: 100000 }, { name: 'Swing Low', defaultValue: 0, min: 0, max: 100000 }],
    currentValue: 0.618, signal: 'buy'
  },
  {
    id: 'ichimoku', name: 'Ichimoku', fullName: 'Ichimoku Cloud', category: 'trend',
    description: 'Japon bulut sistemi. Trend, momentum ve destek/direnci tek bakışta gösterir.',
    whenToUse: 'Trend yönünü ve gücünü kapsamlı analiz için. Uzun vadeli pozisyonlarda etkilidir.',
    buySignal: 'Fiyat bulutun üzerinde ve Tenkan Kijun\'u kestiğinde - AL',
    sellSignal: 'Fiyat bulutun altına indiğinde - SAT',
    bestTimeframe: '4H, 1D',
    parameters: [{ name: 'Tenkan', defaultValue: 9, min: 5, max: 15 }, { name: 'Kijun', defaultValue: 26, min: 20, max: 40 }, { name: 'Senkou B', defaultValue: 52, min: 40, max: 60 }],
    currentValue: 0, signal: 'buy'
  },
  {
    id: 'obv', name: 'OBV', fullName: 'On Balance Volume', category: 'volume',
    description: 'Hacim bazlı momentum indikatörü. Alım/satım baskısını ölçer.',
    whenToUse: 'Fiyat-hacim uyumsuzluğunu tespit etmek için. Divergence sinyalleri üretir.',
    buySignal: 'OBV yükseliş trendindeyken fiyat düşüyorsa - POZİTİF DIVERGENCE, AL',
    sellSignal: 'OBV düşüş trendindeyken fiyat yükseliyorsa - NEGATİF DIVERGENCE, SAT',
    bestTimeframe: '1H, 4H',
    parameters: [],
    currentValue: 2500000, signal: 'buy'
  },
  {
    id: 'vwap', name: 'VWAP', fullName: 'Volume Weighted Average Price', category: 'volume',
    description: 'Hacim ağırlıklı ortalama fiyat. Kurumsal alım-satım seviyelerini gösterir.',
    whenToUse: 'Gün içi işlemlerde adil fiyatı belirlemek için. Scalping ve day trading\'de kullanılır.',
    buySignal: 'Fiyat VWAP\'ın altından yukarı kestiğinde - AL',
    sellSignal: 'Fiyat VWAP\'ın üstünden aşağı kestiğinde - SAT',
    bestTimeframe: '5m, 15m, 1H',
    parameters: [],
    currentValue: 67050, signal: 'neutral'
  },
];

export const mockLiveActivities: LiveActivity[] = [
  { id: '1', timestamp: new Date().toLocaleTimeString('tr-TR'), botName: 'Sistem', pair: 'TÜM', action: 'SİSTEM BAŞLATILDI', type: 'info', details: 'Binance Auto Trading Bot başlatıldı. Testnet modu aktif.', price: 0 },
];

export const mockOpenPositions: OpenPosition[] = [];

export const generatePriceHistory = (basePrice: number, points: number = 48): { time: string; price: number; volume: number }[] => {
  const data = [];
  let price = basePrice * 0.95;
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60000);
    const change = (Math.random() - 0.48) * basePrice * 0.01;
    price = Math.max(price + change, basePrice * 0.85);
    price = Math.min(price, basePrice * 1.15);
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
      price: Math.round(price * 100) / 100,
      volume: Math.round(Math.random() * 1000000 + 500000),
    });
  }
  return data;
};

export const generatePortfolioHistory = (): { date: string; value: number; profit: number }[] => {
  const data = [];
  const initialValue = 10000; // Başlangıç sermayesi: 10,000 USDT
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60000);
    data.push({
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      value: initialValue,
      profit: 0,
    });
  }
  return data;
};

export const generateIndicatorChart = (indicator: string): { time: string; value: number; signal?: number }[] => {
  const data = [];
  const now = new Date();
  let value = 50;
  for (let i = 50; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 30 * 60000);
    value += (Math.random() - 0.5) * 10;
    value = Math.max(10, Math.min(90, value));
    data.push({
      time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
};
