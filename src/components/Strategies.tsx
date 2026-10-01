import React from 'react';
import { Shield, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { mockStrategies } from '../data';

const Strategies: React.FC = () => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return '';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Düşük Risk';
      case 'medium': return 'Orta Risk';
      case 'high': return 'Yüksek Risk';
      default: return risk;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Trading Stratejileri</h1>
        <p className="text-gray-400 text-sm mt-1">Kullanılabilir otomatik trading stratejileri</p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="text-yellow-400 font-semibold mb-1">Otomatik Strateji Motoru</h3>
            <p className="text-gray-300 text-sm">
              Stratejilerimiz teknik göstergeler, yapay zeka ve makine öğrenimi algoritmaları kullanılarak 
              7/24 piyasa koşullarına göre otomatik işlem yapar. Her strateji backtest ile doğrulanmıştır.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockStrategies.map((strategy) => (
          <div key={strategy.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">{strategy.name}</h3>
                <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full border text-xs ${getRiskColor(strategy.risk)}`}>
                  {getRiskIcon(strategy.risk)}
                  {getRiskText(strategy.risk)}
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-5 leading-relaxed">{strategy.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Ort. Getiri</p>
                <p className="text-green-400 font-bold text-lg">%{strategy.avgReturn}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Maks. Düşüş</p>
                <p className="text-red-400 font-bold text-lg">-%{strategy.maxDrawdown}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Kazanma Oranı</p>
                <p className="text-white font-bold text-lg">%{strategy.winRate}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">İşlem/Gün</p>
                <p className="text-white font-bold text-lg">{strategy.tradesPerDay}</p>
              </div>
            </div>

            {/* Indicators */}
            <div className="mb-5">
              <p className="text-gray-400 text-xs mb-2">Kullanılan İndikatörler</p>
              <div className="flex flex-wrap gap-2">
                {strategy.indicators.map((indicator) => (
                  <span key={indicator} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                    {indicator}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-xs">Performans Skoru</span>
                <span className="text-yellow-400 text-xs font-medium">{strategy.winRate}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${strategy.winRate}%` }}
                />
              </div>
            </div>

            <button className="w-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg py-2.5 text-sm font-medium hover:bg-yellow-500/20 transition-colors">
              Bu Strateji ile Bot Oluştur
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strategies;
