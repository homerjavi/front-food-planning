// import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import auth from './auth'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ["auth"],
})

const Store = createStore({
  modules: {
    auth
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING,
  plugins: [vuexLocal.plugin]
})

export default function (/* { ssrContext } */) {
  return Store
}

// Exportamos la instancia del Store
export { Store }
