/**
 * iFlytek Machine Translation API Integration
 * This script integrates the iFlytek machine translation API into Google Sheets.
 * It allows you to translate text from one language to another using the iFlytek API.
 * 
 * Prerequisites:
 * - Sign up for an iFlytek developer account and obtain your API credentials.
 * - Replace the placeholder credentials in the config object with your actual credentials.
 * 
 * Instructions:
 * - Use the TranslateXF function to translate text. Example: TranslateXF('hello', 'en', 'cn').
 * - The function will return the translated text or null if an error occurs.
 * 
 * API Documentation:
 * - Machine Translation API: https://www.xfyun.cn/doc/nlp/niutrans/API.html
 * - Error Codes: https://www.xfyun.cn/document/error-code
 */

// System configuration
const config = {
  // Request URL
  hostUrl: "https://ntrans.xfyun.cn/v2/ots",
  host: "ntrans.xfyun.cn",
  // Obtain these credentials from the iFlytek console under 'My Applications' - 'Machine Translation'
  appid: "your appid",
  apiSecret: "your apiSecret",
  apiKey: "your apiKey",
  uri: "/v2/ots"
};

/**
 * Translates text using the iFlytek machine translation API.
 * 
 * @param {string} text - The text to translate.
 * @param {string} from - The source language code (default: 'en').
 * @param {string} to - The target language code (default: 'cn').
 * @return {string|null} The translated text or null if an error occurs.
 */
function XFTranslate(text = 'hello', from = 'en', to = 'cn') {
  const postBody = getPostBody(text, from, to);
  const digest = getDigest(postBody);

  // Get current time in RFC1123 format
  const date = new Date().toUTCString();
  const options = {
    url: config.hostUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'Host': config.host,
      'Date': date,
      'Digest': digest,
      'Authorization': getAuthStr(date, digest)
    },
    method: 'post',
    payload: JSON.stringify(postBody),
    contentType: 'application/json'
  };

  try {
    console.log(config.hostUrl, options);
    const response = UrlFetchApp.fetch(config.hostUrl, options);
    const responseData = JSON.parse(response.getContentText());
    if (responseData.code !== 0) {
      throw new Error(`Error occurred, error code: ${responseData.code} error message: ${responseData.message}`);
    }
    return responseData.data.result.trans_result.dst;
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
}

/**
 * Generates the request body for the translation API.
 * 
 * @param {string} text - The text to translate.
 * @param {string} from - The source language code.
 * @param {string} to - The target language code.
 * @return {object} The request body.
 */
function getPostBody(text, from, to) {
  return {
    common: {
      app_id: config.appid
    },
    business: {
      from: from,
      to: to
    },
    data: {
      text: Utilities.base64Encode(text)
    }
  };
}

/**
 * Computes the digest for the request body.
 * 
 * @param {object} body - The request body.
 * @return {string} The digest string.
 */
function getDigest(body) {
  const bodyStr = JSON.stringify(body);
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bodyStr);
  return 'SHA-256=' + Utilities.base64Encode(digest);
}

/**
 * Generates the authorization header for the API request.
 * 
 * @param {string} date - The current date in RFC1123 format.
 * @param {string} digest - The digest of the request body.
 * @return {string} The authorization header string.
 */
function getAuthStr(date, digest) {
  const signatureOrigin = `host: ${config.host}\ndate: ${date}\nPOST ${config.uri} HTTP/1.1\ndigest: ${digest}`;
  const signatureBytes = Utilities.computeHmacSha256Signature(signatureOrigin, config.apiSecret);
  const signature = Utilities.base64Encode(signatureBytes);
  return `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line digest", signature="${signature}"`;
}