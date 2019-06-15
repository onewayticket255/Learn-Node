const exec = require('child_process').exec


function getinfo(url) {
    return new Promise((resolve, reject) => {
        let command = `you-get -i ${url}`
        exec(command, (err, stdout, stderr) => {
            if (err) reject(err)
            //console.log(`stdout: ${stdout}`);
            //console.log(`stderr: ${stderr}`); 
            let regex_title = /title:\s+([\s\S]+?)\n/
            let regex_quality = /quality:\s+(\S+?)\s/g
            let regex_itag = /download-with:[\s\S]+?you-get\s+--itag=(\d+)[\s\S]+?\n/g
            let regex_size = /size:\s+(.*?)\s+MiB/g
            let regex_container = /container:\s+([\s\S]+?)\n/g

            let [tmp, title, quality, itag, size, container] = [, , [],[],[],[]]

            while ((tmp = regex_quality.exec(stdout)) != null) {
                quality.push(tmp[1])
            }
            while ((tmp = regex_itag.exec(stdout)) != null) {
                itag.push(tmp[1])
            }

            while ((tmp = regex_size.exec(stdout)) != null) {
                size.push(tmp[1] + "MB")
            }

            while ((tmp = regex_container.exec(stdout)) != null) {
                container.push(tmp[1])
            }

            title = regex_title.exec(stdout)[1]

            let rowsData = quality.map((e, i) => `${e}.${container[i]}`)
            let urlsData = itag.map(e => `you-get --itag=${e} ${url}`)

            let result = {
                rowsData,
                urlsData,
                header: {},
                title,
                size,
                type: "you-get"
            }

            resolve(result)


        })


    })
}


function download(url){
    let command=`${url} -o ~/ariadownload`
    exec(command, (err, stdout, stderr) => {
        
    })
    
}


//download('you-get --itag=133 https://www.youtube.com/watch?v=y1-e2Ro1_Ig')

module.exports={download,getinfo}