# Smoking Intl CLI(sic) Frontend Internationalization Toolkit

## Install

### Project
```shell
npm i smoking-intl-cli --save-dev
```
### Global
```shell
npm i smoking-intl-cli -g
```

## Usage
```
sic [options]
```

## Options
```
-V --version    Show version number
init            Init Work Space, Pulling Source Files
gen:export      Generage Export File(.xlsx)
gen:locales     Start import .xlsx File
langs           Show All Supported Languages
```

## Config file
Need create ```intl.config.ts``` in your project root directory.
Type of ```intl.config.ts``` as below:
```typescript
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
  // Folders to be ignored when copying to the workspace
  ignoredFiles: string[],
  // Path to the host project's locales
  originDir: string,
  // Directory for intermediate output
  targetDir: string,
  // Workspace directory
  spaceDir: string,
  // Subdirectory in the workspace for copied host project locales
  sourceDir: string,
  // Name of the exported Excel file
  exportFilePath: string,
  // Name of the imported Excel file
  importFilePath: string,
  // Supported language packages codes
  languages: LanguaheCodeScope,
  /**
   * @description Spreadsheet column array
   * @example 'zh-CN': [3, 2] Priority order: column 3 > column 2; 'en-US: [1]' corresponds to column 1
   */
  columns: Partial<Record<Code | 'key', number[]>>,
  /**
   * @description Spreadsheet mode
   * @default 'multiple'
   */
  sheetMode?: 'single' | 'multiple',
}

export type SomkingIntl = BaseSomkingIntl & {
  /**
   * plugins
   */
  plugins?: {
    /**
     * collector plugin path
     */
    collector?: PathLike;
    /**
     * spreader plugin path
     */
    spreader?: PathLike;
  };
}
```

## Base Features
1. Support multiple languages export and import.

## More Features
1. Support google translate prefill.
2. Table is code, easy to collaborate.

## Best Practices
### When the "google translate" pre - fill function is enabled, `{cat}` may be translated into `{猫}` or other languages, which can affect template filling.
```javascript
// bad
export intlModule = {
  "xxx-key": {action}{name}
  ...,
}
// good
export intlModule = {
  "xxx-key": {1}{2}
  ...,
}
```