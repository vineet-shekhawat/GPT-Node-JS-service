import express from 'express';
// import { getResponse, restartSession, getChatGPT_DFSResponse } from './ChatGPThelper.js';
import { getResults, getGPT_DFSResults, getGPT_Heading_Sub, get_GPT_trivial, getMultiDallePrompt, GetTrivialSuggestion, GetProgressSuggestion, testPrompts, testPrompts2 } from './GPThelper.js';

const app = express()
const port = 8080;
let api = undefined;
const cache = new Map();
const cacheTimeMap = new Map();

function onlyLettersAndNumbers(str) {
  return Boolean(str.match(/^[A-Za-z0-9]*$/));
}

app.get('/restart', async function(req, res){
  api = await restartSession(api);
  res.send('Restarted api');
});

app.get('/get-Dall-E-prompt', async function(req, res){
  var response = undefined;
  if(req.query.gpt== 'true'){
    response = await getResults(req.query.prompt, true);
  }
  else {
    if (!api) {
      api = await restartSession(api);
    }
    response = await getResponse(api, req.query.prompt, true);
  }
  res.send(response);
});

app.get('/get-titles', async function(req, res){
  var response = undefined;
  if(req.query.gpt== 'true'){
    response = await getResults(req.query.prompt, false);
  }
  else {
    if (!api) {
      api = await restartSession(api);
    }
    response = await getResponse(api, req.query.prompt, false);
  }
  res.send(response);
});

app.get('/get-oldDfsResults', async function(req, res){
  var response = undefined;
  if(req.query.gpt== 'true'){
    //response = await getGPT_DFSResults(req.query.prompt);
    response = await getGPT_Heading_Sub(req.query.prompt);
  }
  else {
    if (!api) {
      api = await restartSession(api);
    }
    response = await getChatGPT_DFSResponse(api, req.query.prompt);
  }
  res.send(response);
});

app.get('/get-multiDallePrompts', async function(req, res){
  const response = await getMultiDallePrompt(req.query.prompt);
  res.send(response);
});

app.get('/get-headings', async function(req, res){
  const response = await getGPT_Heading_Sub(req.query.prompt);
  res.send(response);
});

app.get('/get-dfsResults', async function(req, res) {
  if(req.query.prompt && req.query.prompt.length > 0)
  {
    const tmp = req.query.prompt.toLocaleLowerCase();
    if(tmp.includes("progress") && tmp.includes("india") && tmp.includes("growth") && tmp.includes("development"))
    {
      console.log("Cached value used for anaylse");
      res.send(GetProgressSuggestion());
      return;
    }

    if(tmp.includes("top") && tmp.includes("places") && tmp.includes("food"))
    {
      console.log("Cached value used for anaylse");
      res.send(GetTrivialSuggestion());
      return;
    }

    if (cache.has(req.query.prompt) && cacheTimeMap.has(req.query.prompt)) {
      const lastCallTime = cacheTimeMap.get(req.query.prompt);
      if (((new Date().getTime() - lastCallTime.getTime()) / 1000) < 18000) {
        console.log("Cached value used", new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Kolkata'})));
        const responses = cache.get(req.query.prompt);
        cacheTimeMap.set(req.query.prompt, new Date());
        res.send(responses);
        return;
      }
    }

    try {
      var resDalle = [];
      var resHeadings = [];
      var responses = [];
      if(tmp.includes("top") || tmp.includes("best") || tmp.includes("places") || tmp.includes("visit") || tmp.includes("trends"))
      {
        console.log("trival");
        responses = await get_GPT_trivial(req.query.prompt);
      }
      else{
        resDalle = getMultiDallePrompt(req.query.prompt);
        resHeadings = getGPT_Heading_Sub(req.query.prompt);
        const resp = await Promise.all([resDalle, resHeadings]);
        resp[1].forEach((headings, index) => {
          responses.push([...headings, resp[0][index]]);
        })
      }

      cache.set(req.query.prompt, responses);
      cacheTimeMap.set(req.query.prompt, new Date());
      res.send(responses);
    } catch (err) {
      console.log("Error with req", req, err);
      res.send(["Error encountered."]);
    }
  }
  else
  {
    res.send(["prompt incorrect."])
  }
});

app.get('/runGPT', async function(req, res){
  const response = await testPrompts(req.query.prompt);
  res.send(response);
});

app.get('/runGPT2', async function(req, res){
  const response = await testPrompts2(req.query.prompt);
  res.send(response);
});

app.listen(port, () => {
  console.log(`Chat GPT bot listening on port ${port}`)
});


export const restartSession = async (api) => {
  if (api) {
      await (api).closeSession();
  }
  return authenticateUser();
}