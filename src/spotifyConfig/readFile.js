import fs from "fs";
import os from "os";




function readConfig(){
//fs.existsSync(`${os.homedir()}/spolaxyConfig/config.js`);
  let configExist = false;
  let data = null;
  let jsonData = null;
  try{
    configExist =  fs.existsSync(`${os.homedir()}/spolaxyConfig/config.js`);

  if(configExist){
     data = fs.readFileSync(`${os.homedir()}/spolaxyConfig/config.js`);
     jsonData = JSON.parse(data);
        return jsonData;
  }
}catch(err){
  console.log('Error from readConfig function: ', err);
}
  return configExist;
}



function writeConfig(clientId, redirect){

}

export {
  readConfig,
}
