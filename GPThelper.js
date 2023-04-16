import { API_KEY, API_Path, API_max_array_size } from "./constants.js";
import { Configuration, OpenAIApi } from "openai";
import { ParseGPTResponse, splitCaption_Quote, split_trivial_response, genericPrompt } from './helper.js'

export const getResults = async(payload, dalle, engineName="text-davinci-002") => {
    const configuration = new Configuration({
        apiKey: API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    var gptprompt = payload;
    if( dalle ){
        gptprompt = `We want create amazing images using DALL-E, but it requires good prompts for better results. That's why we plan to use Open AI to generate DALL-E prompts. 
Q:Write a modern art style DALL-E prompt for design an assignment cover for smart cities in India in 20 words without message?
A:A futuristic smart city in India, featuring towering skyscrapers, sleek flying vehicles, and vibrant neon lights
Q:Write a modern art style DALL-E prompt for create a poster to motivate people to invent in 20 words without message?
A:An inspirational scene of a scientist surrounded by a flurry of ideas and inventions, inspiring others to create and innovate.
Q:Write a modern art style DALL-E prompt for create a project cover for sustainable city and environment welfare in 20 words without message?
A:A vibrant cityscape with green parks and clean energy sources, illustrating a sustainable future for urban environments.
Q:Write a modern art style DALL-E prompt for create a project cover for save the environment in 20 words without message?
A:A stunning visual depiction of the natural world, with intricate details and vibrant colors, evoking a sense of wonder and the need to protect our planet.
Q:Write a modern art style DALL-E prompt for create a design for save planet with less plastic waste in 20 words without message?
A:A futuristic vision of a world free of plastic waste, featuring clean energy sources, recycled materials, and eco-friendly technologies.
Q:Generate a modern art style DALL-E prompt for` + payload + ` in 20 words?
A:`;
    }
    else{
        gptprompt = `We want create amazing quotes for posters and designs. That's why, we plan to use Open AI to generate great quotes for posts. 
Q: Write 5 quotes with author for create a poster to motivate people to invent in 20 words?
A:"I have not failed. I've just found 10,000 ways that won't work." -  Thomas Edison
"The only limit to our realization of tomorrow will be our doubts of today." - Franklin D. Roosevelt
"An inventor is simply a person who doesn't take his education too seriously." - Charles Kettering
"I find out what the world needs, then I proceed to invent." - Thomas Edison
"The thing that is really hard, and really amazing, is giving up on being perfect and beginning the work of becoming yourself." - Anna Quindlen
        
Q: Write 5 quotes with author for create a project cover for sustainable city and environment welfare in 20 words?
A:"It is not enough to tackle climate change. We must also fight the inequalities and injustice it aggravates." - Ban Ki-moon
"We are not just custodians of the environment, we are its beneficiaries." - Ernesto Zedillo
"We must protect the forests for our children, grandchildren and children yet to be born." - Wangari Maathai
"There is no such thing as 'away'. When we throw anything away it must go somewhere." - Annie Leonard
"Our planet is in danger. If we don't change our ways, future generations will suffer the consequences." - David Attenborough

Q: Write 5 quotes with author for create a project cover for save the environment in 20 words?
A:"The environment is where we all meet; where all have a mutual interest; it is the one thing all of us share." - Lady Bird Johnson
"The environment is not something we inherit from our ancestors, it is something we borrow from our children." - David Suzuki
"If we don't save the environment now, our children and grandchildren will suffer the consequences." - Al Gore
"The greatest threat to our planet is the belief that someone else will save it." - Robert Swan
"We are the custodians of the environment and it is our responsibility to protect it." - Sir David Attenborough

Q: Write 5 quotes with author for a project cover for smart city in India in 20 words?
A:"Smart cities are the future of India." - Narendra Modi
"India is the perfect example of a country that is embracing the future through smart cities." - Masayoshi Son 
"Smart cities are the answer to India's growing urban population." - Amitabh Kant
"Innovative technology can be used to make India's cities smarter and more livable." - Ratan Tata
"The future of India lies in the development of its smart cities." - Kailash Gahlot

Q: Write 5 quotes with author for save planet from plastic waste in 20 words?
A:"We must all do our part to reduce plastic use and save our planet." - Leonardo DiCaprio
"The greatest threat to our planet is the belief that someone else will save it." - Robert Swan
"Every time you reduce, reuse and recycle, you're helping to save the environment." - David Suzuki
"The best way to reduce plastic waste is to refuse it in the first place." - Erin Rhoads
"A single person can make a difference in protecting our planet from plastic pollution." - Jane Goodall

Q: Write 5 quotes with author for` + payload + ` in 20 words?
A:`;
    }

    const res = await openai.createCompletion({
                model: engineName,
                prompt: gptprompt,
                temperature: 0.7,
                max_tokens: 256,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                });
 
    let strings = res.data.choices[0].text.split('\n');
    strings = strings.filter((str) => {
        return str.length > API_max_array_size;
    })
    return strings;
}

export const getGPT_DFSResults = async(payload, engineName="text-davinci-00") => {
    const configuration = new Configuration({
        apiKey: API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const gptprompt = `We want create amazing posters and covers. For creating an amazing design, we need a good heading, quote and contextual image. We are planning to use DALL-E for image generation and Open AI for DALL-E prompts. That's why, we plan to use Open AI to generate great captains, quotes and DALL-E prompts for designs.

Q: Write a set of 5 of caption in less than 5 words, quote with author name in less than 20 words and modern art style DALL-E prompt without message in 20 words for smart cities in india?
A: $$: Caption: "Innovative Cities"# Quote: "The only limit to our realization of tomorrow will be our doubts of today." - Franklin D. Roosevelt# Dalle: "A futuristic cityscape featuring advanced technology and sleek design"#
$$: Caption: "Smart Solutions"# Quote: "The city is not a concrete jungle, it is a human zoo." - Desmond Morris# Dalle: "A dynamic visual representation of a modern and technologically advanced city."#
$$: Caption: "Urban Progress"# Quote: "The city is the place of accommodation where all races and all nations come together." - Jacob Riis# Dalle: "A vibrant depiction of a diverse and thriving city, featuring towering skyscrapers and advanced infrastructure."#
$$: Caption: "City of the Future"# Quote: "Cities are the greatest creations of humanity." - Daniel Libeskind# Dalle: "A sleek and modern cityscape, showcasing advanced technology and innovative design."#
$$: Caption: "Tech-Forward Cities"# Quote: "The city is the place of accommodation where all races and all nations come together." - Jacob Riis# Dalle: "A futuristic cityscape featuring advanced technology and sleek design, showcasing the potential of urban innovation."#

Q: Write a set of `+ API_max_array_size +` of caption in less than 5 words, quote with author name in less than 20 words and modern art style DALL-E prompt without message in 20 words for ` + payload + ` ?
A: `;

    const res = await openai.createCompletion({
        model: engineName,
        prompt: gptprompt,
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        });

    let response = res.data.choices[0].text;
    const dfsResults = ParseGPTResponse(response);
    return dfsResults;
}

export const getMultiDallePrompt = async(payload, engineName="text-davinci-002") => {
    const configuration = new Configuration({
        apiKey: API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const gptprompt = `We want create amazing posters and covers. For creating an amazing design, we need a good heading, quote and contextual image. We are planning to use DALL-E for image generation and Open AI for DALL-E prompts. That's why, we plan to use Open AI to generate great captains, quotes and DALL-E prompts for designs.

Q: Write a set of 8 modern art style DALL-E prompt for smart cities in India in 20 words without message?
A:A sleek and modern cityscape, with towering skyscrapers and advanced technology, representing the progress and innovation of Indian smart cities.
A futuristic cityscape featuring advanced technology and sleek design, showcasing the potential of urban innovation in India.
A modern art painting of an Indian city of the future with green infrastructure.
A watercolor modern style cityscape of a smart Indian city using modern art techniques and styles.
A digital illustration of an Indian smart city, with a sleek and futuristic design and advanced technology.
An abstract art piece featuring a cityscape of an Indian smart city, with vibrant colors and bold lines representing the innovation and progress.
A surrealist depiction of an Indian smart city with advanced technology and eco-friendly infrastructure.
A modern art style photograph of an Indian smart city at night, showcasing its vibrant and innovative skyline.

Q: Write a set of 4 modern art style DALL-E prompt for analyse the progress made by India on growth and development fronts since Independence in 20 words without message?
A:A sleek and modern cityscape, showcasing India's growth and development over time, with vibrant and modern details showcasing the country's progress.
A futuristic cityspace of India's development, with bright, bold colors and intricate details.
A modern art painting of an Indian city showcasing the impressive infrastructure of India, featuring modern highways, skyscrapers, and transportation systems.
A watercolor modern style cityscape depicting of an entrepreneur in India standing in front of a skyscraper, symbolizing the growth and success of their business.

Q: Write a set of 4 modern art style DALL-E prompt for ` + payload + ` in 20 words without message?
A:`;

    var retryCount = 0;
    while (retryCount < 5) {
        const res = await openai.createCompletion({
            model: engineName,
            prompt: gptprompt,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            });

        let response = res.data.choices[0].text.split('\n');
        const dallePrompts = [];
        response.forEach(function (item, index) {
            if (item && item.trim()) {
                dallePrompts.push(item);
            }
        });
        if (dallePrompts.length == 4) {
            return dallePrompts;
        }
        console.log("Retry since", dallePrompts);
        retryCount += 1;
    }
    return dallePrompts;
}

export const getGPT_Heading_Sub = async(payload, engineName="text-davinci-002") => {
    const configuration = new Configuration({
        apiKey: API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const gptprompt = `We want create amazing posters and covers. For creating an amazing design, we need a good titles and quotes. That's why, we plan to use Open AI to generate great titles and quotes.

Q: Write a set of 4 of caption and quote with author name in less than 15 words for Analyse the progress made by India on smart city fronts since Independence?
A:Caption: "India's Infrastructure Boom: Building the Foundations for a Stronger Economy" Quote: "Industry is the very foundation of the country's prosperity and progress." - Mahatma Gandhi"
Caption: "India's Industrial Revolution: A Look at the Country's Rapid Economic Growth", Quote: "We are committed to developing infrastructure that will drive the growth of our economy. - Arjun Jaitley
Caption: "Sparking Creativity and Innovation: Strategies for Fostering a Culture of Innovation" Quote: "We must foster innovation and create an environment where ideas can be nurtured." - Pranab Mukherjee
Caption: "Boosting India's Economic Development: A Look at Recent Growth Trends" Quote: "We have a long way to go before we can say that we have reached our destination, but we are on the right track." - Jawaharlal Nehru

Q: Write a set of 2 of caption and quote with author name in less than 15 words for save our planet from global warming?
A:Caption: "Unite for the Earth and Environment" Quote: "The Earth is what we all have in common." - Wendell Berry
Caption: "Protect Our Home for our children!!" Quote: "The Earth is not just a place we live, it is a living being." - David Suzuki

Q: Write a set of 4 of caption and quote with author name in less than 15 words for ` + payload + ` ?
A:`;

    let retryCount = 0;
    while (retryCount < 5) {
        const finalResponse = [];
        const res = await openai.createCompletion({
            model: engineName,
            prompt: gptprompt,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            });
    
        let response = res.data.choices[0].text.split('\n');
        const titles = splitCaption_Quote(response);
        titles.forEach((title) => {
            if (title && title.length == 2 && title[0].length > 0 && title[1].length > 0) {
                finalResponse.push(title);
            }
        })

        if (finalResponse.length > 0) {
            return finalResponse;
        }
        console.log("Retry since", titles);
        retryCount += 1;
    }
    return ["Error occured, try again"];
}

export const get_GPT_trivial = async(payload, engineName="text-davinci-002") => {
    const configuration = new Configuration({
        apiKey: API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const gptprompt = `We want create amazing posters and designs for social media, assignments, commerical use etc. For creating such a amazing design, we need a good heading, relevant sub-heading which can be about the heading in case of trival questions and also, a contextual image . For contextual images, we are planning to use DALL-E for image generation and Open AI to generate DALL-E image prompts. These prompts must be relevant to the heading, subheading and should have variety of styles with popular ones. DALL-E image prompts must not generate image with text on them.

Q: Write a set of 2 heading, subheading in less than 20 words and popular style DALL-E prompt showing no text on generated images in 20 words for top places for food in Kanpur?
A: 1. Heading: Tunday Kababi About: Taste the famous tangri kebab and the legendary galawati kebab here. Dalle: "A vibrant visual representation of a classic kebab joint, featuring traditional Indian cuisine."
2. Heading: Maalviya Sweets About: Enjoy the delicious sweet delights here, such as milk cake, malai laddu and kalakand. Dalle: "A captivating image of a traditional sweet shop, showcasing the vibrant culture of Kanpur."

Q: Write a set of 2 heading, subheading in less than 20 words and popular style DALL-E prompt showing no text on generated images in 20 words for top beaches to visit goa?
A: 1. Heading: Baga Beach About: Experience the vibrant sunset and the beautiful beach shacks here. Dalle: "An awe-inspiring visual of a golden beach with a stunning sunset, capturing the breathtaking beauty of Goa's coast."
2. Heading: Palolem Beach About: Enjoy the serenity of this picturesque beach, with its golden sand and turquoise waters. Dalle: "A mesmerizing image of a tranquil beach, showcasing the stunning beauty of Palolem's coast."

Q: Write a set of 4 heading, subheading in less than 20 words and popular style DALL-E prompt showing no text on generated images in 20 words for` + payload + `?
A: `;

    let retryCount = 0;
    while (retryCount < 5) {
        const res = await openai.createCompletion({
            model: engineName,
            prompt: gptprompt,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            });
    
        let response = res.data.choices[0].text.split('\n');
        const finalResponse = split_trivial_response(response);

        if (finalResponse.length > 0) {
            return finalResponse;
        }

        console.log("Retry since", finalResponse);
        retryCount += 1;
    }
    return ["Error occured, try again"];
}

export const GetProgressSuggestion = () => {
    const dfs_suggestions = [
        [
            "India's Infrastructure Boom: Building the Foundations for a Stronger Economy",
            "\"Industry is the very foundation of the country's prosperity and progress.\" - Mahatma Gandhi",
            "A oil painting of a cityscape of a worker in an Indian factory during the Industrial Revolution.",
            "A oil painting of a group of indian worker working on products in factories with yellow hats"
        ]
    ]

    let randomNo = Math.floor((Math.random() * 10) + 1);
    var index = randomNo - 1;
    const res = [];
    while (res.length < 4) {
        if(index == dfs_suggestions.length || index< 0)
        {
            index = 0;
        }
        res.push(dfs_suggestions[index]);
        index++;
    }

    return res;
}



export const GetTrivialSuggestion = () => {
    const dfs_suggestions = [
        [
            "Tunday Kababi",
            "Taste the famous tangri kebab and the legendary galawati kebab here.",
            "A vibrant visual representation of a classic kebab joint, featuring traditional Indian cuisine."
        ]
    ]

    let randomNo = Math.floor((Math.random() * 10) + 1);
    var index = randomNo - 1;
    const res = [];
    while (res.length < 4) {
        if(index == dfs_suggestions.length || index< 0)
        {
            index = 0;
        }
        res.push(dfs_suggestions[index]);
        index++;
    }

    return res;
}

export const testPrompts = async(payload, engineName="text-davinci-002") => {
    const configuration = new Configuration({
        apiKey: API_KEY
    });
    const openai = new OpenAIApi(configuration);
    const gptprompt = genericPrompt(payload);

    const res = await openai.createCompletion({
        model: engineName,
        prompt: gptprompt,
        temperature: 0.0,
        max_tokens: 1028,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        });

    let response = res.data.choices[0].text.split('\n');
    const finalResponse = [];
    response.forEach(function (item, index) {
        if (item && item.length && item.length > 0 && item.trim()) {
            finalResponse.push(item);
        }
    });
    var combinedResponse = "";
    finalResponse.forEach(function (item, index) {
        if(item.includes("Scenario: Multi Page Suggestion"))
        {
            combinedResponse += '\n';
        }
        combinedResponse += item;
        combinedResponse += '\n';

        if(item.includes("Is Video:"))
        {
            combinedResponse += '\n';
        }
    });
    return combinedResponse;
}

export const testPrompts2 = async(payload, engineName="text-davinci-003") => {
    const configuration = new Configuration({
        apiKey: API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const gptprompt = genericPrompt(payload);

    const res = await openai.createCompletion({
        model: engineName,
        prompt: gptprompt,
        temperature: 0.0,
        max_tokens: 1028,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        });

    let response = res.data.choices[0].text.split('\n');
    const finalResponse = [];
    response.forEach(function (item, index) {
        if (item && item.length && item.length > 0 && item.trim()) {
            finalResponse.push(item);
        }
    });

    var combinedResponse = "";
    finalResponse.forEach(function (item, index) {
        if(item.includes("Scenario: Multi Page Suggestion"))
        {
            combinedResponse += '\n';
        }
        combinedResponse += item;
        combinedResponse += '\n';

        if(item.includes("Is Video:"))
        {
            combinedResponse += '\n';
        }
    });
    return combinedResponse;
}