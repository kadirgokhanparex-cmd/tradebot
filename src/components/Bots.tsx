import React, { useState } from 'react';
import { Play, Pause, Trash2, Plus, Settings, AlertCircle, CheckCircle, XCircle, Zap, Shield } from 'lucide-react';
import { mockBots } from '../data';
import { Bot } from '../types';

const Bots: React.FC = () => {
  const [bots, setBots] = useState<Bot[]>(mockBots);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  const toggleBot = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id ? { ...bot, status: bot.status === 'running' ? 'stopped' : 'running' } : bot
    ));
  };

  const deleteBot = (id: string) => {
    setBots(bots.filter(bot => bot.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'stopped': return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'analyzing': return <Zap className="w-4 h-4 text-blue-400 animate-pulse" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Çalışıyor';
      case 'stopped': return 'Durduruldu';
      case 'error': return 'Hata';
      case 'analyzing': return 'Analiz Ediliyor';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'stopped': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'analyzing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Botları</h1>
          <p className="text-gray-400 text-sm mt-1">Botlarınızı yönetin, mevcut işlemlerini ve stratejilerini takip edin</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Bot Oluştur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Aktif</p>
            <p className="text-white font-bold text-lg">{bots.filter(b => b.status === 'running').length}</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <Pause className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Durdurulmuş</p>
            <p className="text-white font-bold text-lg">{bots.filter(b => b.status === 'stopped').length}</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Analiz</p>
            <p className="text-white font-bold text-lg">{bots.filter(b => b.status === 'analyzing').length}</p>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Hatalı</p>
            <p className="text-white font-bold text-lg">{bots.filter(b => b.status === 'error').length}</p>
          </div>
        </div>
      </div>

      {/* Bot Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(bot.status)}
                <div>
                  <h3 className="text-white font-semibold">{bot.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-400 text-sm">{bot.pair}</p>
                    <span className="text-gray-600">•</span>
                    <p className="text-gray-400 text-sm">{bot.strategy}</p>
                    {bot.isSpot ? (
                      <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Shield className="w-3 h-3" />SPOT
                      </span>
                    ) : (
                      <span className="text-xs bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />{bot.leverage}x FUTURES
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(bot.status)}`}>
                {getStatusText(bot.status)}
              </span>
            </div>

            {/* Current Action */}
            <div className="bg-gray-700/50 rounded-lg p-3 mb-3 border border-gray-600/50">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-medium">Mevcut İşlem:</span>
              </div>
              <p className="text-white text-sm">{bot.currentAction}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-500 text-[10px]">Sonraki:</span>
                <span className="text-gray-400 text-[11px]">{bot.nextAction}</span>
              </div>
              <div className="mt-1.5 text-[10px] text-blue-400 font-mono bg-gray-800 rounded px-2 py-1">
                {bot.currentIndicator}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-gray-400 text-xs mb-1">Kar/Zarar</p>
                <p className={`text-lg font-bold ${bot.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {bot.profit >= 0 ? '+' : ''}{bot.profit.toFixed(2)} USDT
                </p>
                <p className={`text-xs ${bot.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {bot.profitPercent >= 0 ? '+' : ''}{bot.profitPercent}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Yatırım</p>
                <p className="text-white text-lg font-bold">${bot.investment.toLocaleString()}</p>
                <p className="text-gray-400 text-xs">→ ${bot.currentValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                <p className="text-gray-400 text-[10px]">İşlem</p>
                <p className="text-white font-semibold text-sm">{bot.trades}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                <p className="text-gray-400 text-[10px]">Kazanma</p>
                <p className="text-white font-semibold text-sm">%{bot.winRate}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2 text-center">
                <p className="text-gray-400 text-[10px]">Mod</p>
                <p className={`font-semibold text-sm ${bot.isSpot ? 'text-blue-400' : 'text-purple-400'}`}>
                  {bot.isSpot ? 'Spot' : `${bot.leverage}x`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
              <button
                onClick={() => toggleBot(bot.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  bot.status === 'running'
                    ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                }`}
              >
                {bot.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {bot.status === 'running' ? 'Durdur' : 'Başlat'}
              </button>
              <button
                onClick={() => setSelectedBot(bot)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteBot(bot.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Bot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">Yeni Bot Oluştur</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Bot Adı</label>
                <input type="text" placeholder="Örn: BTC Grid Bot" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">İşlem Çifti</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                  <option>BTC/USDT</option><option>ETH/USDT</option><option>SOL/USDT</option>
                  <option>BNB/USDT</option><option>XRP/USDT</option><option>ADA/USDT</option>
                  <option>DOGE/USDT</option><option>AVAX/USDT</option><option>LINK/USDT</option>
                  <option>NEAR/USDT</option><option>DOT/USDT</option><option>MATIC/USDT</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Strateji</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                  <option>Grid Trading</option><option>DCA</option><option>Scalping</option>
                  <option>Momentum</option><option>Arbitrage</option><option>Mean Reversion</option>
                  <option>Breakout</option><option>Swing Trading</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">İşlem Tipi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg py-2 text-sm font-medium hover:bg-blue-500/20">
                    <Shield className="w-4 h-4 inline mr-1" />SPOT
                  </button>
                  <button className="bg-gray-700 border border-gray-600 text-gray-400 rounded-lg py-2 text-sm font-medium hover:bg-gray-600">
                    <Zap className="w-4 h-4 inline mr-1" />FUTURES
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Yatırım (USDT)</label>
                  <input type="number" placeholder="1000" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Kaldıraç (Futures)</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                    <option>1x</option><option>2x</option><option>3x</option><option>5x</option><option>10x</option><option>20x</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Stop Loss (%)</label>
                  <input type="number" placeholder="5" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Take Profit (%)</label>
                  <input type="number" placeholder="10" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Maks. Eşzamanlı Pozisyon</label>
                <input type="number" placeholder="3" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">İptal</button>
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition-colors">Bot Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {/* Bot Settings Modal */}
      {selectedBot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-2">{selectedBot.name}</h2>
            <p className="text-gray-400 text-sm mb-5">{selectedBot.pair} • {selectedBot.strategy} • {selectedBot.isSpot ? 'SPOT' : `${selectedBot.leverage}x FUTURES`}</p>
            
            {/* Current Status */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-5 border border-gray-600/50">
              <h4 className="text-yellow-400 font-medium text-sm mb-2 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Mevcut Durum
              </h4>
              <p className="text-white text-sm mb-1">{selectedBot.currentAction}</p>
              <p className="text-gray-400 text-xs">Sonraki: {selectedBot.nextAction}</p>
              <p className="text-blue-400 text-[10px] font-mono mt-1 bg-gray-800 rounded px-2 py-1">{selectedBot.currentIndicator}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Risk Yönetimi</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Stop Loss (%)</label>
                    <input type="number" defaultValue={5} className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Take Profit (%)</label>
                    <input type="number" defaultValue={10} className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Maks. Pozisyon</label>
                    <input type="number" defaultValue={3} className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">İşlem Sıklığı</label>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500">
                      <option>1 dakika</option><option>5 dakika</option><option>15 dakika</option><option>1 saat</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">İndikatör Ayarları</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">RSI (14)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Aşırı Alım:</span>
                      <input type="number" defaultValue={70} className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">RSI (14)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Aşırı Satım:</span>
                      <input type="number" defaultValue={30} className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">MACD Fast EMA</span>
                    <input type="number" defaultValue={12} className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-xs focus:outline-none" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">MACD Slow EMA</span>
                    <input type="number" defaultValue={26} className="w-16 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white text-xs focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setSelectedBot(null)} className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">Kapat</button>
              <button onClick={() => setSelectedBot(null)} className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition-colors">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bots;
