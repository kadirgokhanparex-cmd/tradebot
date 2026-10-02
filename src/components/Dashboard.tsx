import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Activity, Bot, Target, ArrowUpRight, Zap, Shield, Play, Pause } from 'lucide-react';
import { generatePortfolioHistory } from '../data';
import { autoTradingEngine } from '../engine/AutoTradingEngine';
import ConnectionStatus from './ConnectionStatus';
import LivePrices from './LivePrices';
import LiveChart from './LiveChart';

const Dashboard: React.FC = () => {
  const INITIAL_CAPITAL = 10000;
  const [engineState, setEngineState] = useState(autoTradingEngine.getState());
  const [isAutoTrading, setIsAutoTrading] = useState(false);

  useEffect(() => {
    autoTradingEngine.setOnStateChange(() => {
      setEngineState(autoTradingEngine.getState());
    });

    // Update positions every 10 seconds
    const updateInterval = setInterval(() => {
      if (isAutoTrading) {
        autoTradingEngine.updatePositions();
      }
    }, 10000);

    return () => clearInterval(updateInterval);
  }, [isAutoTrading]);

  const handleToggleAutoTrading = async () => {
    if (isAutoTrading) {
      await autoTradingEngine.stop();
      setIsAutoTrading(false);
    } else {
      await autoTradingEngine.start();
      setIsAutoTrading(true);
    }
  };

  const portfolioHistory = useMemo(() => generatePortfolioHistory(), []);
  
  const totalValue = useMemo(() => {
    const positionsValue = engineState.openPositions.reduce((sum, pos) => sum + (pos.amount * pos.currentPrice), 0);
    return positionsValue > 0 ? positionsValue : INITIAL_CAPITAL;
  }, [engineState.openPositions]);
  
  const totalProfit = useMemo(() => engineState.openPositions.reduce((sum, pos) => sum + pos.pnl, 0), [engineState.openPositions]);
  const totalPnl = totalProfit;
  const activeBots = isAutoTrading ? 1 : 0;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Binance Testnet - Otomatik Trading Kontrol Paneli</p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <button
            onClick={handleToggleAutoTrading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isAutoTrading
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
            }`}
          >
            {isAutoTrading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAutoTrading ? 'Durdur' : 'Otomatik Trading Başlat'}
          </button>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-medium">Testnet</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Toplam Portföy</span>
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-gray-400 text-xs">Başlangıç: $10,000</span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Toplam Kar/Zarar</span>
            <TrendingUp className={`w-5 h-5 ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          {totalProfit === 0 ? (
            <>
              <p className="text-xl font-bold text-gray-400">$0.00</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-gray-500 text-xs">Henüz işlem yok</span>
              </div>
            </>
          ) : (
            <>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className={`w-4 h-4 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                <span className={`text-sm font-medium ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {((totalProfit / INITIAL_CAPITAL) * 100).toFixed(2)}%
                </span>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Açık Pozisyon PnL</span>
            <Activity className={`w-5 h-5 ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          {engineState.openPositions.length === 0 ? (
            <>
              <p className="text-xl font-bold text-gray-400">$0.00</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-gray-500 text-xs">Pozisyon yok</span>
              </div>
            </>
          ) : (
            <>
              <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}$
              </p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-gray-400 text-sm">{engineState.openPositions.length} açık pozisyon</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Otomatik Trading</span>
            <Bot className={`w-5 h-5 ${isAutoTrading ? 'text-green-500' : 'text-gray-500'}`} />
          </div>
          <p className="text-2xl font-bold text-white">{isAutoTrading ? 'Aktif' : 'Pasif'}</p>
          <div className="flex items-center gap-1 mt-2">
            {isAutoTrading ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs">Çalışıyor</span>
              </>
            ) : (
              <span className="text-gray-500 text-xs">Başlatılmadı</span>
            )}
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

      {/* Portfolio Chart */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold">Portföy Değeri</h3>
            <p className="text-gray-400 text-sm">Son 7 gün</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={portfolioHistory}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Değer']} />
            <Area type="monotone" dataKey="value" stroke="#eab308" fill="url(#portfolioGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Open Positions + Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Positions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            Açık Pozisyonlar ({engineState.openPositions.length})
          </h3>
          {engineState.openPositions.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-2">Açık pozisyon yok</p>
              <p className="text-gray-500 text-xs">Otomatik trading başlatıldığında pozisyonlar burada görünecek</p>
            </div>
          ) : (
            <div className="space-y-3">
              {engineState.openPositions.map(pos => (
                <div key={pos.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{pos.pair}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${pos.type === 'LONG' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {pos.type} {pos.isSpot ? '(SPOT)' : `(${pos.leverage}x)`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Giriş: ${pos.entryPrice.toFixed(2)}</span>
                    <span className={`text-sm font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}$
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-500 text-[10px]">SL: ${pos.stopLoss.toFixed(2)} | TP: ${pos.takeProfit.toFixed(2)}</span>
                    <span className={`text-[10px] ${pos.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnlPercent.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activities */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
            Canlı Aktiviteler
          </h3>
          {engineState.activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-2">Henüz aktivite yok</p>
              <p className="text-gray-500 text-xs">Otomatik trading başlatıldığında aktiviteler burada görünecek</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {engineState.activities.slice(0, 15).map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.type === 'buy' ? 'bg-green-500' :
                    activity.type === 'sell' ? 'bg-red-500' :
                    activity.type === 'alert' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">{activity.botName}</span>
                      <span className="text-gray-500 text-[10px]">{activity.timestamp}</span>
                    </div>
                    <p className={`text-xs font-semibold mt-0.5 ${
                      activity.type === 'buy' ? 'text-green-400' :
                      activity.type === 'sell' ? 'text-red-400' :
                      activity.type === 'alert' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>{activity.action}</p>
                    <p className="text-gray-400 text-[11px] truncate">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
