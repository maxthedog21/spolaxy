import fs from "fs";
import os from "os";




function readConfig(){
//fs.existsSync(`${os.homedir()}/spolaxyConfig/config.js`);
  let configExist = false;
  let data = null;
  let jsonData = null;
  try{
    configExist =  fs.existsSync(`${os.homedir()}/spolaxyConfig/config.json`);

  if(configExist){
     data = fs.readFileSync(`${os.homedir()}/spolaxyConfig/config.json`, "utf8");
     jsonData = JSON.parse(data);
        return jsonData;
  }
}catch(err){
  console.log('Error from readConfig function: ', err);
  return false;
}
  return false;
}


function writeConfig(clientId, redirectUri){
  let jsonText = `{
   "clientId" : "${clientId}",
   "redirectUri" : "${redirectUri}"
}`
  try {
if (!fs.existsSync(`${os.homedir()}/spolaxyConfig`)){
    fs.mkdirSync(`${os.homedir()}/spolaxyConfig`);
}
  fs.writeFileSync(`${os.homedir()}/spolaxyConfig/config.json`, jsonText);
    return true;
  // file written successfully
} catch (err) {
  console.error(err);
  return false;
}

  return false;
}

export {
  readConfig,
  writeConfig,
}
