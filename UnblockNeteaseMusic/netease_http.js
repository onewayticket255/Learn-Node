const http = require('http')
const url = require('url')
const fs = require("fs")
const crypto = require('./netease_crypto')



let HttpProxy = new http.Server()
let HttpPort = 6789


HttpProxy.listen(HttpPort, () => console.log(`HttpProxy Starts at ${HttpPort}`))
    .on('error', e => console.log(e))
    .on('request', (request_before, response_before) => {
        let [request_before_buffer, request_before_cipher, response_after_buffer, response_after_cipher] = [[], '', [], '']

        console.log(`${request_before.method}  http://${url.parse(request_before.url).hostname}:${url.parse(request_before.url).port || 80}${url.parse(request_before.url).path}`);
        //console.log(request_before.headers)

        if ('accept-encoding' in request_before.headers) delete request_before.headers['accept-encoding']
        if ('content-length' in request_before.headers) delete request_before.headers['content-length']


        let options = {
            method: request_before.method,
            protocol: `http:`,
            hostname: url.parse(request_before.url).hostname,
            port: url.parse(request_before.url).port || 80,
            path: url.parse(request_before.url).path,
            headers: request_before.headers
        }


        request_before.on('error', e => console.log(e))
            .on('data', chunk => request_before_buffer.push(chunk))
            .on('end', () => {
                request_before_cipher = Buffer.concat(request_before_buffer).toString('utf8')
                //console.log(`crypto.decrypt_params: ${crypto.decrypt_params(request_before_cipher.substring(7))}`)
            })




        let request_after = http.request(options)
        request_before.pipe(request_after)

        request_after.on('error', e => console.log(e))
            .on('response', response_after => {
                //console.log(response_after.headers)                           
                Object.entries(response_after.headers).map(e => {
                    let [k, v] = e;
                    if (k != 'content-length') {
                        response_before.setHeader(k, v)
                    }
                })

                response_before.writeHead(response_after.statusCode)



                response_after.on('error', e => console.log(e))
                    .on('data', chunk => response_after_buffer.push(chunk))
                    .on('end', () => {
                        response_after_cipher = Buffer.concat(response_after_buffer).toString('hex')
                        let hook_before = crypto.decrypt(response_after_cipher)

                        const inject = (key, value) => {

                            if (typeof (value) === 'object' && value != null) {

                                if ('fee' in value) value['fee'] = 0
                                if ('cp' in value) value['cp'] = 0
                                if ('st' in value && 'pl' in value && 'dl' in value && 'subp' in value) {
                                    value['st'] = 0
                                    value['subp'] = 1
                                    value['pl'] = (value['pl'] == 0) ? 320000 : value['pl']
                                    value['dl'] = (value['dl'] == 0) ? 320000 : value['dl']
                                }
                            }


                            if (request_before.url.indexOf(`eapi/song/enhance/player/url`)) {
                                if (key == `data` && value[0].code !== `200`) {
                                    value[0].url = 'http://isure.stream.qqmusic.qq.com/M500001J5QJL1pRQYB.mp3?vkey=01682F47E88A0D65563D07AE049B4F8C23F2387FE5D85C101A24FEA0AEDFAB6A4760AD643DD425FE9B70F6F27AFB590C9222F57980A0D3EA&uin=0&fromtag=8&guid=7332953645'
                                    value[0].br = 320000
                                    value[0].code = 200

                                }

                            }


                            return value

                        }

                        let hook_after = JSON.stringify(JSON.parse(hook_before), inject)

                        response_before.end(Buffer.from(crypto.encrypt(hook_after), 'hex'))

                    })


            })



    })

