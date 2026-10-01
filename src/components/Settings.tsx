import React, { useState } from 'react';
import { Key, Bell, Shield, Globe, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    trades: true,
    profits: true,
    errors: true,
    daily: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
          <p className="text-gray-400 text-sm mt-1">API bağlantısı ve bot ayarları</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Binance API Bağlantısı</h3>
              <p className="text-gray-400 text-xs">API anahtarlarınızı girin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Binance API Key"
                  defaultValue="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 pr-10"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Secret Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Binance Secret Key"
                  defaultValue="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 pr-10"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Testnet Kullan</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>Hayır - Gerçek Hesap</option>
                <option>Evet - Testnet</option>
              </select>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-yellow-400 text-xs">
                ⚠️ API anahtarlarınız sadece spot trading izni ile kullanılmalıdır. 
                Withdrawal izni vermeyin!
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Bildirimler</h3>
              <p className="text-gray-400 text-xs">Bildirim tercihlerinizi ayarlayın</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { key: 'trades', label: 'İşlem Bildirimleri', desc: 'Her işlem yapıldığında bildirim al' },
              { key: 'profits', label: 'Kar Bildirimleri', desc: 'Kar hedefine ulaşıldığında bildirim al' },
              { key: 'errors', label: 'Hata Bildirimleri', desc: 'Bot hatası olduğunda bildirim al' },
              { key: 'daily', label: 'Günlük Özet', desc: 'Her gün saat 20:00\'de günlük özet al' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notifications[item.key as keyof typeof notifications] ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-5.5 left-[22px]' : 'left-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Management */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Risk Yönetimi</h3>
              <p className="text-gray-400 text-xs">Genel risk parametreleri</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Maks. Günlük İşlem Sayısı</label>
              <input type="number" defaultValue={100} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Maks. Günlük Kayıp Limiti (USDT)</label>
              <input type="number" defaultValue={500} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Maks. Tek İşlem Miktarı (USDT)</label>
              <input type="number" defaultValue={1000} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Acil Durdurma (Kill Switch)</label>
              <button className="w-full bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg py-2.5 text-sm font-medium hover:bg-red-500/20 transition-colors">
                🛑 Tüm Botları Durdur
              </button>
            </div>
          </div>
        </div>

        {/* Trading Preferences */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Trading Tercihleri</h3>
              <p className="text-gray-400 text-xs">Genel trading ayarları</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Varsayılan Referans Para Birimi</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>USDT</option>
                <option>BUSD</option>
                <option>USDC</option>
                <option>BTC</option>
                <option>ETH</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Zaman Dilimi</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>UTC+3 (İstanbul)</option>
                <option>UTC+0 (Londra)</option>
                <option>UTC-5 (New York)</option>
                <option>UTC+8 (Singapur)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Varsayılan Kaldıraç</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>1x (Spot)</option>
                <option>2x</option>
                <option>3x</option>
                <option>5x</option>
                <option>10x</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Otomatik Yeniden Başlatma</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>Açık - Hata durumunda otomatik yeniden başlat</option>
                <option>Kapalı - Hata durumunda durdur</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
