import { Trade, OpenPosition, LiveActivity } from '../types';

export class AutoTradingEngine {
  private trades: Trade[] = [];
  private openPositions: OpenPosition[] = [];
  private activities: LiveActivity[] = [];
  private isRunning: boolean = false;
  private scanInterval: ReturnType<typeof setInterval> | null = null;
  private positionUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private onStateChange: (() => void) | null = null;
  private currentCapital: number = 10000;

  constructor() {
    this.addActivity('Sistem', 'TÜM', '🤖 BOT HAZIR', 'info',
      'Otomatik trading motoru hazır. Başlatmak için butona tıklayın.');
  }

  setOnStateChange(callback: () => void) {
    this.onStateChange = callback;
  }

  getState() {
    return {
      trades: this.trades,
      openPositions: this.openPositions,
      activities: this.activities,
      isRunning: this.isRunning,
      currentCapital: this.currentCapital,
      totalPnl: this.openPositions.reduce((sum, pos) => sum + pos.pnl, 0),
    };
  }

  async start() {
    if (this.isRunning) return;

    console.log('🚀 BOT BAŞLATILIYOR...');
    this.isRunning = true;

    this.addActivity('Sistem', 'TÜM', '🚀 BOT BAŞLATILDI', 'info',
      'Otomatik trading aktif. Her 10 saniyede piyasa taranacak.');

    // Her 10 saniyede piyasa tara
    this.scanInterval = setInterval(() => {
      this.scanMarket();
    }, 10000);

    // Her 5 saniyede pozisyonları güncelle
    this.positionUpdateInterval = setInterval(() => {
      this.updatePositions();
    }, 5000);

    // İlk taramayı hemen yap
    await this.scanMarket();

    if (this.onStateChange) this.onStateChange();
  }

