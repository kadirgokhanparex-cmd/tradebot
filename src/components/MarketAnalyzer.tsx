import React, { useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Minus, Zap, Shield, AlertTriangle, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { mockMarketData } from '../data';
import { MarketData } from '../types';

const MarketAnalyzer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [signalFilter, setSignalFilter] = useState('all');
  const [sortBy, setSortBy] = useState('change24h');
  const [selectedCoin, setSelectedCoin] = useState<MarketData | null>(null);

  const filteredData = mockMarketData
    .filter(coin => {
      const matchesSearch = coin.pair.toLowerCase().includes(searchTerm.toLowerCase()) || coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSignal = signalFilter === 'all' || coin.signal === signalFilter;
      return matchesSearch && matchesSignal;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'change24h': return b.change24h - a.change24h;
        case 'volume': return b.volume24h - a.volume24h;
        case 'rsi': return a.rsi - b.rsi;
        default: return 0;
      }
    });

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'bg-green-500 text-white';
      case 'BUY': return 'bg-green-500/20 text-green-400';
      case 'NEUTRAL': return 'bg-gray-600 text-gray-300';
      case 'SELL': return 'bg-red-500/20 text-red-400';
      case 'STRONG_SELL': return 'bg-red-500 text-white';
      default: return '';
    }
  };

  const getSignalText = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'GÜÇLÜ AL';
      case 'BUY': return 'AL';
      case 'NEUTRAL': return 'NÖTR';
      case 'SELL': return 'SAT';
      case 'STRONG_SELL': return 'GÜÇLÜ SAT';
      default: return signal;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRecommendation = (coin: MarketData) => {
    if (coin.volatility > 6 && coin.rsi > 55) return { type: 'futures', leverage: coin.recommendedLeverage, reason: 'Yüksek volatilite + güçlü momentum → Futures LONG' };
    if (coin.volatility > 6 && coin.rsi < 45) return { type: 'futures', leverage: coin.recommendedLeverage, reason: 'Yüksek volatilite + düşüş momentumu → Futures SHORT' };
    if (coin.volatility <= 4 && coin.trend === 'bullish') return { type: 'spot', leverage: 1, reason: 'Düşük volatilite + yükseliş trendi → Spot AL' };
    if (coin.volatility <= 4 && coin.trend === 'bearish') return { type: 'none', leverage: 0, reason: 'Düşük volatilite + düşüş trendi → İşlem yapma, bekle' };
    if (coin.trend === 'sideways') return { type: 'spot', leverage: 1, reason: 'Yatay piyasa → Grid Trading (Spot)' };
    return { type: 'spot', leverage: 1, reason: 'Nötr sinyal → Spot pozisyon bekle' };
  };

  const radarData = selectedCoin ? [
    { subject: 'RSI', value: selectedCoin.rsi },
    { subject: 'Trend', value: selectedCoin.trend === 'bullish' ? 80 : selectedCoin.trend === 'bearish' ? 20 : 50 },
    { subject: 'Hacim', value: Math.min((selectedCoin.volume24h / 10000000000) * 100, 100) },
    { subject: 'Volatilite', value: Math.min(selectedCoin.volatility * 12, 100) },
    { subject: 'Momentum', value: Math.max(0, Math.min(100, 50 + selectedCoin.change24h * 5)) },
    { subject: 'Güven', value: selectedCoin.signal === 'STRONG_BUY' ? 90 : selectedCoin.signal === 'BUY' ? 70 : selectedCoin.signal === 'NEUTRAL' ? 50 : selectedCoin.signal === 'SELL' ? 30 : 10 },
  ] : [];

  const volumeData = mockMarketData.slice(0, 8).map(coin => ({
    name: coin.symbol,
    volume: coin.volume24h / 1000000000,
    change: coin.change24h,
  }));

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-yellow-500" />
          Piyasa Analiz Merkezi
        </h1>
        <p className="text-gray-400 text-sm mt-1">Tüm coin ve altcoinlerin otomatik analizi, sinyal ve pozisyon önerileri</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
          <p className="text-green-400 text-2xl font-bold">{mockMarketData.filter(c => c.signal === 'STRONG_BUY').length}</p>
          <p className="text-green-400/70 text-xs">Güçlü AL</p>
        </div>
        <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-3 text-center">
          <p className="text-green-400 text-2xl font-bold">{mockMarketData.filter(c => c.signal === 'BUY').length}</p>
          <p className="text-green-400/70 text-xs">AL</p>
        </div>
        <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-3 text-center">
          <p className="text-gray-300 text-2xl font-bold">{mockMarketData.filter(c => c.signal === 'NEUTRAL').length}</p>
          <p className="text-gray-400 text-xs">NÖTR</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
          <p className="text-red-400 text-2xl font-bold">{mockMarketData.filter(c => c.signal === 'SELL').length}</p>
          <p className="text-red-400/70 text-xs">SAT</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
          <p className="text-red-400 text-2xl font-bold">{mockMarketData.filter(c => c.signal === 'STRONG_SELL').length}</p>
          <p className="text-red-400/70 text-xs">Güçlü SAT</p>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3">24s Hacim Dağılımı (Milyar $)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }} />
            <Bar dataKey="volume" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Coin ara... (BTC, ETH, SOL...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {['all', 'STRONG_BUY', 'BUY', 'NEUTRAL', 'SELL', 'STRONG_SELL'].map(signal => (
              <button
                key={signal}
                onClick={() => setSignalFilter(signal)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  signalFilter === signal ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {signal === 'all' ? 'Tümü' : getSignalText(signal)}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="change24h">24s Değişim</option>
            <option value="volume">Hacim</option>
            <option value="rsi">RSI</option>
          </select>
        </div>
      </div>

      {/* Market Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Coin</th>
                <th className="text-right text-gray-400 text-xs font-medium px-4 py-3">Fiyat</th>
                <th className="text-right text-gray-400 text-xs font-medium px-4 py-3">24s %</th>
                <th className="text-right text-gray-400 text-xs font-medium px-4 py-3">7g %</th>
                <th className="text-center text-gray-400 text-xs font-medium px-4 py-3">RSI</th>
                <th className="text-center text-gray-400 text-xs font-medium px-4 py-3">Trend</th>
                <th className="text-center text-gray-400 text-xs font-medium px-4 py-3">Volatilite</th>
                <th className="text-center text-gray-400 text-xs font-medium px-4 py-3">Sinyal</th>
                <th className="text-center text-gray-400 text-xs font-medium px-4 py-3">Öneri</th>
                <th className="text-center text-gray-400 text-xs font-medium px-4 py-3">Detay</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(coin => {
                const rec = getRecommendation(coin);
                return (
                  <tr key={coin.pair} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-yellow-500/10 rounded-full flex items-center justify-center">
                          <span className="text-yellow-400 text-xs font-bold">{coin.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{coin.symbol}</p>
                          <p className="text-gray-500 text-[10px]">{coin.pair}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-white text-sm">${coin.price.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right text-sm font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </td>
                    <td className={`px-4 py-3 text-right text-sm ${coin.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change7d >= 0 ? '+' : ''}{coin.change7d}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-12 bg-gray-700 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${coin.rsi > 70 ? 'bg-red-500' : coin.rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${coin.rsi}%` }} />
                        </div>
                        <span className="text-gray-300 text-xs w-6">{coin.rsi}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{getTrendIcon(coin.trend)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${coin.volatility > 6 ? 'bg-red-500/10 text-red-400' : coin.volatility > 4 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                        %{coin.volatility}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${getSignalColor(coin.signal)}`}>
                        {getSignalText(coin.signal)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {rec.type === 'futures' ? (
                          <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-medium">
                            <Zap className="w-3 h-3 inline mr-0.5" />{rec.leverage}x Futures
                          </span>
                        ) : rec.type === 'spot' ? (
                          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-medium">
                            <Shield className="w-3 h-3 inline mr-0.5" />Spot
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-600/50 text-gray-400 px-2 py-0.5 rounded">
                            Bekle
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedCoin(coin)}
                        className="text-yellow-400 text-xs hover:text-yellow-300 font-medium"
                      >
                        Analiz →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coin Detail Modal */}
      {selectedCoin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCoin(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 font-bold">{selectedCoin.symbol.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedCoin.pair}</h2>
                  <p className="text-gray-400 text-sm">${selectedCoin.price.toLocaleString()}</p>
                </div>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${getSignalColor(selectedCoin.signal)}`}>
                {getSignalText(selectedCoin.signal)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div>
                <h4 className="text-white font-medium mb-3">Teknik Analiz Özeti</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <PolarRadiusAxis tick={false} domain={[0, 100]} />
                    <Radar name="Analiz" dataKey="value" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Recommendation */}
              <div>
                <h4 className="text-white font-medium mb-3">Sistem Önerisi</h4>
                <div className={`rounded-xl p-4 border ${
                  getRecommendation(selectedCoin).type === 'futures' ? 'bg-purple-500/5 border-purple-500/20' :
                  getRecommendation(selectedCoin).type === 'spot' ? 'bg-blue-500/5 border-blue-500/20' :
                  'bg-gray-700/50 border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getRecommendation(selectedCoin).type === 'futures' ? (
                      <Zap className="w-5 h-5 text-purple-400" />
                    ) : getRecommendation(selectedCoin).type === 'spot' ? (
                      <Shield className="w-5 h-5 text-blue-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-white font-semibold">
                      {getRecommendation(selectedCoin).type === 'futures' ? `${selectedCoin.recommendedLeverage}x Futures İşlem` :
                       getRecommendation(selectedCoin).type === 'spot' ? 'Spot İşlem' : 'İşlem Yapma'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{getRecommendation(selectedCoin).reason}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Önerilen Sermaye:</span>
                      <span className="text-white font-medium">${(selectedCoin.recommendedPosition * 1000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Kaldıraç:</span>
                      <span className="text-yellow-400 font-medium">{selectedCoin.recommendedLeverage}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Portföy Payı:</span>
                      <span className="text-white font-medium">%{selectedCoin.recommendedPosition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Stop Loss:</span>
                      <span className="text-red-400 font-medium">%{(selectedCoin.volatility * 0.8).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Take Profit:</span>
                      <span className="text-green-400 font-medium">%{(selectedCoin.volatility * 1.5).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-[10px]">MACD</p>
                    <p className={`text-xs font-medium ${selectedCoin.macdSignal.includes('Pozitif') ? 'text-green-400' : selectedCoin.macdSignal.includes('Negatif') ? 'text-red-400' : 'text-gray-300'}`}>
                      {selectedCoin.macdSignal}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-[10px]">RSI(14)</p>
                    <p className={`text-xs font-medium ${selectedCoin.rsi > 70 ? 'text-red-400' : selectedCoin.rsi < 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {selectedCoin.rsi}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-700">
              <button onClick={() => setSelectedCoin(null)} className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700">Kapat</button>
              <button className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600">
                Bu Coin İçin Bot Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalyzer;
