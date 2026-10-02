import React from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useBinanceData';

const ConnectionStatus: React.FC = () => {
  const { connected, serverTime, checking } = useConnectionStatus();

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return '--:--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR');
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        connected ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
      }`}>
        {connected ? (
          <Wifi className="w-4 h-4 text-green-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-xs font-medium ${connected ? 'text-green-400' : 'text-red-400'}`}>
          {connected ? 'Binance Bağlı' : 'Bağlantı Yok'}
        </span>
        {checking && (
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        )}
      </div>

      {connected && serverTime && (
        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
          <Clock className="w-3 h-3" />
          <span>Sunucu: {formatTime(serverTime)}</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