  async stop() {
    if (!this.isRunning) return;

    console.log('⏹️ BOT DURDURULUYOR...');
    this.isRunning = false;

    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }

    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
      this.positionUpdateInterval = null;
    }

    this.addActivity('Sistem', 'TÜM', '⏹️ BOT DURDURULDU', 'info',
      'Otomatik trading durduruldu.');

    if (this.onStateChange) this.onStateChange();
  }

  private async scanMarket() {
    if (!this.isRunning) return;

    const coins = [
      { symbol: 'BTCUSDT', pair: 'BTC/USDT', price: 67250 },
      { symbol: 'ETHUSDT', pair: 'ETH/USDT', price: 3420 },
      { symbol: 'SOLUSDT', pair: 'SOL/USDT', price: 145.80 },
      { symbol: 'BNBUSDT', pair: 'BNB/USDT', price: 585.30 },
      { symbol: 'XRPUSDT', pair: 'XRP/USDT', price: 0.58 },
      { symbol: 'ADAUSDT', pair: 'ADA/USDT', price: 0.62 },
      { symbol: 'DOGEUSDT', pair: 'DOGE/USDT', price: 0.162 },
      { symbol: 'AVAXUSDT', pair: 'AVAX/USDT', price: 38.50 },
    ];

    console.log('🔍 PİYASA TARANIYOR...');
    this.addActivity('Bot', 'TÜM', '🔍 PİYASA TARANIYOR', 'analysis',
      `${coins.length} coin analiz ediliyor...`);

    // Rastgele bir coin seç
    const selectedCoin = coins[Math.floor(Math.random() * coins.length)];
    
    // Rastgele sinyal üret (70% AL, 30% SAT)
    const isBuy = Math.random() > 0.3;
    const signal = isBuy ? 'STRONG BUY' : 'STRONG SELL';
    
    console.log(`📊 ${selectedCoin.pair}: ${signal}`);
    
    this.addActivity('Bot', selectedCoin.pair, `📊 ${signal} SİNYALİ`, 
      isBuy ? 'buy' : 'sell',
      `Fiyat: $${selectedCoin.price} | Güven: %${(Math.random() * 20 + 75).toFixed(0)}`,
      selectedCoin.price
    );

    // İşlem aç
    await this.openTrade(selectedCoin, isBuy);

    if (this.onStateChange) this.onStateChange();
  }

  private async openTrade(coin: { symbol: string; pair: string; price: number }, isBuy: boolean) {
    // Maksimum 3 pozisyon
    if (this.openPositions.length >= 3) {
      console.log('⚠️ Maksimum pozisyon limiti (3)');
      this.addActivity('Bot', coin.pair, '⚠️ POZİSYON LİMİTİ', 'alert',
        'Maksimum 3 açık pozisyon limiti');
      return;
    }

    // Zaten bu coin'de pozisyon var mı?
    const existingPosition = this.openPositions.find(p => p.pair === coin.pair);
    if (existingPosition) {
      console.log(`⚠️ ${coin.pair} zaten açık`);
      return;
    }

    const direction = isBuy ? 'LONG' : 'SHORT';
    const leverage = Math.random() > 0.5 ? 3 : 1;
    const isSpot = leverage === 1;
    const positionSize = this.currentCapital * 0.1; // %10
    const quantity = positionSize / coin.price;

    console.log(`💰 ${coin.pair} ${direction} açılıyor...`);

    const position: OpenPosition = {
      id: Date.now().toString(),
      botId: 'auto',
      botName: 'Otomatik Bot',
      pair: coin.pair,
      type: direction as 'LONG' | 'SHORT',
      entryPrice: coin.price,
      currentPrice: coin.price,
      amount: quantity,
      leverage: leverage,
      isSpot: isSpot,
      pnl: 0,
      pnlPercent: 0,
      openedAt: new Date().toISOString(),
      stopLoss: isBuy ? coin.price * 0.98 : coin.price * 1.02,
      takeProfit: isBuy ? coin.price * 1.03 : coin.price * 0.97,
      strategy: 'Auto Trading',
    };

    this.openPositions.push(position);

    const trade: Trade = {
      id: Date.now().toString(),
      botId: 'auto',
      botName: 'Otomatik Bot',
      pair: coin.pair,
      type: isBuy ? 'BUY' : 'SELL',
      price: coin.price,
      amount: quantity,
      total: positionSize,
      profit: 0,
      timestamp: new Date().toISOString(),
      status: 'completed',
      leverage: leverage,
      isSpot: isSpot,
    };

    this.trades.push(trade);

    console.log(`✅ ${coin.pair} ${direction} açıldı!`);
    this.addActivity('Bot', coin.pair, `✅ ${direction} AÇILDI`, 
      isBuy ? 'buy' : 'sell',
      `${quantity.toFixed(6)} @ $${coin.price} | ${isSpot ? 'SPOT' : `${leverage}x FUTURES`}`,
      coin.price
    );

    if (this.onStateChange) this.onStateChange();
  }

  private updatePositions() {
    if (this.openPositions.length === 0) return;

    console.log('📊 Pozisyonlar güncelleniyor...');

    for (const position of this.openPositions) {
      // Fiyatı %0.5-2 arasında değiştir
      const priceChange = (Math.random() - 0.5) * 0.02;
      const newPrice = position.currentPrice * (1 + priceChange);
      position.currentPrice = newPrice;

      // PnL hesapla
      if (position.type === 'LONG') {
        position.pnl = (newPrice - position.entryPrice) * position.amount * position.leverage;
      } else {
        position.pnl = (position.entryPrice - newPrice) * position.amount * position.leverage;
      }
      position.pnlPercent = (position.pnl / (position.entryPrice * position.amount)) * 100;

      // Stop Loss kontrolü
      if (position.type === 'LONG' && newPrice <= position.stopLoss) {
        this.closePosition(position.id, 'Stop Loss');
      } else if (position.type === 'SHORT' && newPrice >= position.stopLoss) {
        this.closePosition(position.id, 'Stop Loss');
      }
      // Take Profit kontrolü
      else if (position.type === 'LONG' && newPrice >= position.takeProfit) {
        this.closePosition(position.id, 'Take Profit');
      } else if (position.type === 'SHORT' && newPrice <= position.takeProfit) {
        this.closePosition(position.id, 'Take Profit');
      }
    }

    if (this.onStateChange) this.onStateChange();
  }

  private closePosition(positionId: string, reason: string) {
    const position = this.openPositions.find(p => p.id === positionId);
    if (!position) return;

    const pnl = position.pnl;
    this.currentCapital += pnl;

    // Pozisyonu kapat
    this.openPositions = this.openPositions.filter(p => p.id !== positionId);

    console.log(`✅ ${position.pair} kapatıldı (${reason}): ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`);
    this.addActivity('Bot', position.pair, `✅ POZİSYON KAPATILDI - ${reason}`, 
      pnl >= 0 ? 'buy' : 'sell',
      `PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${position.pnlPercent >= 0 ? '+' : ''}${position.pnlPercent.toFixed(2)}%)`,
      position.currentPrice
    );

    if (this.onStateChange) this.onStateChange();
  }

  private addActivity(botName: string, pair: string, action: string, type: 'info' | 'buy' | 'sell' | 'analysis' | 'alert' | 'signal', details: string, price?: number) {
    const activity: LiveActivity = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      botName,
      pair,
      action,
      type,
      details,
      price,
    };

    this.activities.unshift(activity);

    // Son 50 aktiviteyi tut
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }
  }
}

export const autoTradingEngine = new AutoTradingEngine();
