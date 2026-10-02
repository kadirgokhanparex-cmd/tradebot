import { binanceAPI } from '../api/binanceService';
import { analyzeMarket, CandleData, FullAnalysis } from '../utils/indicators';
import { Bot, Trade, OpenPosition, LiveActivity } from '../types';

export class AutoTradingEngine {
  private bots: Bot[] = [];
  private trades: Trade[] = [];
  private openPositions: OpenPosition[] = [];
  private activities: LiveActivity[] = [];
  private isRunning: boolean = false;
  private scanInterval: ReturnType<typeof setInterval> | null = null;
  private positionUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private onStateChange: (() => void) | null = null;
  private simulationMode: boolean = true; // Simülasyon modu aktif
  private initialCapital: number = 10000;
  private currentCapital: number = 10000;

  constructor() {
    this.addActivity('Sistem', 'TÜM', 'OTOMATİK TRADING MOTORU HAZIR', 'info',
      'Simülasyon modu aktif. Başlatmak için "Otomatik Trading Başlat" butonuna tıklayın.');
  }

  setOnStateChange(callback: () => void) {
    this.onStateChange = callback;
  }

  getState() {
    return {
      bots: this.bots,
      trades: this.trades,
      openPositions: this.openPositions,
      activities: this.activities,
      isRunning: this.isRunning,
      currentCapital: this.currentCapital,
      totalPnl: this.openPositions.reduce((sum, pos) => sum + pos.pnl, 0),
    };
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️ Motor zaten çalışıyor');
      return;
    }

    console.log('🚀 Otomatik Trading Motoru başlatılıyor...');
    this.isRunning = true;

    this.addActivity('Sistem', 'TÜM', '🚀 OTOMATİK TRADING BAŞLATILDI', 'info',
      `${this.simulationMode ? 'Simülasyon' : 'Gerçek'} mod aktif. 16 coin taranacak, her 30 saniyede bir.`);

    // Piyasa tarama - her 30 saniye
    this.scanInterval = setInterval(() => {
      this.scanAndTrade();
    }, 30000);

    // Pozisyon güncelleme - her 10 saniye
    this.positionUpdateInterval = setInterval(() => {
      this.updatePositions();
    }, 10000);

    // İlk taramayı hemen yap
    await this.scanAndTrade();

