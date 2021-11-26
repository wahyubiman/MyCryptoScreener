import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: { dark: true }, // set default to dark theme
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
});
