const save=true;
const puppeteer = require('puppeteer');
const fs = require('fs');
let scrape = async (addrs) => {
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  for(var addr of addrs){
    var page = await browser.newPage();
    await page.goto(addr["value"],{ timeout: 50000});
    await page.waitFor(5000);
    console.log("\nin "+addr["value"]);
    await page.click("#rendered-content > div > div > section > div.rc-VLPLoggedOutPage > div.rc-VLPVideoPlayer > div > div.video-overlay.video-js.vjs-big-play-centered > button");
    await page.waitFor(5000);
    result = await page.evaluate(()=>{
      var title=document.querySelector("#rendered-content > div > div > section > div.rc-VLPLoggedOutPage > div.rc-VLPVideoPlayer > h1").innerText;
      var ad=document.querySelector("#vjs_video_3_html5_api").getAttribute("src");
      return {title,ad};
    });
    if(save){
      fs.appendFile("./axel.sh",`axel -n 10 \"`+result["ad"]+`\" -o ./`+addr["key"]+result["title"]+".webm\n",(e)=>{});
    }else{
      require("child_process").exec(`axel -n 10 \"`+result["ad"]+`\" -o ./`+addr["key"]+result["title"]+".webm\n",(e,so,se)=>{
        console.log(addr["key"]+" successfully");
      });
    }
  }
  browser.close();
};

scrape(JSON.parse(require("fs").readFileSync("./addr.json")));
