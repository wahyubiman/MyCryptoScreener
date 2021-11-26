<template>
  <div>
    <div>
      <v-btn @click="dialog = true" dark rounded color="success">
        <v-icon dark>mdi-calculator</v-icon>
      </v-btn>
    </div>
    <div>
      <v-dialog v-model="dialog">
        <v-card>
          <v-toolbar color="success" dark
            ><v-toolbar-title>Position Sizing </v-toolbar-title
            ><v-spacer></v-spacer><v-spacer></v-spacer
            ><v-btn icon dark @click="dialog = false">
              <v-icon dark>mdi-close</v-icon>
            </v-btn></v-toolbar
          >
          <v-card-text
            ><v-row
              ><v-col class="ma-2 pa-2">
                <label for="maxLoss"
                  ><span class="red--text"
                    >Max Lose <small class="green--text">$</small></span
                  ></label
                >
                <v-text-field
                  name="maxLoss"
                  type="number"
                  v-model="maxLoss"
                  solo
                  dense
                ></v-text-field></v-col
              ><v-col class="ma-2 pa-2">
                <label for="leverage"
                  ><span
                    >Leverage <small class="orange--text">X</small></span
                  ></label
                >
                <v-text-field
                  name="leverage"
                  type="number"
                  min="1"
                  max="125"
                  v-model="leverage"
                  solo
                  dense
                ></v-text-field></v-col
            ></v-row>
            <v-row align="center"
              ><v-col class="ma-2 pa-2">
                <label for="entry"
                  ><span class="green--text"
                    >Entry Price <small class="green--text">$</small></span
                  ></label
                >
                <v-text-field
                  name="entry"
                  type="number"
                  v-model="entryPrice"
                  solo
                  dense
                ></v-text-field></v-col
              ><v-col class="ma-2 pa-2">
                <label for="takeProfit"
                  ><span class="green--text"
                    >Take Profit Price
                    <small class="green--text">$</small></span
                  ></label
                >
                <v-text-field
                  name="takeProfit"
                  type="number"
                  v-model="takeProfitPrice"
                  solo
                  dense
                ></v-text-field> </v-col
              ><v-col class="ma-2 pa-2"
                ><label for="stopLoss"
                  ><span class="red--text"
                    >Stop Loss Price <small class="green--text">$</small></span
                  ></label
                >
                <v-text-field
                  name="stopLoss"
                  type="number"
                  v-model="stopLossPrice"
                  solo
                  dense
                ></v-text-field></v-col
            ></v-row>
            <div class="pa-5 ma-2 secondary rounded justify-center">
              <v-row
                justify="center"
                class="success rounded d-flex justify-space-around"
              >
                <div class="black--text text-h4">Estimate Result</div>
              </v-row>
              <v-row justify="center" class="d-flex justify-space-around">
                <div class="text-h6 bold">Cost Per Trade $:</div>
                <div class="red--text text-h6 bold">$ {{ riskPerTrade }}</div>
              </v-row>
              <v-row justify="center" class="d-flex justify-space-around">
                <div class="text-h6 bold">StopLoss % :</div>
                <div class="red--text text-h6 bold">{{ stopLossPercent }}%</div>
              </v-row>
              <v-row justify="center" class="d-flex justify-space-around">
                <div class="text-h6 bold">Coin Amount :</div>
                <div class="orange--text text-h6 bold">
                  {{ estimateCoin }} Coin
                </div>
              </v-row>
              <v-row justify="center" class="d-flex justify-space-around">
                <div class="text-h6 bold">Contract Amount :</div>
                <div class="orange--text text-h6 bold">
                  {{ estimateContract }} Contract
                </div>
              </v-row>
              <v-row justify="center" class="d-flex justify-space-around">
                <div class="text-h6 bold">RR Ratio :</div>
                <div
                  :class="[
                    riskRewardRatio <= 1.5 ? 'red--text' : 'green--text',
                    'text-h6 bold',
                  ]"
                >
                  1:{{ riskRewardRatio }}
                </div>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "PositionSize",
  data: () => ({
    dialog: false,
    leverage: 1,
    maxLoss: 1,
    entryPrice: 1000,
    stopLossPrice: 950,
    takeProfitPrice: 1300,
  }),
  computed: {
    stopLossPercent() {
      return Math.abs(
        (
          ((this.entryPrice - this.stopLossPrice) / this.entryPrice) *
          (this.leverage * 100)
        ).toFixed(2)
      );
    },
    riskPerTrade() {
      return Math.abs((this.maxLoss / (this.stopLossPercent / 100)).toFixed(2));
    },
    estimateCoin() {
      return Math.abs(
        ((this.riskPerTrade * this.leverage) / this.entryPrice).toFixed(4)
      );
    },
    estimateContract() {
      return Math.abs((this.estimateCoin * this.entryPrice).toFixed(0));
    },
    riskRewardRatio() {
      return Math.abs(
        (
          (this.takeProfitPrice - this.entryPrice) /
          (this.stopLossPrice - this.entryPrice)
        ).toFixed(2)
      );
    },
  },
};
</script>