import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  History, 
  TrendingUp, 
  Settings, 
  Shield,
  Zap,
  ChevronLeft,
  ChevronRight,
  Activity,
  BarChart3,
  Gauge
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scanner', label: 'Piyasa Tarama', icon: Activity },
  { id: 'live', label: 'Canlı Aktivite', icon: Activity },
  { id: 'bots', label: 'Trading Botları', icon: Bot },
  { id: 'market', label: 'Piyasa Analizi', icon: BarChart3 },
  { id: 'indicators', label: 'İndikatörler', icon: Gauge },
  { id: 'history', label: 'İşlem Geçmişi', icon: History },
  { id: 'strategies', label: 'Stratejiler', icon: TrendingUp },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 relative`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-6 h-6 text-gray-900" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-lg">AutoTrade</h1>
            <p className="text-gray-400 text-xs">Binance Trading Bot</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-yellow-500' : ''}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {item.id === 'live' && !collapsed && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Status */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Testnet Bağlı</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-xs">Binance Testnet</span>
            </div>
            <div className="text-gray-500 text-[10px] mt-2">
              Bakiye: 100,000 USDT (Test)
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  );
};

export default Sidebar;
