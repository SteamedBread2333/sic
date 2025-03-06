import { PathLike } from 'fs';

export type languageCodes = [
  /** languageCodes start */
  "af-ZA", // Afrikaans (South Africa)
  "am-ET", // Amharic (Ethiopia)
  "ar-AR", // Arabic (Argentina)
  "ar-EG", // Arabic (Egypt)
  "ar-SA", // Arabic (Saudi Arabia)
  "az-AZ", // Azerbaijani (Azerbaijan)
  "be-BY", // Belarusian (Belarus)
  "bg-BG", // Bulgarian (Bulgaria)
  "bn-BD", // Bengali (Bangladesh)
  "bn-IN", // Bengali (India)
  "bs-BA", // Bosnian (Bosnia and Herzegovina)
  "ca-ES", // Catalan (Spain)
  "cs-CZ", // Czech (Czech Republic)
  "cy-GB", // Welsh (United Kingdom)
  "da-DK", // Danish (Denmark)
  "de-AT", // German (Austria)
  "de-CH", // German (Switzerland)
  "de-DE", // German (Germany)
  "el-GR", // Greek (Greece)
  "en-AU", // English (Australia)
  "en-CA", // English (Canada)
  "en-GB", // English (United Kingdom)
  "en-IN", // English (India)
  "en-US", // English (United States)
  "en-ZA", // English (South Africa)
  "es-AR", // Spanish (Argentina)
  "es-CL", // Spanish (Chile)
  "es-CO", // Spanish (Colombia)
  "es-ES", // Spanish (Spain)
  "es-MX", // Spanish (Mexico)
  "es-US", // Spanish (United States)
  "et-EE", // Estonian (Estonia)
  "eu-ES", // Basque (Spain)
  "fa-IR", // Persian (Iran)
  "fi-FI", // Finnish (Finland)
  "fr-CA", // French (Canada)
  "fr-CH", // French (Switzerland)
  "fr-FR", // French (France)
  "gl-ES", // Galician (Spain)
  "gu-IN", // Gujarati (India)
  "he-IL", // Hebrew (Israel)
  "hi-IN", // Hindi (India)
  "hr-HR", // Croatian (Croatia)
  "ht-HT", // Haitian Creole (Haiti)
  "hu-HU", // Hungarian (Hungary)
  "hy-AM", // Armenian (Armenia)
  "id-ID", // Indonesian (Indonesia)
  "is-IS", // Icelandic (Iceland)
  "it-IT", // Italian (Italy)
  "ja-JP", // Japanese (Japan)
  "ka-GE", // Georgian (Georgia)
  "kk-KZ", // Kazakh (Kazakhstan)
  "km-KH", // Khmer (Cambodia)
  "kn-IN", // Kannada (India)
  "ko-KR", // Korean (South Korea)
  "lo-LA", // Lao (Laos)
  "lt-LT", // Lithuanian (Lithuania)
  "lv-LV", // Latvian (Latvia)
  "mk-MK", // Macedonian (North Macedonia)
  "ml-IN", // Malayalam (India)
  "mn-MN", // Mongolian (Mongolia)
  "mr-IN", // Marathi (India)
  "ms-MY", // Malay (Malaysia)
  "my-MM", // Burmese (Myanmar)
  "nb-NO", // Norwegian Bokmål (Norway)
  "ne-NP", // Nepali (Nepal)
  "nl-BE", // Dutch (Belgium)
  "nl-NL", // Dutch (Netherlands)
  "pa-IN", // Punjabi (India)
  "pl-PL", // Polish (Poland)
  "pt-BR", // Portuguese (Brazil)
  "pt-PT", // Portuguese (Portugal)
  "ro-RO", // Romanian (Romania)
  "ru-RU", // Russian (Russia)
  "si-LK", // Sinhala (Sri Lanka)
  "sk-SK", // Slovak (Slovakia)
  "sl-SI", // Slovenian (Slovenia)
  "sq-AL", // Albanian (Albania)
  "sr-RS", // Serbian (Serbia)
  "sv-SE", // Swedish (Sweden)
  "sw-TZ", // Swahili (Tanzania)
  "ta-IN", // Tamil (India)
  "te-IN", // Telugu (India)
  "th-TH", // Thai (Thailand)
  "tl-PH", // Filipino (Philippines)
  "tr-TR", // Turkish (Turkey)
  "uk-UA", // Ukrainian (Ukraine)
  "ur-PK", // Urdu (Pakistan)
  "uz-UZ", // Uzbek (Uzbekistan)
  "vi-VN", // Vietnamese (Vietnam)
  "zh-CN", // Chinese (Simplified, China)
  "zh-HK", // Chinese (Traditional, Hong Kong)
  "zh-TW"  // Chinese (Traditional, Taiwan)
  /** languageCodes end */
]

type Code = languageCodes[number];

export type LanguaheCodeScope = Code[];

export type BaseSomkingIntl = {
  // 复制到工作区是需要忽略的文件夹
  ignoredFiles: string[],
  // 宿主项目locales所在路径
  originDir: string,
  // 中间产物输出目录
  targerDir: string,
  // 工作区目录
  spaceDir: string,
  // 宿主项目locales复制到工作区的子目录
  sourceDir: string,
  // 导出的excel 名
  exportFilePath: string,
  // 导入的excel 名
  importFilePath: string,
  // 需要支持的语言包
  languages: LanguaheCodeScope,
  /** 
   * @description 表格列阵
   * @example 'zh-CN': [3, 2] 取值优先级：列3 > 列2; 'en-US: [1]' 取值 列1
   */
  columns: Partial<Record<Code | 'key', number[]>>,
  /**
   * @description 表格模式
   * @default 'multiple'
   */
  sheetMode?: 'single' | 'multiple',
}

export type SomkingIntl = BaseSomkingIntl & {
  /**
   * 插件配置对象。
   */
  plugins?: {
    /**
     * 收集器插件的路径。
     */
    collector?: PathLike;
    /**
     * 传播器插件的路径。
     */
    spreader?: PathLike;
  };
};