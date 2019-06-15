const http    = require('http')
const you_get =require('./you-get_exec')

let HttpServer = new http.Server()
let HttpPort = 6789
HttpServer.listen(HttpPort,()=>console.log(`HttpServer Start at ${HttpPort}`))
          .on('error',e=>console.log(e))
          .on('request',(request,response)=>{
              //only directurl or you-get -itag url   
              console.log(request.url)   
              console.log(decodeURIComponent(request.url).substring(1))
              if(request.url.match(/you-get/)) {
                  you_get.download(decodeURIComponent(request.url).substring(1))
                  response.writeHead(200, { 'Content-Type': 'application/json' })
                  response.end()
              }
              else{
                  you_get.getinfo(decodeURIComponent(request.url).substring(1)).then(
                      resolve=>{
                          response.writeHead(200, { 'Content-Type': 'application/json' })
                          response.end(JSON.stringify(resolve))

                      }
                  )
              }

              

          })