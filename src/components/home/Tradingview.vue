<template>
  <div class="rounded pa-1">
    <v-btn icon dark @click.stop="show()"><v-icon>mdi-poll</v-icon></v-btn>
    <v-dialog
      v-model="showChart"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="ma-5 pa-5">
        <v-toolbar color="primary">
          <v-btn icon dark @click="showChart = false">
            <v-icon dark>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Chart for {{ symbol }} </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div>
          <v-row v-for="tf in timeframes" :key="tf.label" class="ma-2 pa-2">
            <v-col class="flex-grow-1 flex-shrink-0">
              <div class="primary d-flex justify-center">
                <h2>{{ tf.label }}</h2>
              </div>
              <iframe
                :id="symbolsEdited + '-' + tf.value"
                :src="
                  'https://s.tradingview.com/widgetembed/?frameElementId=' +
                  symbol +
                  '-' +
                  tf.value +
                  '&symbol=BINANCE%3A' +
                  symbolsEdited +
                  '&interval=' +
                  tf.value +
                  '&theme=dark&style=1&hidesidetoolbar=1&hidelegend=1&hidetoptoolbar=1&studies=RSI@tv-basicstudies&timezone=Asia%2FBangkok'
                "
                frameborder="0"
                height="100%"
                width="100%"
                class="flex-grow-1 flex-shrink-0"
              ></iframe>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Tradingview",
  data: () => ({
    timeframes: [
      { label: "15m", value: 15 },
      { label: "1h", value: 60 },
      { label: "4h", value: 240 },
    ],
    showChart: false,
    symbolsEdited: "",
  }),
  methods: {
    show() {
      this.symbolsEdited = this.symbol.replace("/USDT", "USDTPERP");
      this.showChart = true;
    },
  },
  props: { symbol: String },
};
</script>