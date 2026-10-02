import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useWsKline, useKlines } from '../hooks/useBinanceData';

const LiveChart: React.FC = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1m');
  const { kline, klines: wsKlines, connected } = useWsKline(symbol, interval);
  const { klines: historicalKlines } = useKlines(symbol, interval, 50);

  // Combine historical and real-time data
  const chartData = React.useMemo(() => {
    const data = historicalKlines.map(k => ({
      time: new Date(k.openTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(k.close),
      high: parseFloat(k.high),
      low: parseFloat(k.low),
      volume: parseFloat(k.volume),
    }));

    // Add real-time kline if available
    if (wsKlines.length > 0) {
      const latestWs = wsKlines[wsKlines.length - 1];
      data.push({
        time: new Date(latestWs.k.t).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        price: parseFloat(latestWs.k.c),
        high: parseFloat(latestWs.k.h),
        low: parseFloat(latestWs.k.l),
        volume: parseFloat(latestWs.k.v),
      });
    }

    return data;
  }, [historicalKlines, wsKlines]);

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;
  const previousPrice = chartData.length > 1 ? chartData[chartData.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-white font-semibold text-lg">
              {symbol.replace('USDT', '')}/USDT
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white text-2xl font-bold">
                ${currentPrice < 1 ? currentPrice.toFixed(6) : currentPrice < 100 ? currentPrice.toFixed(4) : currentPrice.toFixed(2)}
              </span>
              <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          {connected && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="BTCUSDT">BTC</option>
            <option value="ETHUSDT">ETH</option>
            <option value="SOLUSDT">SOL</option>
            <option value="BNBUSDT">BNB</option>
            <option value="XRPUSDT">XRP</option>
            <option value="ADAUSDT">ADA</option>
            <option value="DOGEUSDT">DOGE</option>
            <option value="AVAXUSDT">AVAX</option>
          </select>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1H</option>
            <option value="4h">4H</option>
            <option value="1d">1D</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={priceChange >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
              <stop offset="95%" stopColor={priceChange >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#6b7280" fontSize={11} interval="preserveStartEnd" />
          <YAxis stroke="#6b7280" fontSize={11} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Fiyat']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"}
            fill="url(#priceGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">24s Yüksek</p>
          <p className="text-white font-semibold">
            ${chartData.length > 0 ? Math.max(...chartData.map(d => d.high)).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">24s Düşük</p>
          <p className="text-white font-semibold">
            ${chartData.length > 0 ? Math.min(...chartData.map(d => d.low)).toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Hacim</p>
          <p className="text-white font-semibold">
            {chartData.length > 0 ? (chartData[chartData.length - 1].volume / 1000000).toFixed(2) : '0.00'}M
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">İşlem Sayısı</p>
          <p className="text-white font-semibold">
            {wsKlines.length > 0 ? wsKlines[wsKlines.length - 1].k.n : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveChart;
