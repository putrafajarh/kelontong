import { defineRule, configure } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'

configure({
    generateMessage: localize({
        en
    })
})

Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule])
})
