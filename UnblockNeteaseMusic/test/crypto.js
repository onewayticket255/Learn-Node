const crypto=require("crypto")
const fs = require('fs');
const eapikey="e82ckenh8dichen8"

function decrypt(params){
    let decipher=crypto.createDecipheriv("aes-128-ecb",eapikey,null)
    let text=decipher.update(params,"hex","utf-8")
    text+=decipher.final("utf-8")
    return text
} 

function encrypt(text,key){
    let cipher = crypto.createCipheriv('aes-128-ecb', eapikey, null)   
    let params=cipher.update(text,"utf-8","hex")
    params+=cipher.final("hex")
    return params
}


function decodefiledata(){
   var data = fs.readFileSync(process.argv[3],"hex");
   var text=decrypt(data)
   console.log(text)
}


function decodeparams(){
   var params=process.argv[3]
   var text=decrypt(params)
   var result=text.split("-36cd479b6b5-")
   result[1]=result[1].replace(/\\/g,"")
   console.log(result)
  
}


process.argv[2]==0?decodefiledata():decodeparams()

// Usage
// node /path/ 0 file 
// node /path/ 1 params