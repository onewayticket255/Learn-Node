const http = require('http');
const https=require('https')
const url = require('url');
const net = require('net');
const fs= require('fs')


//FakeHttpProxy
const ssl = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt')
}

let HttpProxy = new https.Server(ssl)
let ProxyPort = 7000

HttpProxy.listen(ProxyPort,()=>console.log(`HttpProxy Starts at ${ProxyPort}`))
         .on('error', e => console.log(e))
         .on('request', (req, res) => {

              console.log(req.url)

              let options =  {
                protocol: `https:`,
                hostname: req.headers.host.split(':')[0],
                method: req.method,
                port: 443,
                path: url.parse(req.url).path,
                headers: req.headers
              }
                  
              console.log("options: "+options)

              res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8'});
              res.write(`<html><body>Fake Site: ${options.protocol}//${options.hostname}</body></html>`)
              res.end();
         })


//HttpTunnel
let HttpTunnel = new http.Server()
let TunnelPort = 6789
HttpTunnel.listen(TunnelPort, () => console.log(`HttpTunnel Starts at ${TunnelPort}`))
          .on('error', e => console.log(e))
          .on('connect', (request, client_socket, head) => {
               let main_url = url.parse(`https://${request.url}`)
               console.log(`CONNECT ${main_url.hostname}:${main_url.port}`)
               client_socket.on('error',e=>console.log(e))
              

            
               let server_socket = net.connect(7000, `127.0.0.1`)          
               server_socket.on('error',e=>console.log(e))
                            .on('connect',() => {
                                                               
                                client_socket.write('HTTP/1.1 200 Connection Established\r\n\r\n')// first:\r\n CRLF second:\r\n new empty line between header and body
                                //server_socket.write(head)
  
                                client_socket.pipe(server_socket)                             
                                server_socket.pipe(client_socket)

                                                                                                 
               })
               

               
               
          })

