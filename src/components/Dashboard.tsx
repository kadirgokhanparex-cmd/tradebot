import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Activity, Bot, Target, ArrowUpRight, Zap, Shield } from 'lucide-react';
import { mockBots, mockMarketData, mockOpenPositions, mockLiveActivities, generatePortfolioHistory } from '../data';
import ConnectionStatus from './ConnectionStatus';
import LivePrices from './LivePrices';
import LiveChart from './LiveChart';

const Dashboard: React.FC = () => {
  const INITIAL_CAPITAL = 10000; // Başlangıç sermayesi: 10,000 USDT
  
  const portfolioHistory = useMemo(() => generatePortfolioHistory(), []);
  
  const totalValue = useMemo(() => {
    const botsValue = mockBots.reduce((sum, bot) => sum + bot.currentValue, 0);
    return botsValue > 0 ? botsValue : INITIAL_CAPITAL;
  }, []);
  
  const totalProfit = useMemo(() => mockBots.reduce((sum, bot) => sum + bot.profit, 0), []);
  const totalInvestment = useMemo(() => mockBots.reduce((sum, bot) => sum + bot.investment, 0), []);
  const totalProfitPercent = useMemo(() => {
    if (totalInvestment === 0) return 0;
    return (totalProfit / totalInvestment) * 100;
  }, [totalProfit, totalInvestment]);
  
  const activeBots = useMemo(() => mockBots.filter(b => b.status === 'running').length, []);
  const totalPnl = useMemo(() => mockOpenPositions.reduce((sum, p) => sum + p.pnl, 0), []);

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
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">+{totalProfitPercent.toFixed(2)}%</span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Toplam Kar</span>
            <TrendingUp className="w-5 h-5 text-gray-500" />
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
                  {totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
                </span>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Açık Pozisyon PnL</span>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          {mockOpenPositions.length === 0 ? (
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
                <span className="text-gray-400 text-sm">{mockOpenPositions.length} açık pozisyon</span>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Aktif Botlar</span>
            <Bot className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-white">{activeBots}/{mockBots.length}</p>
          <div className="flex items-center gap-1 mt-2">
            {activeBots === 0 ? (
              <span className="text-gray-500 text-xs">Bot başlatılmadı</span>
            ) : (
              <>
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Çalışıyor</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Chart + Portfolio */}
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
            <p className="text-gray-400 text-sm">Son 30 gün</p>
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

      {/* Bot Status + Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-4 h-4 text-yellow-500" />
            Bot Durumları & Mevcut İşlemler
          </h3>
          {activeBots === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-2">Henüz bot başlatılmadı</p>
              <p className="text-gray-500 text-xs">Bot oluşturup başlatmak için "Trading Botları" sekmesine gidin</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockBots.filter(b => b.status === 'running').map((bot) => (
                <div key={bot.id} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white text-sm font-medium">{bot.name}</span>
                      <span className="text-gray-500 text-xs">{bot.pair}</span>
                    </div>
                    <span className={`text-xs font-medium ${bot.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {bot.profit >= 0 ? '+' : ''}{bot.profitPercent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400 mb-1">
                    <Zap className="w-3 h-3" />
                    <span className="truncate">{bot.currentAction}</span>
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {bot.currentIndicator}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
            Son Aktiviteler
          </h3>
          {mockLiveActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-2">Henüz aktivite yok</p>
              <p className="text-gray-500 text-xs">Botlar başlatıldığında aktiviteler burada görünecek</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mockLiveActivities.slice(0, 8).map((activity) => (
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
                    <p className="text-gray-400 text-[11px] truncate">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-yellow-500" />
          Açık Pozisyonlar
        </h3>
        {mockOpenPositions.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-2">Açık pozisyon yok</p>
            <p className="text-gray-500 text-xs">Botlar işlem açtığında pozisyonlar burada görünecek</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockOpenPositions.map(pos => (
              <div key={pos.id} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{pos.pair}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${pos.type === 'LONG' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {pos.type} {pos.isSpot ? '(SPOT)' : `(${pos.leverage}x)`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">Giriş: ${pos.entryPrice}</span>
                  <span className={`text-sm font-bold ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}$
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-500 text-[10px]">SL: ${pos.stopLoss} | TP: ${pos.takeProfit}</span>
                  <span className={`text-[10px] ${pos.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnlPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Market Signals */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Piyasa Sinyalleri</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs font-medium pb-3">Parite</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">Fiyat</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">24s</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">RSI</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">Sinyal</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">Öneri</th>
              </tr>
            </thead>
            <tbody>
              {mockMarketData.slice(0, 8).map((market) => (
                <tr key={market.pair} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-2.5"><span className="text-white text-sm font-medium">{market.pair}</span></td>
                  <td className="py-2.5 text-right"><span className="text-white text-sm">${market.price.toLocaleString()}</span></td>
                  <td className={`py-2.5 text-right text-sm font-medium ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h}%
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`text-xs ${market.rsi > 70 ? 'text-red-400' : market.rsi < 30 ? 'text-green-400' : 'text-yellow-400'}`}>{market.rsi}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      market.signal === 'STRONG_BUY' ? 'bg-green-500 text-white' :
                      market.signal === 'BUY' ? 'bg-green-500/20 text-green-400' :
                      market.signal === 'NEUTRAL' ? 'bg-gray-600 text-gray-300' :
                      market.signal === 'SELL' ? 'bg-red-500/20 text-red-400' :
                      'bg-red-500 text-white'
                    }`}>
                      {market.signal === 'STRONG_BUY' ? 'GÜÇLÜ AL' : market.signal === 'BUY' ? 'AL' : market.signal === 'NEUTRAL' ? 'NÖTR' : market.signal === 'SELL' ? 'SAT' : 'GÜÇLÜ SAT'}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    {market.isSpot ? (
                      <span className="text-xs text-blue-400">Spot</span>
                    ) : (
                      <span className="text-xs text-purple-400">{market.recommendedLeverage}x Futures</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
