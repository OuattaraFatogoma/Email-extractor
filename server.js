const express = require("express");
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 8080;

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/index.js');
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});

app.get('/images/fatogomao.png', (req, res) => {
  res.sendFile(__dirname + '/images/fatogomao.png');
});
app.get('/images/fiverr.png', (req, res) => {
  res.sendFile(__dirname + '/images/fiverr.png');
});

app.get('/images/upwork.png', (req, res) => {
  res.sendFile(__dirname + '/images/upwork.png');
});

app.get('/images/favicon.png', (req, res) => {
  res.sendFile(__dirname + '/images/favicon.png');
});

app.post("/scrape", async (req, res)=>{
    const {message} = req.body; 
    try {
            // Launch the browser and open a new blank page
            const browser = await puppeteer.launch({
              headless: false,
              defaultViewport: false,
              userDataDir: "./tmp"
            });
            const page = await browser.newPage();
            let emails=[];
            // Navigate the page to a URL
            await page.goto("https://www.google.com/");
            await page.waitForSelector(".gLFyf")
            let showMore = ".RVQdVd";
            let regexp = /[A-Za-z0-9.]+@[A-Za-z0-9]+\.com/g;
            await page.type(".gLFyf", message , {delay: 10})
            await page.keyboard.press("Enter", {delay : 10})
            await page.waitForSelector("#result-stats")
            await new Promise((resolve)=> setTimeout(resolve,5000));


            for(let i=0; i<6; i++){
              console.log(i)
              try{
               await autoscroll(page);
              }
              catch(err){
                  console.log("Finish");
                  break;
              }
            }


            const elements = await page.$$('div.MjjYud');
            for (element of elements){
              let source = await page.evaluate(el => el.querySelector("div").textContent, element);
              const matches = source.match(regexp);
              if(matches!== null){
                  emails.push(...matches);
              }
            }
            let uniqueEmail = new Set(emails);
            emails = Array.from(uniqueEmail);
            console.log(emails)
            let data = JSON.stringify(emails);
            res.status(200).json(emails);
            await browser.close();

    } catch (error) {
        console.error('Error scraping data:', error);
        res.status(500).json({ error: 'An error occurred while scraping data.' });
    }
    
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})


//////////:::::::::::::: Functions :::::::::://////////////

async function autoscroll(page){
    while(~page.waitForSelector(".RVQdVd")){
      try {
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        await new Promise((resolve)=> setTimeout(resolve,2000));
        if(page.waitForSelector(".RVQdVd")){
          await new Promise((resolve)=> setTimeout(resolve,500));
          await page.click(".RVQdVd")
          break;
        } 
      } catch (error) {
        break;
      }
    }
}