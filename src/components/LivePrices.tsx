import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useAllTickers } from '../hooks/useBinanceData';

const LivePrices: React.FC = () => {
  const { tickers, connected, connectionStatus, reconnect } = useAllTickers();
  const [sortBy, setSortBy] = useState<'volume' | 'change' | 'name'>('volume');
  const [filter, setFilter] = useState('USDT');

  // Filter and sort tickers
  const filteredTickers = tickers
    .filter(t => t.s.endsWith(filter))
    .sort((a, b) => {
      if (sortBy === 'volume') {
        return parseFloat(b.q) - parseFloat(a.q);
      } else if (sortBy === 'change') {
        return parseFloat(b.P) - parseFloat(a.P);
      } else {
        return a.s.localeCompare(b.s);
      }
    })
    .slice(0, 20); // Show top 20

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-yellow-500 animate-pulse" />
          <h3 className="text-white font-semibold">Canlı Fiyatlar</h3>
          {connected && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-yellow-500"
          >
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="BNB">BNB</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-yellow-500"
          >
            <option value="volume">Hacim</option>
            <option value="change">Değişim</option>
            <option value="name">İsim</option>
          </select>
        </div>
      </div>

      {!connected ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            {connectionStatus === 'connecting' ? (
              <RefreshCw className="w-6 h-6 text-yellow-500 animate-spin" />
            ) : connectionStatus === 'error' ? (
              <WifiOff className="w-6 h-6 text-red-500" />
            ) : connectionStatus === 'disconnected' ? (
              <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
            ) : (
              <Activity className="w-6 h-6 text-gray-500" />
            )}
          </div>
          {connectionStatus === 'connecting' && (
            <>
              <p className="text-yellow-400 text-sm font-medium mb-1">WebSocket bağlanıyor...</p>
              <p className="text-gray-500 text-xs mb-3">Binance stream'e bağlanılıyor</p>
              <button
                onClick={reconnect}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Yeniden bağlan
              </button>
            </>
          )}
          {connectionStatus === 'error' && (
            <>
              <p className="text-red-400 text-sm font-medium mb-1">Bağlantı hatası</p>
              <p className="text-gray-500 text-xs mb-3">WebSocket bağlantısı kurulamadı</p>
              <button
                onClick={reconnect}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Tekrar dene
              </button>
            </>
          )}
          {connectionStatus === 'disconnected' && (
            <>
              <p className="text-orange-400 text-sm font-medium mb-1">Yeniden bağlanılıyor...</p>
              <p className="text-gray-500 text-xs mb-3">WebSocket bağlantısı kesildi, otomatik yeniden bağlanma deneniyor</p>
              <button
                onClick={reconnect}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Manuel yeniden bağlan
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTickers.map((ticker) => {
            const price = parseFloat(ticker.c);
            const change = parseFloat(ticker.P);
            const volume = parseFloat(ticker.q);
            const isPositive = change >= 0;

            return (
              <div
                key={ticker.s}
                className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {ticker.s.replace(filter, '')}/{filter}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Vol: ${(volume / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">
                    ${price < 1 ? price.toFixed(6) : price < 100 ? price.toFixed(4) : price.toFixed(2)}
                  </p>
                  <p className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LivePrices;
