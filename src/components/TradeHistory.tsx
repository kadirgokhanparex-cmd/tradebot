import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter, Download, Search } from 'lucide-react';
import { mockTrades } from '../data';

const TradeHistory: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrades = mockTrades.filter(trade => {
    const matchesType = filterType === 'all' || trade.type === filterType;
    const matchesSearch = trade.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.botName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalProfit = filteredTrades.reduce((sum, t) => sum + t.profit, 0);
  const totalVolume = filteredTrades.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">İşlem Geçmişi</h1>
          <p className="text-gray-400 text-sm mt-1">Tüm bot işlemlerinizi görüntüleyin</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Dışa Aktar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Toplam İşlem</p>
          <p className="text-white text-xl font-bold">{filteredTrades.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Toplam Hacim</p>
          <p className="text-white text-xl font-bold">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Toplam Kar/Zarar</p>
          <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} USDT
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Başarı Oranı</p>
          <p className="text-white text-xl font-bold">%{((filteredTrades.filter(t => t.profit > 0).length / Math.max(filteredTrades.filter(t => t.type === 'SELL').length, 1)) * 100).toFixed(1)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Parite veya bot adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {['all', 'BUY', 'SELL'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'Tümü' : type === 'BUY' ? 'Alım' : 'Satım'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trade Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="text-left text-gray-400 text-xs font-medium px-5 py-3">Tür</th>
                <th className="text-left text-gray-400 text-xs font-medium px-5 py-3">Bot</th>
                <th className="text-left text-gray-400 text-xs font-medium px-5 py-3">Parite</th>
                <th className="text-right text-gray-400 text-xs font-medium px-5 py-3">Fiyat</th>
                <th className="text-right text-gray-400 text-xs font-medium px-5 py-3">Miktar</th>
                <th className="text-right text-gray-400 text-xs font-medium px-5 py-3">Toplam</th>
                <th className="text-right text-gray-400 text-xs font-medium px-5 py-3">Kar/Zarar</th>
                <th className="text-right text-gray-400 text-xs font-medium px-5 py-3">Zaman</th>
                <th className="text-center text-gray-400 text-xs font-medium px-5 py-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      trade.type === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {trade.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {trade.type === 'BUY' ? 'AL' : 'SAT'}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-white text-sm">{trade.botName}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-white text-sm font-medium">{trade.pair}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-white text-sm">${trade.price.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-gray-300 text-sm">{trade.amount}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-white text-sm">${trade.total.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-medium ${
                      trade.profit > 0 ? 'text-green-400' : trade.profit < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {trade.profit > 0 ? '+' : ''}{trade.profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-gray-400 text-xs">{trade.timestamp}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      trade.status === 'completed' ? 'bg-green-500' : trade.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
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

export default TradeHistory;