    if (this.onStateChange) this.onStateChange();
  }

  async stop() {
    if (!this.isRunning) return;

    console.log('⏹️ Otomatik Trading Motoru durduruluyor...');
    this.isRunning = false;

    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }

    if (this.positionUpdateInterval) {
      clearInterval(this.positionUpdateInterval);
      this.positionUpdateInterval = null;
    }

    this.addActivity('Sistem', 'TÜM', '⏹️ OTOMATİK TRADING DURDURULDU', 'info',
      'Motor durduruldu. Açık pozisyonlar korunuyor.');

    if (this.onStateChange) this.onStateChange();
  }

  private async scanAndTrade() {
    if (!this.isRunning) return;

    const symbols = [
      'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
      'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
      'LINKUSDT', 'UNIUSDT', 'ATOMUSDT', 'FILUSDT', 'NEARUSDT', 'APTUSDT'
    ];

    console.log(`🔍 ${symbols.length} coin taranıyor...`);
    this.addActivity('Tarama Motoru', 'TÜM', `🔍 PİYASA TARANIYOR`, 'analysis',
      `${symbols.length} coin için 12 indikatör hesaplanıyor...`);

    let strongSignals = 0;
    let mediumSignals = 0;

    for (const symbol of symbols) {
      try {
        const result = await this.analyzeAndExecute(symbol);
        if (result === 'strong') strongSignals++;
        else if (result === 'medium') mediumSignals++;

        // Rate limiting - 200ms bekle
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`❌ ${symbol} analiz hatası:`, error);
      }
    }

    console.log(`✅ Tarama tamamlandı: ${strongSignals} güçlü, ${mediumSignals} orta sinyal`);
    this.addActivity('Tarama Motoru', 'TÜM', '✅ TARAMA TAMAMLANDI', 'info',
      `${strongSignals} güçlü sinyal, ${mediumSignals} orta sinyal bulundu`);

    if (this.onStateChange) this.onStateChange();
  }

  private async analyzeAndExecute(symbol: string): Promise<'strong' | 'medium' | 'none'> {
    try {
      // Kline verisi al
      const klines = await binanceAPI.getKlines(symbol, '1h', 100);

      if (!klines || klines.length === 0) {
        console.warn(`⚠️ ${symbol} için veri alınamadı`);
        return 'none';
      }

      // CandleData formatına çevir
      const candles: CandleData[] = klines.map(k => ({
        open: parseFloat(k.open),
        high: parseFloat(k.high),
        low: parseFloat(k.low),
        close: parseFloat(k.close),
        volume: parseFloat(k.volume),
        timestamp: k.openTime,
      }));

      // Piyasa analizi
      const analysis = analyzeMarket(candles, symbol);

      console.log(`📊 ${symbol}: ${analysis.overallSignal} (Güven: %${analysis.confidence})`);

      // STRONG sinyal varsa işlem aç
      if (analysis.overallSignal === 'STRONG_BUY' || analysis.overallSignal === 'STRONG_SELL') {
        await this.executeTrade(symbol, analysis);
        return 'strong';
      }

      // Medium sinyal - sadece log
      if (analysis.overallSignal === 'BUY' || analysis.overallSignal === 'SELL') {
        this.addActivity('Sinyal Motoru', symbol,
          `${analysis.overallSignal === 'BUY' ? '📈 AL' : '📉 SAT'} SİNYALİ`,
          analysis.overallSignal === 'BUY' ? 'buy' : 'sell',
          `Güven: %${analysis.confidence.toFixed(0)} | RSI: ${analysis.rsi.value.toFixed(1)} | ADX: ${analysis.adx.adx.toFixed(1)}`,
          analysis.price
        );
        return 'medium';
      }

      return 'none';
    } catch (error) {
      console.error(`❌ ${symbol} analiz hatası:`, error);
      return 'none';
    }
  }

  private async executeTrade(symbol: string, analysis: FullAnalysis) {
    const pair = symbol.replace('USDT', '/USDT');
    const isStrongBuy = analysis.overallSignal === 'STRONG_BUY';
    const isFutures = analysis.recommendedAction === 'FUTURES_LONG' || analysis.recommendedAction === 'FUTURES_SHORT';

    console.log(`💰 ${symbol} için işlem açılıyor: ${analysis.recommendedAction}`);

    // Zaten pozisyon var mı?
    const existingPosition = this.openPositions.find(p => p.pair === pair);
    if (existingPosition) {
      console.log(`⚠️ ${pair} için zaten pozisyon var`);
      this.addActivity('İşlem Motoru', pair, '⚠️ POZİSYON ZATEN AÇIK', 'info',
        `Mevcut pozisyon var, yeni işlem açılmadı`);
      return;
    }

    // Maksimum pozisyon limiti (5)
    if (this.openPositions.length >= 5) {
      console.log(`⚠️ Maksimum pozisyon limitine ulaşıldı (5)`);
      this.addActivity('İşlem Motoru', pair, '⚠️ MAKSİMUM POZİSYON', 'alert',
        `Maksimum 5 açık pozisyon limitine ulaşıldı`);
      return;
    }

    const action = isStrongBuy ? '🟢 STRONG BUY' : '🔴 STRONG SELL';
    const direction = isStrongBuy ? 'LONG' : 'SHORT';
    const leverage = isFutures ? analysis.recommendedLeverage : 1;

    this.addActivity('İşlem Motoru', pair, `${action} SİNYALİ - İŞLEM AÇILIYOR`,
      isStrongBuy ? 'buy' : 'sell',
      `${isFutures ? `${leverage}x Futures ${direction}` : 'Spot'} | Güven: %${analysis.confidence.toFixed(0)}`,
      analysis.price
    );

    try {
      // Pozisyon boyutu (sermayenin %10'u)
      const positionSize = this.currentCapital * 0.1;
      const quantity = positionSize / analysis.price;

      // Pozisyon oluştur
      const position: OpenPosition = {
        id: Date.now().toString(),
        botId: 'auto',
        botName: 'Otomatik Trading',
        pair: pair,
        type: direction as 'LONG' | 'SHORT',
        entryPrice: analysis.price,
        currentPrice: analysis.price,
        amount: quantity,
        leverage: leverage,
        isSpot: !isFutures,
        pnl: 0,
        pnlPercent: 0,
        openedAt: new Date().toISOString(),
        stopLoss: this.calculateStopLoss(analysis.price, direction, analysis.atr),
        takeProfit: this.calculateTakeProfit(analysis.price, direction, analysis.atr),
        strategy: 'Strong Signal',
      };

      this.openPositions.push(position);

      // Trade kaydı
      const trade: Trade = {
        id: Date.now().toString(),
        botId: 'auto',
        botName: 'Otomatik Trading',
        pair: pair,
        type: isStrongBuy ? 'BUY' : 'SELL',
        price: analysis.price,
        amount: quantity,
        total: positionSize,
        profit: 0,
        timestamp: new Date().toISOString(),
        status: 'completed',
        leverage: leverage,
        isSpot: !isFutures,
      };

      this.trades.push(trade);

      console.log(`✅ ${pair} pozisyonu açıldı: ${direction} @ $${analysis.price.toFixed(2)}`);
      this.addActivity('İşlem Motoru', pair, `✅ ${direction} POZİSYON AÇILDI`,
        isStrongBuy ? 'buy' : 'sell',
        `${quantity.toFixed(6)} @ $${analysis.price.toLocaleString()} | SL: $${position.stopLoss.toFixed(2)} | TP: $${position.takeProfit.toFixed(2)}`,
        analysis.price
      );

    } catch (error) {
      console.error(`❌ İşlem açma hatası:`, error);
      this.addActivity('İşlem Motoru', pair, '❌ HATA', 'alert',
        `İşlem açılamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  }

  private calculateStopLoss(price: number, direction: string, atr: number): number {
    const atrMultiplier = 2;
    if (direction === 'LONG') {
      return price - (atr * atrMultiplier);
    } else {
      return price + (atr * atrMultiplier);
    }
  }

  private calculateTakeProfit(price: number, direction: string, atr: number): number {
    const atrMultiplier = 3;
    if (direction === 'LONG') {
      return price + (atr * atrMultiplier);
    } else {
      return price - (atr * atrMultiplier);
    }
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

  // Pozisyonları güncelle
  async updatePositions() {
    if (this.openPositions.length === 0) return;

    try {
      const prices = await binanceAPI.getAllPrices();

      for (const position of this.openPositions) {
        const symbol = position.pair.replace('/', '');
        const priceData = prices.find(p => p.symbol === symbol);

        if (priceData) {
          const currentPrice = parseFloat(priceData.price);
          position.currentPrice = currentPrice;

          // PnL hesapla
          if (position.type === 'LONG') {
            position.pnl = (currentPrice - position.entryPrice) * position.amount * position.leverage;
          } else {
            position.pnl = (position.entryPrice - currentPrice) * position.amount * position.leverage;
          }

          position.pnlPercent = (position.pnl / (position.entryPrice * position.amount)) * 100 * position.leverage;

          // Stop Loss kontrolü
          if (position.type === 'LONG' && currentPrice <= position.stopLoss) {
            await this.closePosition(position.id, 'Stop Loss');
          } else if (position.type === 'SHORT' && currentPrice >= position.stopLoss) {
            await this.closePosition(position.id, 'Stop Loss');
          }

          // Take Profit kontrolü
          if (position.type === 'LONG' && currentPrice >= position.takeProfit) {
            await this.closePosition(position.id, 'Take Profit');
          } else if (position.type === 'SHORT' && currentPrice <= position.takeProfit) {
            await this.closePosition(position.id, 'Take Profit');
          }
        }
      }

      if (this.onStateChange) this.onStateChange();
    } catch (error) {
      console.error('❌ Pozisyon güncelleme hatası:', error);
    }
  }

  private async closePosition(positionId: string, reason: string) {
    const position = this.openPositions.find(p => p.id === positionId);
    if (!position) return;

    const pnl = position.pnl;

    // Trade'i güncelle
    const trade = this.trades.find(t =>
      t.botId === position.botId &&
      t.pair === position.pair &&
      t.type === (position.type === 'LONG' ? 'BUY' : 'SELL')
    );

    if (trade) {
      trade.profit = pnl;
    }

    // Pozisyonu kapat
    this.openPositions = this.openPositions.filter(p => p.id !== positionId);

    // Sermayeyi güncelle
    this.currentCapital += pnl;

    console.log(`✅ ${position.pair} pozisyonu kapatıldı (${reason}): ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`);
    this.addActivity('İşlem Motoru', position.pair, `✅ POZİSYON KAPATILDI - ${reason}`,
      pnl >= 0 ? 'buy' : 'sell',
      `PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${position.pnlPercent >= 0 ? '+' : ''}${position.pnlPercent.toFixed(2)}%)`,
      position.currentPrice
    );

    if (this.onStateChange) this.onStateChange();
  }
}

// Singleton instance
export const autoTradingEngine = new AutoTradingEngine();
