import React, { useState } from 'react';
import { Key, Bell, Shield, Globe, Save, Eye, EyeOff, CheckCircle, Wifi, Server, DollarSign, Loader2 } from 'lucide-react';
import { binanceAPI } from '../api/binanceService';

const Settings: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [useTestnet, setUseTestnet] = useState(true);
  const [notifications, setNotifications] = useState({
    trades: true, profits: true, errors: true, daily: false,
  });

  const handleSave = () => {
    binanceAPI.setCredentials(apiKey, apiSecret, useTestnet);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      binanceAPI.setCredentials(apiKey, apiSecret, useTestnet);
      const isAlive = await binanceAPI.ping();
      if (isAlive) {
        const serverTime = await binanceAPI.getServerTime();
        setTestResult({
          success: true,
          message: `Bağlantı başarılı! Sunucu zamanı: ${new Date(serverTime).toLocaleString('tr-TR')}`
        });
      } else {
        setTestResult({ success: false, message: 'Bağlantı başarısız. API endpoint\'ine erişilemiyor.' });
      }
    } catch (error) {
      setTestResult({ success: false, message: `Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
          <p className="text-gray-400 text-sm mt-1">Binance Testnet bağlantısı, API ve bot ayarları</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      {/* Connection Status */}
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Wifi className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-green-400 font-semibold">Binance Testnet Bağlantısı Aktif</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <p className="text-gray-400 text-xs mt-0.5">Testnet bakiyesi: 100,000 USDT • Gerçek para kullanılmıyor • Tüm işlemler simülasyon</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">100,000 USDT</p>
            <p className="text-gray-400 text-xs">Test Bakiye</p>
          </div>
        </div>
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
              <p className="text-gray-400 text-xs">Testnet API anahtarlarınızı girin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">API Key</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Binance API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 pr-10"
                />
                <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
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
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 pr-10"
                />
                <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Bağlantı Modu</label>
              <select 
                value={useTestnet ? 'testnet' : 'main'}
                onChange={(e) => setUseTestnet(e.target.value === 'testnet')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500"
              >
                <option value="testnet">✅ Testnet (Simülasyon - Test Parası)</option>
                <option value="main">🔴 Gerçek Hesap (DİKKAT!)</option>
              </select>
            </div>
            <div>
              <button
                onClick={testConnection}
                disabled={testing}
                className="w-full bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg py-2.5 text-sm font-medium hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                {testing ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
              </button>
              {testResult && (
                <div className={`mt-2 p-3 rounded-lg text-sm ${testResult.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {testResult.message}
                </div>
              )}
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-yellow-400 text-xs">
                ⚠️ Testnet modu aktif. Gerçek para kullanılmamaktadır. Binance Testnet'ten ücretsiz test tokenları alabilirsiniz.
                API anahtarlarınızı testnet.binance.vision adresinden oluşturabilirsiniz.
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
                    notifications[item.key as keyof typeof notifications] ? 'left-[22px]' : 'left-0.5'
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
              <label className="text-gray-400 text-sm mb-1 block">Maks. Eşzamanlı Açık İşlem</label>
              <input type="number" defaultValue={10} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500" />
            </div>
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
              <label className="text-gray-400 text-sm mb-1 block">Maks. Kaldıraç (Futures)</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>3x (Güvenli)</option>
                <option>5x (Orta)</option>
                <option>10x (Riskli)</option>
                <option>20x (Çok Riskli)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Acil Durdurma (Kill Switch)</label>
              <button className="w-full bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg py-2.5 text-sm font-medium hover:bg-red-500/20 transition-colors">
                🛑 Tüm Botları Durdur & Pozisyonları Kapat
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
                <option>USDT</option><option>BUSD</option><option>USDC</option><option>BTC</option><option>ETH</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Zaman Dilimi</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>UTC+3 (İstanbul)</option><option>UTC+0 (Londra)</option><option>UTC-5 (New York)</option><option>UTC+8 (Singapur)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Varsayılan İşlem Modu</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>Otomatik (Sistem karar verir)</option>
                <option>Sadece Spot</option>
                <option>Sadece Futures</option>
                <option>Her ikisi de</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Otomatik Yeniden Başlatma</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>Açık - Hata durumunda otomatik yeniden başlat</option>
                <option>Kapalı - Hata durumunda durdur</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Piyasa Tarama Sıklığı</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500">
                <option>Her 5 saniye</option>
                <option>Her 15 saniye</option>
                <option>Her 30 saniye</option>
                <option>Her 1 dakika</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Server Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-semibold">Sistem Bilgisi</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs">API Durumu</p>
            <p className="text-green-400 font-medium text-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Bağlı
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs">WebSocket</p>
            <p className="text-green-400 font-medium text-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Aktif
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Gecikme</p>
            <p className="text-white font-medium text-sm">12ms</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Versiyon</p>
            <p className="text-white font-medium text-sm">v2.4.1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
