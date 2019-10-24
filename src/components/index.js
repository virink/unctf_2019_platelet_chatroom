import live2d from './live2d'
import dialogue from './dialogue'
import chatbox from './chatbox'

const live2d_vue = {
    install(Vue) {
        Vue.component('live2d', live2d)
        Vue.component('dialogue', dialogue)
        Vue.component('chatbox', chatbox)
    }
}

export default live2d_vue