
/**
 * ==========================================
 * 💰 VIDEO PRICING API CONTROLLER
 * UniMentorAI Pricing Gateway Layer
 * ==========================================
 * Exposes pricing intelligence to frontend/backend:
 * - demand prediction
 * - AI optimization
 * - pricing strategy engine
 * - billing-ready output
 */

const VideoAIDemandPredictor =
  require("../ai/video.ai.demand.predictor");

const VideoAIPricingOptimizer =
  require("../ai/video.ai.pricing.optimizer");

const VideoPricingStrategyAI =
  require("../ai/video.pricing.strategy.ai");

class VideoPricingAPIController {

  constructor() {

    this.demand = VideoAIDemandPredictor;
    this.optimizer = VideoAIPricingOptimizer;
    this.strategy = VideoPricingStrategyAI;
  }

  /**
   * ==========================================
   * GET OPTIMAL PRICE (MAIN ENDPOINT)
   * ==========================================
   */
  getOptimalPrice(req, res) {

    try {

      const {
        basePrice,
        sessionId,
        userId,
        roomType,
        activeUsers,
        engagementScore
      } = req.body;

      // ======================================
      // 1. DEMAND PREDICTION
      // ======================================
      const demand =
        this.demand.predict({
          activeUsers
        });

      // ======================================
      // 2. STRATEGY LAYER
      // ======================================
      const strategyResult =
        this.strategy.optimize(
          { finalPrice: basePrice },
          {
            demandScore: demand.demandScore,
            engagementScore
          }
        );

      // ======================================
      // 3. AI OPTIMIZER LAYER
      // ======================================
      const optimized =
        this.optimizer.optimize(
          { finalPrice: strategyResult.optimizedPrice },
          {
            demand: demand.demandScore,
            engagement: engagementScore,
            competitionLevel: 0.5,
            marketGrowth: 0.6
          }
        );

      // ======================================
      // FINAL PRICE BUILD
      // ======================================
      const finalPrice =
        optimized.optimizedPrice;

      const response = {
        sessionId,
        userId,

        pricing: {
          basePrice,
          finalPrice,

          currency: "USD",

          breakdown: {
            demandScore: demand.demandScore,
            demandLevel: demand.level,
            strategyAdjustments: strategyResult.adjustments,
            optimizerAdjustments: optimized.adjustments
          },

          recommendation: demand.recommendation
        },

        meta: {
          timestamp: Date.now(),
          confidence: optimized.confidence
        }
      };

      return res.json(response);
    }

    catch (error) {

      return res.status(500).json({
        error: "PRICING_ENGINE_ERROR",
        message: error.message
      });
    }
  }

  /**
   * ==========================================
   * SIMULATION ENDPOINT (TEST MODE)
   * ==========================================
   */
  simulatePricing(req, res) {

    const samples = [];

    for (let i = 1; i <= 5; i++) {

      const mock = this.getOptimalPriceMock(
        req.body.basePrice,
        i * 10
      );

      samples.push(mock);
    }

    return res.json({
      simulations: samples
    });
  }

  /**
   * ==========================================
   * MOCK ENGINE (TESTING PURPOSES)
   * ==========================================
   */
  getOptimalPriceMock(basePrice, activeUsers) {

    const demand =
      this.demand.predict({ activeUsers });

    const finalPrice =
      basePrice * (1 + demand.demandScore * 0.5);

    return {
      activeUsers,
      demandScore: demand.demandScore,
      finalPrice: Math.round(finalPrice)
    };
  }

  /**
   * ==========================================
   * HEALTH CHECK ENDPOINT
   * ==========================================
   */
  health(req, res) {

    return res.json({
      status: "OK",
      service: "video-pricing-api",
      timestamp: Date.now()
    });
  }
}

module.exports =
  new VideoPricingAPIController();
