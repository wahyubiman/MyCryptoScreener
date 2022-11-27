<template>
  <div class="pa-5">
    <div class="d-flex justify-space-around ma-2 pa-2">
      <div>
        <v-btn @click="showInfoSnackbar()" dark rounded color="warning">
          <v-icon dark>mdi-information-outline</v-icon>
        </v-btn>
      </div>

      <div><PositionSize /></div>

      <div>
        <!-- Dialog setting modal -->
        <v-dialog transition="dialog-bottom-transition" max-width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" dark rounded color="primary">
              <v-icon dark>mdi-wrench</v-icon>
            </v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>
                <v-toolbar-title>Screener Setting </v-toolbar-title
                ><v-spacer></v-spacer><v-spacer></v-spacer
                ><v-btn icon dark @click="dialog.value = false">
                  <v-icon dark>mdi-close</v-icon>
                </v-btn></v-toolbar
              >
              <v-card-text>
                <div class="justify-space-between">
                  <div class="d-flex justify-space-between">
                    <div>
                      <v-card-text>
                        <label for="rsi">RSI Length</label>
                        <v-text-field
                          v-model="lengthRsi"
                          type="number"
                          name="rsi"
                          label="RSI Length"
                          id="rsiLength"
                          solo
                          dense
                        ></v-text-field>
                      </v-card-text>
                    </div>

                    <div>
                      <v-card-text>
                        <div>
                          <label for="ema">EMA Length</label>
                          <v-text-field
                            v-model="lengthEma"
                            type="number"
                            name="ema"
                            label="EMA Length"
                            id="emaLength"
                            solo
                            dense
                          ></v-text-field>
                        </div>
                      </v-card-text>
                    </div>
                  </div>

                  <div class="d-flex justify-space-between">
                    <div>
                      <v-card-text
                        ><label for="timeframe">Timeframe</label>
                        <v-select
                          :items="tfList"
                          label="Timeframe"
                          v-model="tf"
                          solo
                          dense
                        ></v-select
                      ></v-card-text>
                    </div>
                    <div>
                      <v-card-text
                        ><label for="refresh">Refresh Time ( Minute )</label>
                        <v-text-field
                          name="refresh"
                          label="Refresh"
                          id="refresh"
                          type="number"
                          v-model="refresh"
                          solo
                          dense
                        ></v-text-field
                      ></v-card-text>
                    </div>
                  </div>
                  <div>
                    <v-card-text>
                      <v-select
                        :items="symbols"
                        v-model="symbolsSelected"
                        label="Symbol List"
                        multiple
                        chips
                        outlined
                      ></v-select>
                    </v-card-text>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions class="justify-end green--text ma-2 pa-2">
                <v-btn
                  rounded
                  primary
                  @click="
                    dialog.value = false;
                    calculate();
                  "
                  >Save</v-btn
                >
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <!-- End Dialog setting modal -->
      </div>
    </div>

    <div id="data-table" class="ma-2 pa-2">
      <!-- Table data -->
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="green accent-4"
      ></v-progress-linear>

      <v-simple-table height="750" fixed-header dense>
        <thead>
          <tr>
            <th class="text-center">Symbols</th>
            <th class="text-center">Price</th>
            <th class="text-center">Ema</th>
            <th class="text-center">Rsi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="result in results"
            :key="result.symbol"
            class="text-center"
          >
            <td
              :class="{
                'green--text': result.ema < result.price,
                'red--text': result.ema > result.price,
              }"
            >
              <div class="d-flex justify-center justify-space-between">
                <div class="text-left">
                  {{ result.symbol }}
                </div>
                <v-spacer></v-spacer>
                <div class="text-rigth">
                  <Tradingview :symbol="result.symbol" />
                </div>
              </div>
            </td>
            <td>{{ result.price }}</td>
            <td
              :class="{
                'green--text': result.ema < result.price,
                'red--text': result.ema > result.price,
              }"
            >
              {{ result.ema }}
            </td>
            <td
              :class="{
                'green--text': result.rsi < 39.5 && result.price > result.ema,
                'red--text': result.rsi > 60.5 && result.price < result.ema,
                'orange--text': result.rsi > 39.5 && result.rsi < 60.5,
              }"
            >
              {{ result.rsi }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <v-snackbar bottom right elevation="24" v-model="snackbar" timeout="5000">
      {{ snackText }}
    </v-snackbar>
  </div>
</template>

<script>
import Tradingview from "./Tradingview"; // for chart detail
import PositionSize from "./PositionSize"; // position sizing dialog

// initialize ccxt & tulind
const ccxt = require("ccxt");
const ta = require("technicalindicators");

let ex = new ccxt.binance();
ex.options.defaultType = "future";
ex.rateLimit = true;

export default {
  name: "Home",
  components: {
    Tradingview,
    PositionSize,
  },

  data: () => ({
    value: "",
    symbols: "", // list of symbols
    symbolsSelected: "", // selected symbol ffrom setting dialog
    tf: "1d", // default timeframe
    tfList: ["5m", "15m", "30m", "1h", "4h", "1d"],
    lengthEma: 34, // default ema length
    lengthRsi: 14, // default rsi length
    results: [
      // { symbol: "BTC/USDT", price: 55000, ema: 52000, rsi: 45 },
      // { symbol: "ADA/USDT", price: 50, ema: 54, rsi: 35 },
    ],
    snackbar: false,
    snackText: "",
    lastUpdate: "", // last update
    refresh: 5, // durasi refresh dalam menit
    loading: false, // untuk progress bar
    bgLoopId: "", // untuk loop screener on created
  }),

  methods: {
    showSnackbar(text) {
      this.snackText = text;
      this.snackbar = true;
    },

    showInfoSnackbar() {
      this.snackText =
        "RSI: " +
        this.lengthRsi +
        " | " +
        "EMA: " +
        this.lengthEma +
        "\n" +
        "Timeframe: " +
        this.tf +
        " | " +
        "Refresh: " +
        this.refresh +
        " | " +
        this.lastUpdate;
      this.snackbar = true;
    },

    calculate() {
      let run = () => {
        // refresh data on change
        this.fetchData();
        // handle setting changes
        clearInterval(this.bgLoopId);
        this.bgLoopId = setInterval(() => {
          this.fetchData();
        }, this.refresh * 1000 * 60);
      };

      if (this.lengthEma < 1) {
        alert("Please set EMA length above 0");
        this.lengthEma = 34;
      } else if (this.lengthRsi < 1) {
        alert("Please set RSI length above 0");
        this.lengthRsi = 14;
      } else if (this.refresh < 5) {
        alert("Please set minimal refresh above 5 min to avoid api thortle");
        this.refresh = 60;
      } else {
        if (this.symbolsSelected.length != 0) {
          this.symbols = this.symbolsSelected;
        }
        run();
      }
    },

    async fetchData() {
      // untuk calculate data
      this.loading = true;
      let result = [];
      try {
        for (let i = 0; i < this.symbols.length; i++) {
          try {
            await ex
              .fetchOHLCV(this.symbols[i], this.tf, undefined, 100)
              .then((data) => {
                //this.progress = "fetching " + this.symbols[i] + " . . .";
                return data;
              })
              .then((data) => {
                return data.map((x) => x[4]);
              })
              .then(async (close) => {
                let rsi = ta.RSI.calculate({
                  period: this.lengthRsi,
                  values: close,
                });
                let ema = ta.EMA.calculate({
                  period: this.lengthEma,
                  values: close,
                });
                let hasil = {
                  symbol: this.symbols[i],
                  price: close[close.length - 1],
                  ema: ema[ema.length - 1].toFixed(
                    close[close.length - 1].toString().split(".")[1].length
                  ),
                  rsi: rsi[rsi.length - 1],
                };
                console.log(this.symbols[i] + " Done");
                result.push(hasil);
              });
          } catch (error) {
            // continue regardless of error
          }
        }
      } catch (error) {
        // handle error here
      } finally {
        this.results = result;
        let newDate = new Date();
        this.lastUpdate = newDate;
        this.showSnackbar(newDate);
        this.loading = false;
      }
    },
  },

  created() {
    // fetch symbol & sort them
    let init = ex.loadMarkets();
    init
      .then(() => {
        return ex.symbols;
      })
      .then((data) => {
        let sorted = [];
        let len = data.length;
        for (let i = 0; i < len; i++) {
          if (data[i].includes("/USDT")) {
            sorted.push(data[i]);
          }
        }
        return sorted;
      })
      .then((data) => {
        this.symbols = data;
        // fetch awal muat halaman
        this.fetchData();
        // handle bg process
        this.bgLoopId = setInterval(() => {
          this.fetchData();
        }, this.refresh * 1000 * 60);
      });
  },
  destroyed() {
    clearInterval(this.bgLoopId);
  },
};
</script>
