const http = require('http');
const url = require('url');
const net = require('net');

let HttpTunnel = new http.Server()
let HttpPort = 6789



HttpTunnel.listen(HttpPort, () => console.log(`HttpTunnel Starts at ${HttpPort}`))
          .on('error', e => console.log(e))
          .on('connect', (request, client_socket, head) => {
               
               let main_url = url.parse(`https://${request.url}`)
               console.log(`CONNECT ${main_url.hostname}:${main_url.port}`)

               client_socket.on('error',e=>console.log(e))
              
               let server_socket = net.connect(main_url.port, main_url.hostname)          
               server_socket.on('error',e=>console.log(e))
                            .on('connect',() => {
                                
                                client_socket.write('HTTP/1.1 200 Connection Established\r\n\r\n')// first:\r\n CRLF second:\r\n new empty line between header and body
                               // server_socket.write(head)
                                server_socket.pipe(client_socket)
                                client_socket.pipe(server_socket)
                             
                                                   
               })
               
            
          })

