import React, { useState, useEffect } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, BarChart3, AlertTriangle, Info, Zap, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { mockLiveActivities, mockOpenPositions, mockBots, generatePriceHistory, generateIndicatorChart } from '../data';
import { LiveActivity, OpenPosition } from '../types';

const LiveActivityPanel: React.FC = () => {
  const [activities, setActivities] = useState<LiveActivity[]>(mockLiveActivities);
  const [selectedPosition, setSelectedPosition] = useState<OpenPosition | null>(null);
  const [chartPair, setChartPair] = useState('BTC/USDT');
  const priceData = generatePriceHistory(67250, 60);
  const rsiData = generateIndicatorChart('RSI');

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        botName: mockBots[Math.floor(Math.random() * mockBots.length)].name,
        pair: mockBots[Math.floor(Math.random() * mockBots.length)].pair,
        action: ['SİNYAL ALINDI', 'ANALİZ YAPILIYOR', 'EMİR BEKLENİYOR', 'İNDİKATÖR GÜNCELLENDİ', 'POZİSYON KONTROL'][Math.floor(Math.random() * 5)],
        type: (['info', 'analysis', 'signal', 'alert'] as const)[Math.floor(Math.random() * 4)],
        details: [
          'RSI 35 altına düştü - AL sinyali üretiliyor',
          'MACD pozitif kesişim tespit edildi',
          'Bollinger Band sıkışması - Patlama bekleniyor',
          'Hacim artışı %200 - Kırılım olasılığı yüksek',
          'EMA(9) EMA(21)\'i yukarı kesti - Golden Cross',
          'Volume Profile direnç seviyesinde - Dikkat',
          'ADX 25 üzeri - Güçlü trend teyidi',
          'Fibonacci 0.618 desteğinde - Giriş fırsatı',
        ][Math.floor(Math.random() * 8)],
        price: Math.round(Math.random() * 60000 + 1000),
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'buy': return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'sell': return <ArrowDownRight className="w-4 h-4 text-red-400" />;
      case 'analysis': return <BarChart3 className="w-4 h-4 text-blue-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'signal': return <Zap className="w-4 h-4 text-purple-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'buy': return 'border-l-green-500 bg-green-500/5';
      case 'sell': return 'border-l-red-500 bg-red-500/5';
      case 'analysis': return 'border-l-blue-500 bg-blue-500/5';
      case 'alert': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'signal': return 'border-l-purple-500 bg-purple-500/5';
      default: return 'border-l-gray-500 bg-gray-700/30';
    }
  };

  const totalPnl = mockOpenPositions.reduce((sum, p) => sum + p.pnl, 0);
  const totalMargin = mockOpenPositions.reduce((sum, p) => sum + (p.entryPrice * p.amount) / p.leverage, 0);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-yellow-500 animate-pulse" />
            Canlı Bot Aktivitesi
          </h1>
          <p className="text-gray-400 text-sm mt-1">Tüm botların gerçek zamanlı durumu ve pozisyonlar</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Canlı İzleme Aktif</span>
        </div>
      </div>

      {/* Position Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Açık Pozisyon</p>
          <p className="text-white text-2xl font-bold">{mockOpenPositions.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Toplam PnL</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} $
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Kullanılan Marjin</p>
          <p className="text-white text-2xl font-bold">${totalMargin.toFixed(0)}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Aktif Bot</p>
          <p className="text-white text-2xl font-bold">{mockBots.filter(b => b.status === 'running').length}/{mockBots.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Chart */}
        <div className="xl:col-span-2 space-y-4">
          {/* Price Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-semibold">{chartPair}</h3>
                <span className="text-green-400 text-sm font-medium">$67,250.00</span>
                <span className="text-green-400 text-xs bg-green-500/10 px-2 py-0.5 rounded">+2.35%</span>
              </div>
              <div className="flex items-center gap-1">
                {['BTC/USDT', 'ETH/USDT', 'SOL/USDT'].map(pair => (
                  <button
                    key={pair}
                    onClick={() => setChartPair(pair)}
                    className={`px-2 py-1 rounded text-xs ${chartPair === pair ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    {pair.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="liveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={10} />
                <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="price" stroke="#22c55e" fill="url(#liveGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* RSI Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">RSI(14) - Momentum Göstergesi</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-red-400">Aşırı Alım: 70</span>
                <span className="text-green-400">Aşırı Satım: 30</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={rsiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={9} interval={10} />
                <YAxis stroke="#6b7280" fontSize={9} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '70', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" label={{ value: '30', fill: '#22c55e', fontSize: 10 }} />
                <ReferenceLine y={50} stroke="#6b7280" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Open Positions Table */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Açık Pozisyonlar
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 text-xs pb-2">Bot</th>
                    <th className="text-left text-gray-400 text-xs pb-2">Parite</th>
                    <th className="text-center text-gray-400 text-xs pb-2">Yön</th>
                    <th className="text-right text-gray-400 text-xs pb-2">Giriş</th>
                    <th className="text-right text-gray-400 text-xs pb-2">Güncel</th>
                    <th className="text-center text-gray-400 text-xs pb-2">Kaldıraç</th>
                    <th className="text-right text-gray-400 text-xs pb-2">PnL</th>
                    <th className="text-center text-gray-400 text-xs pb-2">SL/TP</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOpenPositions.map(pos => (
                    <tr key={pos.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer" onClick={() => setSelectedPosition(pos)}>
                      <td className="py-2.5 text-white text-xs">{pos.botName}</td>
                      <td className="py-2.5 text-white text-xs font-medium">{pos.pair}</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          pos.type === 'LONG' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {pos.type === 'LONG' ? '↑' : '↓'} {pos.type}
                          {!pos.isSpot && <span className="text-yellow-400 ml-1">{pos.leverage}x</span>}
                          {pos.isSpot && <span className="text-blue-400 ml-1">SPOT</span>}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-gray-300 text-xs">${pos.entryPrice.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-white text-xs">${pos.currentPrice.toLocaleString()}</td>
                      <td className="py-2.5 text-center text-yellow-400 text-xs font-medium">{pos.isSpot ? 'Spot' : `${pos.leverage}x`}</td>
                      <td className={`py-2.5 text-right text-xs font-medium ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}$ ({pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent}%)
                      </td>
                      <td className="py-2.5 text-center text-xs">
                        <span className="text-red-400">{pos.stopLoss}</span>
                        <span className="text-gray-500 mx-1">/</span>
                        <span className="text-green-400">{pos.takeProfit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            Canlı Aktivite Akışı
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1" />
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {activities.map((activity) => (
              <div key={activity.id} className={`border-l-2 rounded-r-lg p-3 ${getActivityBg(activity.type)} transition-all`}>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white text-xs font-medium truncate">{activity.botName}</span>
                      <span className="text-gray-500 text-[10px] whitespace-nowrap">{activity.timestamp}</span>
                    </div>
                    <p className={`text-xs font-semibold mt-0.5 ${
                      activity.type === 'buy' ? 'text-green-400' :
                      activity.type === 'sell' ? 'text-red-400' :
                      activity.type === 'alert' ? 'text-yellow-400' :
                      activity.type === 'signal' ? 'text-purple-400' :
                      'text-blue-400'
                    }`}>{activity.action}</p>
                    <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">{activity.details}</p>
                    {activity.price && (
                      <p className="text-gray-500 text-[10px] mt-1">{activity.pair} • ${activity.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Position Detail Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedPosition(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">{selectedPosition.pair} - {selectedPosition.type}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedPosition.pnl >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {selectedPosition.pnl >= 0 ? '+' : ''}{selectedPosition.pnl.toFixed(2)}$ ({selectedPosition.pnlPercent}%)
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Giriş Fiyatı</p>
                <p className="text-white font-bold">${selectedPosition.entryPrice}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Güncel Fiyat</p>
                <p className="text-white font-bold">${selectedPosition.currentPrice}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Stop Loss</p>
                <p className="text-red-400 font-bold">${selectedPosition.stopLoss}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Take Profit</p>
                <p className="text-green-400 font-bold">${selectedPosition.takeProfit}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedPosition(null)} className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">Kapat</button>
              <button className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20">Pozisyonu Kapat</button>
              <button className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600">SL/TP Güncelle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveActivityPanel;
