import { motion } from 'framer-motion';
import { MapPin, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStorageBatches } from '@/hooks/useStorageBatches';
import { CROP_PRICES, NEARBY_MANDIS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

const MandiRates = () => {
  const { batches } = useStorageBatches();

  const cropSummary = ['Cotton', 'Groundnut'].map(crop => {
    const cropBatches = batches.filter(b => b.crop === crop);
    const totalQty = cropBatches.reduce((sum, b) => sum + b.quantity, 0);
    const minFreshness = cropBatches.length > 0 ? Math.min(...cropBatches.map(b => b.freshnessRemaining)) : Infinity;
    const prices = CROP_PRICES[crop];
    const recommendation = totalQty === 0 ? 'No Stock' : minFreshness < 7 ? 'Sell Now' : 'Hold & Sell Later';

    return {
      crop,
      totalQty,
      minFreshness,
      todayPrice: prices.today,
      expectedPrice: prices.expected,
      unit: prices.unit,
      recommendation,
      totalValue: totalQty * prices.today,
    };
  });

  return (
    <div className="space-y-6">
      {/* Inventory Summary */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Your Inventory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cropSummary.map((crop, index) => (
            <motion.div
              key={crop.crop}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">{crop.crop}</h4>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {crop.totalQty}{' '}
                    <span className="text-sm font-normal text-muted-foreground">quintals</span>
                  </p>
                </div>
                <Badge
                  variant={
                    crop.recommendation === 'No Stock'
                      ? 'outline'
                      : crop.recommendation === 'Sell Now'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {crop.recommendation}
                </Badge>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Today&apos;s Price</span>
                  <span className="font-medium text-foreground">
                    ₹{crop.todayPrice.toLocaleString()}/qtl
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Price (AI)</span>
                  <span className="font-medium text-foreground flex items-center gap-1">
                    ₹{crop.expectedPrice.toLocaleString()}/qtl
                    {crop.expectedPrice > crop.todayPrice ? (
                      <TrendingUp className="w-3 h-3 text-sensor-good" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-sensor-danger" />
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-bold text-foreground">
                    ₹{crop.totalValue.toLocaleString()}
                  </span>
                </div>
                {crop.totalQty > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Freshness</span>
                    <span
                      className={`font-medium ${
                        crop.minFreshness < 7 ? 'text-sensor-danger' : 'text-foreground'
                      }`}
                    >
                      {crop.minFreshness} days
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          AI Recommendations
        </h3>
        <div className="space-y-3">
          {cropSummary
            .filter(c => c.totalQty > 0)
            .map(crop => (
              <motion.div
                key={crop.crop}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-xl border p-4 flex items-center gap-3 ${
                  crop.recommendation === 'Sell Now'
                    ? 'border-sensor-warning/30 bg-sensor-warning/5'
                    : 'border-sensor-good/30 bg-sensor-good/5'
                }`}
              >
                {crop.recommendation === 'Sell Now' ? (
                  <AlertTriangle className="w-5 h-5 text-sensor-warning flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-sensor-good flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {crop.crop}: {crop.recommendation}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {crop.recommendation === 'Sell Now'
                      ? 'Freshness below 7 days. Sell at nearby mandi to avoid spoilage loss.'
                      : `Expected price ₹${crop.expectedPrice.toLocaleString()}/qtl (+${Math.round(
                          ((crop.expectedPrice - crop.todayPrice) / crop.todayPrice) * 100
                        )}%). Hold for better returns.`}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Nearby Mandis */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Nearby Mandis (from Palaj)
        </h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {NEARBY_MANDIS.map((mandi, index) => (
            <motion.div
              key={mandi.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-4 ${
                index < NEARBY_MANDIS.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{mandi.name}</p>
              </div>
              <span className="text-sm text-muted-foreground">{mandi.distance}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MandiRates;
