import React from 'react';
import { Wifi, WifiOff, Clock, RefreshCw } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useBinanceData';

const ConnectionStatus: React.FC = () => {
  const { connected, serverTime, checking, refetch } = useConnectionStatus();

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return '--:--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR');
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        connected ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
      }`}>
        {checking ? (
          <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
        ) : connected ? (
          <Wifi className="w-4 h-4 text-green-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-xs font-medium ${connected ? 'text-green-400' : 'text-red-400'}`}>
          {checking ? 'Bağlanıyor...' : connected ? 'REST API Bağlı' : 'API Yok'}
        </span>
      </div>

      {connected && serverTime && (
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <Clock className="w-3 h-3" />
          <span>{formatTime(serverTime)}</span>
        </div>
      )}

      {!connected && (
        <button
          onClick={refetch}
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Yeniden dene
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
