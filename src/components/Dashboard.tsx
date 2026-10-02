import React, { useState, useEffect } from 'react';
import { Play, Pause, TrendingUp, DollarSign, Activity, Bot } from 'lucide-react';
import { autoTradingEngine } from '../engine/AutoTradingEngine';
import ConnectionStatus from './ConnectionStatus';
import LivePrices from './LivePrices';
import LiveChart from './LiveChart';

const Dashboard: React.FC = () => {
  const [engineState, setEngineState] = useState(autoTradingEngine.getState());
  const [isAutoTrading, setIsAutoTrading] = useState(false);

  useEffect(() => {
    autoTradingEngine.setOnStateChange(() => {
      setEngineState(autoTradingEngine.getState());
    });
  }, []);

  const handleToggleAutoTrading = async () => {
    console.log('🔄 Bot durumu değiştiriliyor...');
    if (isAutoTrading) {
      console.log('⏹️ Bot durduruluyor...');
      await autoTradingEngine.stop();
      setIsAutoTrading(false);
    } else {
      console.log('🚀 Bot başlatılıyor...');
      await autoTradingEngine.start();
      setIsAutoTrading(true);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Otomatik Trading Bot - Simülasyon Modu</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <button
            onClick={handleToggleAutoTrading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              isAutoTrading
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/50'
            }`}
          >
            {isAutoTrading ? (
              <>
                <Pause className="w-5 h-5" />
                BOTU DURDUR
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                BOTU BAŞLAT
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Sermaye</span>
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            ${engineState.currentCapital.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-gray-400 text-xs">Başlangıç: $10,000</span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Toplam PnL</span>
            <TrendingUp className={`w-5 h-5 ${engineState.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <p className={`text-2xl font-bold ${engineState.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {engineState.totalPnl >= 0 ? '+' : ''}${engineState.totalPnl.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-gray-400 text-xs">
              {engineState.totalPnl >= 0 ? 'Kâr' : 'Zarar'}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Açık Pozisyon</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">{engineState.openPositions.length}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-gray-400 text-xs">Maksimum: 3</span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Toplam İşlem</span>
            <Bot className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white">{engineState.trades.length}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-gray-400 text-xs">
              {isAutoTrading ? '🟢 Aktif' : '🔴 Pasif'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Chart + Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveChart />
        </div>
        <div>
          <LivePrices />
        </div>
      </div>

      {/* Open Positions + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Positions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            Açık Pozisyonlar ({engineState.openPositions.length}/3)
          </h3>
          {engineState.openPositions.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-lg mb-2">Açık pozisyon yok</p>
              <p className="text-gray-500 text-sm">
                {isAutoTrading ? 'Bot pozisyon açmayı bekliyor...' : 'Botu başlatın ve otomatik işlem açsın'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {engineState.openPositions.map(pos => (
                <div key={pos.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-lg font-bold">{pos.pair}</span>
                    <span className={`text-sm px-3 py-1 rounded font-bold ${
                      pos.type === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {pos.type} {pos.isSpot ? '(SPOT)' : `(${pos.leverage}x)`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="text-gray-400 text-xs">Giriş Fiyatı</span>
                      <p className="text-white font-semibold">${pos.entryPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">Güncel Fiyat</span>
                      <p className="text-white font-semibold">${pos.currentPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-600/50">
                    <div>
                      <span className="text-gray-400 text-xs">PnL</span>
                      <p className={`text-lg font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 text-xs">Yüzde</span>
                      <p className={`text-lg font-bold ${pos.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>SL: ${pos.stopLoss.toFixed(2)}</span>
                    <span>TP: ${pos.takeProfit.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activities */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            Canlı Aktiviteler
          </h3>
          {engineState.activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-lg mb-2">Henüz aktivite yok</p>
              <p className="text-gray-500 text-sm">Botu başlatın ve aktiviteleri görün</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {engineState.activities.slice(0, 20).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'buy' ? 'bg-green-500' :
                    activity.type === 'sell' ? 'bg-red-500' :
                    activity.type === 'alert' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-semibold">{activity.botName}</span>
                      <span className="text-gray-500 text-xs">{activity.timestamp}</span>
                    </div>
                    <p className={`text-sm font-bold mb-1 ${
                      activity.type === 'buy' ? 'text-green-400' :
                      activity.type === 'sell' ? 'text-red-400' :
                      activity.type === 'alert' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {activity.action}
                    </p>
                    <p className="text-gray-400 text-xs">{activity.details}</p>
                    {activity.price && (
                      <p className="text-gray-500 text-xs mt-1">
                        {activity.pair} • ${activity.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      {isAutoTrading && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-pulse">
          <div className="w-3 h-3 bg-white rounded-full animate-ping" />
          <span className="font-bold">BOT ÇALIŞIYOR</span>
          <span className="text-sm">• Her 10 saniyede tarama</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
