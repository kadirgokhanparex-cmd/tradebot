import { Bot, Trade, Strategy, MarketData } from './types';

export const mockBots: Bot[] = [
  {
    id: '1',
    name: 'BTC Grid Bot',
    pair: 'BTC/USDT',
    strategy: 'Grid Trading',
    status: 'running',
    profit: 2450.32,
    profitPercent: 12.25,
    trades: 156,
    winRate: 78.5,
    investment: 20000,
    currentValue: 22450.32,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'ETH DCA Bot',
    pair: 'ETH/USDT',
    strategy: 'DCA',
    status: 'running',
    profit: 890.15,
    profitPercent: 8.9,
    trades: 89,
    winRate: 82.1,
    investment: 10000,
    currentValue: 10890.15,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'SOL Scalper',
    pair: 'SOL/USDT',
    strategy: 'Scalping',
    status: 'running',
    profit: 1560.78,
    profitPercent: 15.6,
    trades: 342,
    winRate: 71.2,
    investment: 10000,
    currentValue: 11560.78,
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'BNB Momentum',
    pair: 'BNB/USDT',
    strategy: 'Momentum',
    status: 'stopped',
    profit: 430.50,
    profitPercent: 4.3,
    trades: 45,
    winRate: 66.7,
    investment: 10000,
    currentValue: 10430.50,
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'XRP Arbitrage',
    pair: 'XRP/USDT',
    strategy: 'Arbitrage',
    status: 'error',
    profit: -120.45,
    profitPercent: -2.4,
    trades: 23,
    winRate: 43.5,
    investment: 5000,
    currentValue: 4879.55,
    createdAt: '2024-03-01',
  },
  {
    id: '6',
    name: 'ADA Mean Reversion',
    pair: 'ADA/USDT',
    strategy: 'Mean Reversion',
    status: 'running',
    profit: 670.22,
    profitPercent: 6.7,
    trades: 98,
    winRate: 74.5,
    investment: 10000,
    currentValue: 10670.22,
    createdAt: '2024-02-15',
  },
];

export const mockTrades: Trade[] = [
  { id: '1', botId: '1', botName: 'BTC Grid Bot', pair: 'BTC/USDT', type: 'SELL', price: 67250.00, amount: 0.015, total: 1008.75, profit: 45.32, timestamp: '2024-03-15 14:32:15', status: 'completed' },
  { id: '2', botId: '1', botName: 'BTC Grid Bot', pair: 'BTC/USDT', type: 'BUY', price: 66800.00, amount: 0.015, total: 1002.00, profit: 0, timestamp: '2024-03-15 12:15:42', status: 'completed' },
  { id: '3', botId: '2', botName: 'ETH DCA Bot', pair: 'ETH/USDT', type: 'BUY', price: 3420.50, amount: 0.5, total: 1710.25, profit: 0, timestamp: '2024-03-15 10:00:00', status: 'completed' },
  { id: '4', botId: '3', botName: 'SOL Scalper', pair: 'SOL/USDT', type: 'SELL', price: 145.80, amount: 10, total: 1458.00, profit: 23.45, timestamp: '2024-03-15 09:45:30', status: 'completed' },
  { id: '5', botId: '3', botName: 'SOL Scalper', pair: 'SOL/USDT', type: 'BUY', price: 143.45, amount: 10, total: 1434.55, profit: 0, timestamp: '2024-03-15 09:30:12', status: 'completed' },
  { id: '6', botId: '1', botName: 'BTC Grid Bot', pair: 'BTC/USDT', type: 'SELL', price: 67100.00, amount: 0.02, total: 1342.00, profit: 62.10, timestamp: '2024-03-14 22:15:00', status: 'completed' },
  { id: '7', botId: '6', botName: 'ADA Mean Reversion', pair: 'ADA/USDT', type: 'BUY', price: 0.62, amount: 5000, total: 3100.00, profit: 0, timestamp: '2024-03-14 18:30:00', status: 'completed' },
  { id: '8', botId: '2', botName: 'ETH DCA Bot', pair: 'ETH/USDT', type: 'SELL', price: 3450.00, amount: 0.3, total: 1035.00, profit: 15.75, timestamp: '2024-03-14 16:00:00', status: 'completed' },
  { id: '9', botId: '5', botName: 'XRP Arbitrage', pair: 'XRP/USDT', type: 'BUY', price: 0.58, amount: 2000, total: 1160.00, profit: -12.30, timestamp: '2024-03-14 14:20:00', status: 'completed' },
  { id: '10', botId: '3', botName: 'SOL Scalper', pair: 'SOL/USDT', type: 'SELL', price: 146.20, amount: 8, total: 1169.60, profit: 18.90, timestamp: '2024-03-14 11:45:00', status: 'completed' },
  { id: '11', botId: '1', botName: 'BTC Grid Bot', pair: 'BTC/USDT', type: 'BUY', price: 66500.00, amount: 0.02, total: 1330.00, profit: 0, timestamp: '2024-03-14 08:00:00', status: 'completed' },
  { id: '12', botId: '6', botName: 'ADA Mean Reversion', pair: 'ADA/USDT', type: 'SELL', price: 0.635, amount: 5000, total: 3175.00, profit: 75.00, timestamp: '2024-03-13 20:15:00', status: 'completed' },
];

