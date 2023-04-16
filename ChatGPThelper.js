// import { oraPromise } from 'ora';
// import { ChatGPTAPIBrowser } from 'chatgpt';
// import { API_username, API_password, API_max_array_size } from "./constants.js"
// import { ParseChatGPTResponse } from './helper.js'

// export const authenticateUser = async () => {
//     const email = API_username;
//     const password = API_password;
//     const api = new ChatGPTAPIBrowser({
//         email,
//         password,
//         debug: false,
//         minimize: true,
//         isGoogleLogin: true
//     })
//     await api.initSession()
//     return api;
// }

// export const getResponse = async (api, prompt, dalle) => {
//     var chatGPTPrompt = prompt;
//     if( dalle ){
//         chatGPTPrompt = "Generate a modern art style DALL-E prompt for " + 
//             prompt + " without words in image in 20 words";
//     }
//     else{
//         chatGPTPrompt = "Write " + API_max_array_size +  " quotes with author for " + 
//             prompt + " in 30 words"
//     }

//     const res = await oraPromise((api).sendMessage(chatGPTPrompt), {
//         text: chatGPTPrompt
//     })
//     console.log("chatgpt");
//     return res;
// }

// export const getChatGPT_DFSResponse = async (api, prompt) => {
//     const chatGPTPrompt = `We want create amazing posters and covers. For creating an amazing design, we need a good heading, quote and contextual image. We are planning to use DALL-E for image generation and Open AI for DALL-E prompts. That's why, we plan to use Open AI to generate great captains, quotes and DALL-E prompts for designs.

// Q: Write a set of 5 of caption in less than 5 words, quote with author name in less than 20 words and modern art style DALL-E prompt without message in 20 words for smart cities in india?
// A: "Innovative Cities" - Caption
// "The only limit to our realization of tomorrow will be our doubts of today." - Franklin D. Roosevelt - Quote
// "A futuristic cityscape featuring advanced technology and sleek design" - DALL-E Prompt
// "Smart Solutions" - Caption
// "The city is not a concrete jungle, it is a human zoo." - Desmond Morris - Quote
// "A dynamic visual representation of a modern and technologically advanced city." - DALL-E Prompt
// "Urban Progress" - Caption
// "The city is the place of accommodation where all races and all nations come together." - Jacob Riis - Quote
// Dalle: "A vibrant depiction of a diverse and thriving city, featuring towering skyscrapers and advanced infrastructure." - DALL-E Prompt
// "City of the Future" - Caption
// "Cities are the greatest creations of humanity." - Daniel Libeskind - Quote
// "A sleek and modern cityscape, showcasing advanced technology and innovative design." - DALL-E Prompt
// "Tech-Forward Cities" - Caption
// "The city is the place of accommodation where all races and all nations come together." - Jacob Riis - Quote
// "A futuristic cityscape featuring advanced technology and sleek design, showcasing the potential of urban innovation." - DALL-E Prompt

// Q: Write a set of 5 of caption in less than 5 words, quote with author name in less than 20 words and modern art style DALL-E prompt without message in 20 words for save our planet from global warming?
// A: "Save Our Planet" - Caption
// "The Earth is a fine place and worth fighting for." - Ernest Hemingway - Quote
// "A powerful visual depiction of the Earth, surrounded by swirling clouds of greenhouse gases." - DALL-E Prompt
// "Unite for the Earth" - Caption
// "The only way forward, if we are going to improve the quality of the environment, is to get everybody involved." - Richard Rogers - Quote
// "A vibrant and inclusive depiction of people from all walks of life coming together to protect the planet." - DALL-E Prompt
// "Protect Our Home" - Caption
// "The Earth is not just a place we live, it is a living being." - David Suzuki - Quote
// "A serene and peaceful depiction of nature, with animals and plants thriving in a healthy ecosystem." - DALL-E Prompt
// "Time to Act" - Caption
// "We must act as if we are the custodians, not the owners, of the planet." - James Lovelock - Quote
// "A dynamic visual representation of climate change, with melting ice caps and rising sea levels." - DALL-E Prompt
// "Save the Earth" - Caption
// "The Earth is what we all have in common." - Wendell Berry - Quote
// "A beautiful and inspiring image of the planet, surrounded by stars and galaxies, reminding us of our place in the universe." - DALL-E Prompt
    
// Q: Write a set of `+ API_max_array_size +` of caption in less than 5 words, quote with author name in less than 20 words and modern art style DALL-E prompt without message in 20 words for ` + prompt + ` ?
// A:`;

//     const res = await oraPromise((api).sendMessage(chatGPTPrompt), {
//         text: chatGPTPrompt
//     })
//     const dfsResults = ParseChatGPTResponse(res);
//     console.log("chatgpt");
//     return dfsResults;
// }

// export const restartSession = async (api) => {
//     if (api) {
//         await (api).closeSession();
//     }
//     return authenticateUser();
// }