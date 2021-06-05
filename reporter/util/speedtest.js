const { execSync, spawn, fork } = require('child_process');
const fs = require("fs");

module.exports = async function speedtest(){
  return new Promise(async (resolve, reject) => {
    console.log("[SPEEDTEST]".bgYellow.black + ` Performing speedtest...`);
    process.env.PRINT_SENDING_STATS = false;

    let result = {};
    let args = ['-f', 'json', "-p", "-P", "16"];

    // fs.readdir('./', (err, files) => {
    //   for (file of files){
    //     if (file.startsWith('speedtest')){

    //     };
    //   }
    //   reject();
    // });

    const files = await fs.promises.readdir('./');
    for(file of files){
      if (file.startsWith('speedtest')){
        let netsh_output = spawn(`./${file}`, args, {
          windowsHide: true,
        });

        netsh_output.stdout.on('data', (progress) => {
          if(!progress || progress.toString() == '' || !progress.toString()) return;

          try {
            progress = JSON.parse(progress.toString());
          } catch (error) {}

          if (progress.type == 'result') return result = progress;
          
          if (progress.type !== 'ping' && progress.type !== 'download' && progress.type !== 'upload') return;
          if (!progress.download?.bytes && !progress.upload?.bytes) return;

          if (progress.type == 'download' || progress.type == 'upload'){
            clearLastLine();
            console.log("[SPEEDTEST]".bgYellow.black + 
              ` Performing: ${progress.type.yellow}` +
              ` Progress: ${((progress[progress.type].progress * 100).toFixed(2)).toString().yellow}%` +  
              ` Speed: ${((progress[progress.type].bandwidth / 100000).toFixed(2)).toString().yellow}Mbps`
            );
          } else {
            clearLastLine();
            console.log("[SPEEDTEST]".bgYellow.black + 
              ` Performing: ${progress.type.yellow}` + 
              ` Progress: ${((progress[progress.type].progress * 100).toFixed(2)).toString().yellow}%` + 
              ` Ping: ${((progress.ping.jitter).toFixed(2)).toString().yellow}ms`
            );
          }
        });

        netsh_output.stderr.on('data', (err) => {
          console.log(err.message);
          reject(err.message);
          process.env.PRINT_SENDING_STATS = true;
        });

        netsh_output.on('exit', () => {
          clearLastLine();
          console.log("[SPEEDTEST]".bgYellow.black + 
            ` Speedtest complete - Download: ${((result.download.bandwidth / 100000).toFixed(2)).toString().yellow}Mbps` + 
            ` Upload: ${((result.upload.bandwidth / 100000).toFixed(2)).toString().yellow}Mbps` + 
            ` Ping: ${((result.ping.latency).toFixed(2)).toString().yellow}ms`
          );
          console.log("[INFO]".bgCyan.black + ` Loading Stats...`);
          process.env.PRINT_SENDING_STATS = true;
          resolve(result);
        })
      }
    }
  });
}