export const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Grid Trading',
    description: 'Belirli bir fiyat aralığında otomatik alım-satım emirleri yerleştirir. Yatay piyasalarda yüksek kar sağlar.',
    risk: 'medium',
    avgReturn: 15.5,
    maxDrawdown: 8.2,
    winRate: 78,
    tradesPerDay: 12,
    indicators: ['Bollinger Bands', 'RSI', 'Volume'],
  },
  {
    id: '2',
    name: 'DCA (Dollar Cost Averaging)',
    description: 'Düzenli aralıklarla sabit miktarlarda alım yapar. Uzun vadeli yatırımlar için idealdir.',
    risk: 'low',
    avgReturn: 8.3,
    maxDrawdown: 5.1,
    winRate: 85,
    tradesPerDay: 2,
    indicators: ['Moving Average', 'RSI', 'MACD'],
  },
  {
    id: '3',
    name: 'Scalping',
    description: 'Küçük fiyat hareketlerinden hızlı kar elde eder. Yüksek frekanslı işlemler yapar.',
    risk: 'high',
    avgReturn: 22.1,
    maxDrawdown: 12.5,
    winRate: 71,
    tradesPerDay: 50,
    indicators: ['EMA Cross', 'Stochastic', 'Order Book'],
  },
  {
    id: '4',
    name: 'Momentum',
    description: 'Güçlü trend yönünde işlem açar. Trend takip stratejisi kullanır.',
    risk: 'medium',
    avgReturn: 18.7,
    maxDrawdown: 10.3,
    winRate: 65,
    tradesPerDay: 5,
    indicators: ['ADX', 'MACD', 'RSI', 'Volume'],
  },
  {
    id: '5',
    name: 'Arbitrage',
    description: 'Farklı borsalar arası fiyat farklarından kar elde eder. Düşük riskli hızlı işlemler.',
    risk: 'low',
    avgReturn: 5.2,
    maxDrawdown: 2.1,
    winRate: 92,
    tradesPerDay: 30,
    indicators: ['Price Spread', 'Latency', 'Order Book Depth'],
  },
  {
    id: '6',
    name: 'Mean Reversion',
    description: 'Fiyat ortalamadan uzaklaştığında tersine dönüş bekler. İstatistiksel arbitraj temelli.',
    risk: 'medium',
    avgReturn: 12.4,
    maxDrawdown: 7.8,
    winRate: 74,
    tradesPerDay: 8,
    indicators: ['Bollinger Bands', 'Z-Score', 'RSI'],
  },
];

export const mockMarketData: MarketData[] = [
  { pair: 'BTC/USDT', price: 67250.00, change24h: 2.35, volume24h: 28500000000, high24h: 67800, low24h: 65200 },
  { pair: 'ETH/USDT', price: 3420.50, change24h: 1.85, volume24h: 15200000000, high24h: 3480, low24h: 3350 },
  { pair: 'SOL/USDT', price: 145.80, change24h: 5.42, volume24h: 4800000000, high24h: 148.50, low24h: 137.20 },
  { pair: 'BNB/USDT', price: 585.30, change24h: -0.85, volume24h: 1900000000, high24h: 595, low24h: 580 },
  { pair: 'XRP/USDT', price: 0.58, change24h: -1.20, volume24h: 1200000000, high24h: 0.595, low24h: 0.572 },
  { pair: 'ADA/USDT', price: 0.62, change24h: 3.15, volume24h: 850000000, high24h: 0.635, low24h: 0.598 },
];

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
  let value = 55000;
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60000);
    const change = (Math.random() - 0.4) * 1500;
    value = Math.max(value + change, 50000);
    data.push({
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      value: Math.round(value * 100) / 100,
      profit: Math.round((value - 55000) * 100) / 100,
    });
  }
  return data;
};
