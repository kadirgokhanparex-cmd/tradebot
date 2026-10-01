import React from 'react';
import { Shield, TrendingUp, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
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

  const getBestFor = (strategy: string) => {
    switch (strategy) {
      case 'Grid Trading': return 'Yatay Piyasa';
      case 'DCA (Dollar Cost Averaging)': return 'Uzun Vade';
      case 'Scalping': return 'Yüksek Volatilite';
      case 'Momentum': return 'Güçlü Trend';
      case 'Arbitrage': return 'Düşük Spread';
      case 'Mean Reversion': return 'Aşırı Uzaklaşma';
      case 'Breakout': return 'Direnç Kırılımı';
      case 'Swing Trading': return 'Orta Vadeli Dalga';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Trading Stratejileri</h1>
        <p className="text-gray-400 text-sm mt-1">Otomatik trading stratejileri - Hangi piyasa koşulunda hangi strateji kullanılmalı</p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <h3 className="text-yellow-400 font-semibold mb-1">Akıllı Strateji Motoru</h3>
            <p className="text-gray-300 text-sm">
              Sistemimiz piyasa koşullarını gerçek zamanlı analiz ederek en uygun stratejiyi otomatik seçer. 
              Birden fazla indikatörün konfirmasyonu olmadan işlem açılmaz. 
              Her strateji backtest ile doğrulanmış ve Binance Testnet üzerinde test edilmiştir.
            </p>
          </div>
        </div>
      </div>

      {/* Strategy Selection Guide */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">📊 Piyasa Koşuluna Göre Strateji Seçimi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 font-medium text-sm mb-1">📈 Yükseliş Trendi</p>
            <p className="text-gray-300 text-xs">Momentum, Breakout, DCA</p>
            <p className="text-gray-500 text-[10px] mt-1">ADX {'>'} 25, EMA yukarı kesişim</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 font-medium text-sm mb-1">📉 Düşüş Trendi</p>
            <p className="text-gray-300 text-xs">Mean Reversion, Scalping (Short)</p>
            <p className="text-gray-500 text-[10px] mt-1">RSI {'<'} 30, MACD negatif cross</p>
          </div>
          <div className="bg-gray-600/20 border border-gray-600 rounded-lg p-3">
            <p className="text-gray-300 font-medium text-sm mb-1">↔️ Yatay Piyasa</p>
            <p className="text-gray-300 text-xs">Grid Trading, Arbitrage</p>
            <p className="text-gray-500 text-[10px] mt-1">BB sıkışma, ADX {'<'} 20</p>
          </div>
        </div>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockStrategies.map((strategy) => (
          <div key={strategy.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-lg">{strategy.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${getRiskColor(strategy.risk)}`}>
                    {getRiskIcon(strategy.risk)}
                    {getRiskText(strategy.risk)}
                  </div>
                  <span className="text-gray-500 text-xs">En iyi: {getBestFor(strategy.name)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{strategy.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
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
            <div className="mb-4">
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
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all" style={{ width: `${strategy.winRate}%` }} />
              </div>
            </div>

            <button className="w-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg py-2.5 text-sm font-medium hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-2">
              Bu Strateji ile Bot Oluştur <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strategies;
