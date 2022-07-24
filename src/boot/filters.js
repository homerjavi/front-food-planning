import moment from 'moment';
import { boot } from 'quasar/wrappers'

export default boot(async ( { app } ) => {
  app.config.globalProperties.$filters = {
    formatDate(value) {
        if (value) {
            return moment(String(value)).format('DD-MM-YYYY');
        }
    }
  }
})

// export default ({ Vue }) => {
//     Vue.filter('formatDate', (value) => {
//         if (value) {
//             return moment(String(value)).format('d-m-Y');
//         }
//     });
// }