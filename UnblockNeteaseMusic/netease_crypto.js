const crypto = require("crypto")
const fs = require('fs');
const url = require('url')
const eapikey = "e82ckenh8dichen8"


function decrypt(cipher_text) {
    let decipher = crypto.createDecipheriv("aes-128-ecb", eapikey, null)
    let plain_text = decipher.update(cipher_text, "hex", "utf8")
    plain_text += decipher.final("utf8")
    return plain_text
}

function encrypt(plain_text) {
    let cipher = crypto.createCipheriv('aes-128-ecb', eapikey, null)
    let cipher_text = cipher.update(plain_text, "utf8", "hex")
    cipher_text += cipher.final("hex")
    return cipher_text
}


function decrypt_params(params) {
    let text = decrypt(params)
    let result = text.split("-36cd479b6b5-")
    return result
}

function encrypt_params(url, body) {
    url = parse(url)
    let text = JSON.stringify(body)
    let message = `nobody${url.path}use${text}md5forencrypt`
    let digest = crypto.createHash('md5').update(message).digest('hex')
    let data = `${url.path}-36cd479b6b5-${text}-36cd479b6b5-${digest}`
    return `params=${encrypt(data).toUpperCase()}`
}


module.exports = { decrypt_params, encrypt_params, decrypt, encrypt }