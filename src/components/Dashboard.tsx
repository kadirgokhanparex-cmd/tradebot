import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Bot, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockBots, mockTrades, mockMarketData, generatePortfolioHistory, generatePriceHistory } from '../data';

const Dashboard: React.FC = () => {
  const portfolioHistory = generatePortfolioHistory();
  const btcPriceHistory = generatePriceHistory(67250);
  
  const totalValue = mockBots.reduce((sum, bot) => sum + bot.currentValue, 0);
  const totalProfit = mockBots.reduce((sum, bot) => sum + bot.profit, 0);
  const totalInvestment = mockBots.reduce((sum, bot) => sum + bot.investment, 0);
  const totalProfitPercent = (totalProfit / totalInvestment) * 100;
  const activeBots = mockBots.filter(b => b.status === 'running').length;
  const todayProfit = 485.32;

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Portföyünüzün genel durumu</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Canlı</span>
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
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-400">+${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Son 30 gün</span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Bugünkü Kar</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">+${todayProfit.toFixed(2)}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">+0.87%</span>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Aktif Botlar</span>
            <Bot className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white">{activeBots}/{mockBots.length}</p>
          <div className="flex items-center gap-1 mt-2">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Ort. %74.3 kazanç</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Chart */}
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Portföy Değeri</h3>
              <p className="text-gray-400 text-sm">Son 30 gün</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">1H</span>
              <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">7G</span>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">1A</span>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Tümü</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
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
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Değer']}
              />
              <Area type="monotone" dataKey="value" stroke="#eab308" fill="url(#portfolioGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* BTC Price */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">BTC/USDT</h3>
              <p className="text-gray-400 text-sm">$67,250.00</p>
            </div>
            <span className="text-green-400 text-sm font-medium bg-green-500/10 px-2 py-1 rounded">+2.35%</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={btcPriceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} interval={8} />
              <YAxis stroke="#6b7280" fontSize={10} domain={['auto', 'auto']} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Fiyat']}
              />
              <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Bots */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Aktif Botlar</h3>
          <div className="space-y-3">
            {mockBots.filter(b => b.status === 'running').map((bot) => (
              <div key={bot.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${bot.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="text-white text-sm font-medium">{bot.name}</p>
                    <p className="text-gray-400 text-xs">{bot.pair} • {bot.strategy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${bot.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {bot.profit >= 0 ? '+' : ''}{bot.profit.toFixed(2)} USDT
                  </p>
                  <p className={`text-xs ${bot.profitPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {bot.profitPercent >= 0 ? '+' : ''}{bot.profitPercent}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Son İşlemler</h3>
          <div className="space-y-2">
            {mockTrades.slice(0, 6).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    trade.type === 'BUY' ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    {trade.type === 'BUY' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{trade.pair}</p>
                    <p className="text-gray-400 text-xs">{trade.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">${trade.total.toLocaleString()}</p>
                  {trade.profit !== 0 && (
                    <p className={`text-xs ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Piyasa Özeti</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs font-medium pb-3">Parite</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">Fiyat</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">24s Değişim</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">24s Hacim</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">24s Yüksek</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">24s Düşük</th>
              </tr>
            </thead>
            <tbody>
              {mockMarketData.map((market) => (
                <tr key={market.pair} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3">
                    <span className="text-white text-sm font-medium">{market.pair}</span>
                  </td>
                  <td className="text-right py-3">
                    <span className="text-white text-sm">${market.price.toLocaleString()}</span>
                  </td>
                  <td className="text-right py-3">
                    <span className={`text-sm font-medium ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {market.change24h >= 0 ? '+' : ''}{market.change24h}%
                    </span>
                  </td>
                  <td className="text-right py-3">
                    <span className="text-gray-300 text-sm">${(market.volume24h / 1000000000).toFixed(2)}B</span>
                  </td>
                  <td className="text-right py-3">
                    <span className="text-gray-300 text-sm">${market.high24h.toLocaleString()}</span>
                  </td>
                  <td className="text-right py-3">
                    <span className="text-gray-300 text-sm">${market.low24h.toLocaleString()}</span>
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
