import {createI18n} from 'vue-i18n'

const i18n = createI18n({
    locale: localStorage.getItem('lang') || 'en',
    messages: {
        ch: require('./ch'),
        en: require('./en')
    }
})

export default i18n
