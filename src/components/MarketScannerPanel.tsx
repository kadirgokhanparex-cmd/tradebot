import React from 'react';
import { useMarketScanner } from '../hooks/useMarketScanner';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Zap, Shield, AlertTriangle } from 'lucide-react';

const MarketScannerPanel: React.FC = () => {
  const {
    scanning,
    results,
    lastScan,
    error,
    scan,
    strongBuySignals,
    buySignals,
    sellSignals,
  } = useMarketScanner();

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'bg-green-500 text-white';
      case 'BUY': return 'bg-green-500/20 text-green-400';
      case 'NEUTRAL': return 'bg-gray-600 text-gray-300';
      case 'SELL': return 'bg-red-500/20 text-red-400';
      case 'STRONG_SELL': return 'bg-red-500 text-white';
      default: return '';
    }
  };

  const getSignalText = (signal: string) => {
    switch (signal) {
      case 'STRONG_BUY': return 'GÜÇLÜ AL';
      case 'BUY': return 'AL';
      case 'NEUTRAL': return 'NÖTR';
      case 'SELL': return 'SAT';
      case 'STRONG_SELL': return 'GÜÇLÜ SAT';
      default: return signal;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'FUTURES_LONG': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'FUTURES_SHORT': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'SPOT_BUY': return <Shield className="w-4 h-4 text-blue-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'FUTURES_LONG': return 'Futures LONG';
      case 'FUTURES_SHORT': return 'Futures SHORT';
      case 'SPOT_BUY': return 'Spot AL';
      default: return 'Bekle';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-yellow-500" />
            Piyasa Tarama Motoru
          </h1>
          <p className="text-gray-400 text-sm mt-1">12 indikatör ile otomatik piyasa analizi</p>
        </div>
        <button
          onClick={scan}
          disabled={scanning}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Taranıyor...' : 'Tara'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <p className="text-green-400 text-3xl font-bold">{strongBuySignals.length}</p>
          <p className="text-green-400/70 text-sm">Güçlü AL Sinyali</p>
        </div>
        <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
          <p className="text-green-400 text-3xl font-bold">{buySignals.length}</p>
          <p className="text-green-400/70 text-sm">AL Sinyali</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
          <p className="text-red-400 text-3xl font-bold">{sellSignals.length}</p>
          <p className="text-red-400/70 text-sm">SAT Sinyali</p>
        </div>
        <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
          <p className="text-white text-3xl font-bold">{results.length}</p>
          <p className="text-gray-400 text-sm">Toplam Taranan</p>
        </div>
      </div>

      {/* Last Scan Info */}
      {lastScan && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-400 text-sm">Son Tarama:</span>
              <span className="text-white text-sm font-medium">
                {new Date(lastScan).toLocaleTimeString('tr-TR')}
              </span>
            </div>
            <span className="text-gray-500 text-xs">Otomatik tarama: Her 5 dakika</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">Hata: {error}</p>
        </div>
      )}

      {/* Strong Buy Signals */}
      {strongBuySignals.length > 0 && (
        <div className="bg-gray-800 border border-green-500/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Güçlü AL Sinyalleri ({strongBuySignals.length})
          </h3>
          <div className="space-y-3">
            {strongBuySignals.map((result) => (
              <div key={result.symbol} className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-lg">{result.symbol.replace('USDT', '')}</span>
                    <span className="text-white text-lg">${result.analysis.price.toLocaleString()}</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                      {getSignalText(result.analysis.overallSignal)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getActionIcon(result.analysis.recommendedAction)}
                    <span className="text-white text-sm font-medium">
                      {getActionText(result.analysis.recommendedAction)}
                      {result.analysis.recommendedLeverage > 1 && (
                        <span className="text-purple-400 ml-1">{result.analysis.recommendedLeverage}x</span>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                  <div className="bg-gray-700/50 rounded p-2">
                    <p className="text-gray-400">RSI</p>
                    <p className={`font-bold ${result.analysis.rsi.signal === 'buy' ? 'text-green-400' : result.analysis.rsi.signal === 'sell' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {result.analysis.rsi.value.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <p className="text-gray-400">MACD</p>
                    <p className={`font-bold ${result.analysis.macd.signal === 'buy' ? 'text-green-400' : result.analysis.macd.signal === 'sell' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {result.analysis.macd.value.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <p className="text-gray-400">ADX</p>
                    <p className={`font-bold ${result.analysis.adx.adx > 25 ? 'text-green-400' : 'text-gray-300'}`}>
                      {result.analysis.adx.adx.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <p className="text-gray-400">Stoch</p>
                    <p className={`font-bold ${result.analysis.stochastic.signal === 'buy' ? 'text-green-400' : result.analysis.stochastic.signal === 'sell' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {result.analysis.stochastic.k.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <p className="text-gray-400">Volume</p>
                    <p className={`font-bold ${result.analysis.volume.signal === 'buy' ? 'text-green-400' : result.analysis.volume.signal === 'sell' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {result.analysis.volume.value.toFixed(2)}x
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded p-2">
                    <p className="text-gray-400">Güven</p>
                    <p className="text-yellow-400 font-bold">%{result.analysis.confidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Results Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Tüm Tarama Sonuçları</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs font-medium pb-3">Coin</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">Fiyat</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">RSI</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">MACD</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">ADX</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">Stoch</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">Sinyal</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">Güven</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">Öneri</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.symbol} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3">
                    <span className="text-white font-medium">{result.symbol.replace('USDT', '')}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-white">${result.analysis.price.toLocaleString()}</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-sm ${
                      result.analysis.rsi.signal === 'buy' ? 'text-green-400' :
                      result.analysis.rsi.signal === 'sell' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {result.analysis.rsi.value.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-sm ${
                      result.analysis.macd.signal === 'buy' ? 'text-green-400' :
                      result.analysis.macd.signal === 'sell' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {result.analysis.macd.value.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-sm ${result.analysis.adx.adx > 25 ? 'text-green-400' : 'text-gray-400'}`}>
                      {result.analysis.adx.adx.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-sm ${
                      result.analysis.stochastic.signal === 'buy' ? 'text-green-400' :
                      result.analysis.stochastic.signal === 'sell' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {result.analysis.stochastic.k.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getSignalColor(result.analysis.overallSignal)}`}>
                      {getSignalText(result.analysis.overallSignal)}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-yellow-400 font-medium">%{result.analysis.confidence}</span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getActionIcon(result.analysis.recommendedAction)}
                      <span className="text-xs text-white">
                        {getActionText(result.analysis.recommendedAction)}
                        {result.analysis.recommendedLeverage > 1 && (
                          <span className="text-purple-400 ml-1">{result.analysis.recommendedLeverage}x</span>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scanning Indicator */}
      {scanning && (
        <div className="fixed bottom-6 right-6 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="font-medium">Piyasa taranıyor...</span>
        </div>
      )}
    </div>
  );
};

export default MarketScannerPanel;
