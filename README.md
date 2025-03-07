<h1 align="center">
  <br/>
    <img src="https://github.com/user-attachments/assets/a76572b1-0c79-4562-86cc-67bf9dd40655" width="260"/>
  <br/>
</h1>

# Smoking I18n CLI(sic) Frontend Internationalization Toolkit

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
-V --version          Show version number
init                  Init Work Space, Pulling Source Files
xlsx                  Generage Export File(.xlsx)
ts                    Start import .xlsx File, and generate .ts files
langs                 Show All Supported Languages
```

## Config file
Need create ```intl.config.ts``` in your project root directory.
Type of ```intl.config.ts``` as below:

[Type](https://github.com/SteamedBread2333/sic/blob/main/lib/index.d.ts)

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
