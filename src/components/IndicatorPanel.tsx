import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Activity, BarChart3, Waves, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { mockIndicators, generateIndicatorChart } from '../data';
import { Indicator } from '../types';

const IndicatorPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Tümü', icon: Activity, color: 'text-yellow-400' },
    { id: 'trend', name: 'Trend', icon: TrendingUp, color: 'text-green-400' },
    { id: 'momentum', name: 'Momentum', icon: Zap, color: 'text-blue-400' },
    { id: 'volatility', name: 'Volatilite', icon: Waves, color: 'text-purple-400' },
    { id: 'volume', name: 'Hacim', icon: BarChart3, color: 'text-orange-400' },
  ];

  const filteredIndicators = selectedCategory === 'all'
    ? mockIndicators
    : mockIndicators.filter(i => i.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trend': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'momentum': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'volatility': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'volume': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return '';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'trend': return 'Trend';
      case 'momentum': return 'Momentum';
      case 'volatility': return 'Volatilite';
      case 'volume': return 'Hacim';
      default: return category;
    }
  };

  const getSignalBadge = (signal?: string) => {
    switch (signal) {
      case 'buy': return <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded">AL Sinyali</span>;
      case 'sell': return <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded">SAT Sinyali</span>;
      default: return <span className="bg-gray-600/50 text-gray-400 text-xs px-2 py-0.5 rounded">Nötr</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-yellow-500" />
          Teknik İndikatörler
        </h1>
        <p className="text-gray-400 text-sm mt-1">Tüm indikatörlerin detaylı açıklaması, kullanım yerleri ve sinyal koşulları</p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/5 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>İndikatör Kullanım Rehberi:</strong> Her indikatör belirli piyasa koşullarında farklı performans gösterir. 
          Sistemimiz birden fazla indikatörü aynı anda analiz ederek <strong>konfirmasyon bazlı</strong> sinyal üretir. 
          Tek bir indikatöre bağlı karar verilmez.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${selectedCategory === cat.id ? cat.color : ''}`} />
              {cat.name}
              <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                {cat.id === 'all' ? mockIndicators.length : mockIndicators.filter(i => i.category === cat.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Indicator Cards */}
      <div className="space-y-4">
        {filteredIndicators.map((indicator) => {
          const isExpanded = expandedIndicator === indicator.id;
          const chartData = generateIndicatorChart(indicator.name);

          return (
            <div key={indicator.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              {/* Header */}
              <div
                className="p-5 cursor-pointer hover:bg-gray-700/30 transition-colors"
                onClick={() => setExpandedIndicator(isExpanded ? null : indicator.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(indicator.category)} border`}>
                      <span className="text-lg font-bold">{indicator.name.substring(0, 2)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-bold text-lg">{indicator.name}</h3>
                        <span className="text-gray-400 text-sm">({indicator.fullName})</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(indicator.category)}`}>
                          {getCategoryName(indicator.category)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{indicator.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        {getSignalBadge(indicator.signal)}
                        <span className="text-gray-500 text-xs">En iyi zaman dilimi: {indicator.bestTimeframe}</span>
                        {indicator.currentValue !== undefined && (
                          <span className="text-yellow-400 text-xs font-medium">Güncel: {indicator.currentValue}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-700 p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* When to use */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h4 className="text-yellow-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Ne Zaman Kullanılır?
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{indicator.whenToUse}</p>
                    </div>

                    {/* Signals */}
                    <div className="space-y-3">
                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <h4 className="text-green-400 font-semibold text-xs mb-1">🟢 AL Sinyali</h4>
                        <p className="text-gray-300 text-sm">{indicator.buySignal}</p>
                      </div>
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                        <h4 className="text-red-400 font-semibold text-xs mb-1">🔴 SAT Sinyali</h4>
                        <p className="text-gray-300 text-sm">{indicator.sellSignal}</p>
                      </div>
                    </div>
                  </div>

                  {/* Parameters */}
                  {indicator.parameters.length > 0 && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h4 className="text-white font-semibold text-sm mb-3">Parametreler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {indicator.parameters.map((param) => (
                          <div key={param.name} className="bg-gray-800 rounded-lg p-3">
                            <p className="text-gray-400 text-xs mb-1">{param.name}</p>
                            <p className="text-white font-bold text-lg">{param.defaultValue}</p>
                            <p className="text-gray-500 text-[10px]">Min: {param.min} - Max: {param.max}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chart */}
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-3">Canlı Gösterge Değeri</h4>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={10} />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '11px' }} />
                        {indicator.name === 'RSI' && (
                          <>
                            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
                          </>
                        )}
                        <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Strategy Compatibility */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h4 className="text-white font-semibold text-sm mb-3">Uyumlu Stratejiler</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Grid Trading', 'Scalping', 'Momentum', 'DCA', 'Swing Trading', 'Breakout'].map(strat => (
                        <span key={strat} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-gray-600">
                          {strat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndicatorPanel;
