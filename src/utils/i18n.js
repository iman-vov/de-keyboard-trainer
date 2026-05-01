import de from '../data/locales/de.json'
import ru from '../data/locales/ru.json'
import uk from '../data/locales/uk.json'

const locales = { de, ru, uk }
let lang = 'de'

export function setLang(code) {
  if (locales[code]) lang = code
}

export function getLang() {
  return lang
}

export function t(key) {
  return locales[lang]?.[key] ?? locales.de[key] ?? key
}
