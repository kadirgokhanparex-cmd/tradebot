import React, { useState } from 'react';
import { Play, Pause, Trash2, Plus, Settings, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Çalışıyor';
      case 'stopped': return 'Durduruldu';
      case 'error': return 'Hata';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'stopped': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Botları</h1>
          <p className="text-gray-400 text-sm mt-1">Botlarınızı yönetin ve durumlarını takip edin</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(bot.status)}
                <div>
                  <h3 className="text-white font-semibold">{bot.name}</h3>
                  <p className="text-gray-400 text-sm">{bot.pair} • {bot.strategy}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(bot.status)}`}>
                {getStatusText(bot.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-2">
                <p className="text-gray-400 text-xs">İşlem Sayısı</p>
                <p className="text-white font-semibold">{bot.trades}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2">
                <p className="text-gray-400 text-xs">Kazanma Oranı</p>
                <p className="text-white font-semibold">%{bot.winRate}</p>
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
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">Yeni Bot Oluştur</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Bot Adı</label>
                <input
                  type="text"
                  placeholder="Örn: BTC Grid Bot"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">İşlem Çifti</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                  <option>BTC/USDT</option>
                  <option>ETH/USDT</option>
                  <option>SOL/USDT</option>
                  <option>BNB/USDT</option>
                  <option>XRP/USDT</option>
                  <option>ADA/USDT</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Strateji</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                  <option>Grid Trading</option>
                  <option>DCA</option>
                  <option>Scalping</option>
                  <option>Momentum</option>
                  <option>Arbitrage</option>
                  <option>Mean Reversion</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Yatırım (USDT)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Stop Loss (%)</label>
                  <input
                    type="number"
                    placeholder="5"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Take Profit (%)</label>
                <input
                  type="number"
                  placeholder="10"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Bot Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bot Settings Modal */}
      {selectedBot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">{selectedBot.name} Ayarları</h2>
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
                    <label className="text-gray-400 text-xs mb-1 block">Max Pozisyon</label>
                    <input type="number" defaultValue={3} className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">İşlem Sıklığı</label>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500">
                      <option>1 dakika</option>
                      <option>5 dakika</option>
                      <option>15 dakika</option>
                      <option>1 saat</option>
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
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setSelectedBot(null)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={() => setSelectedBot(null)}
                className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bots;
