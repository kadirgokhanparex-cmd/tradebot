import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LiveActivityPanel from './components/LiveActivity';
import Bots from './components/Bots';
import MarketAnalyzer from './components/MarketAnalyzer';
import IndicatorPanel from './components/IndicatorPanel';
import TradeHistory from './components/TradeHistory';
import Strategies from './components/Strategies';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'live':
        return <LiveActivityPanel />;
      case 'bots':
        return <Bots />;
      case 'market':
        return <MarketAnalyzer />;
      case 'indicators':
        return <IndicatorPanel />;
      case 'history':
        return <TradeHistory />;
      case 'strategies':
        return <Strategies />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
