export const ParseGPTResponse = (response) => {
    let SplitResponse = response.split('$$');
    let dfsResults = [];

    SplitResponse.forEach(function (res , index) {
    if (res && res.trim()) {
        const splitRes = res.split('#');
        var caption = '';
        var quote = '';
        var dprompt = '';
        
        splitRes.forEach(function (item, index) {
            if (item && item.trim()) {
            //First condition to check if string is not empty
            //Second condition checks if string contains just whitespace
                if(item.includes("Caption: \""))
                {
                    caption = item.slice(10, item.length-1);
                }
                else if(item.includes("Quote: \""))
                {
                    quote = item.slice(8, item.length);
                }
                else if(item.includes("Dalle: \""))
                {
                    dprompt = item.slice(8, item.length-1);
                }
            }
        })
        
        const suggestion = [caption, quote, dprompt];
        dfsResults.push(suggestion);
    }
    });

    return dfsResults;
}

export const ParseResponse = (response) => {
    let SplitResponse = response.split('$$');
    let dfsResults = [];

    SplitResponse.forEach(function (res , index) {
    if (res && res.trim()) {
        const splitRes = res.split('#');
        var caption = '';
        var quote = '';
        var dprompt = '';
        
        splitRes.forEach(function (item, index) {
            if (item && item.trim()) {
            //First condition to check if string is not empty
            //Second condition checks if string contains just whitespace
                if(item.includes("Caption: \""))
                {
                    caption = item.slice(10, item.length-1);
                }
                else if(item.includes("Quote: \""))
                {
                    quote = item.slice(8, item.length);
                }
                else if(item.includes("Dalle: \""))
                {
                    dprompt = item.slice(8, item.length-1);
                }
            }
        })
        
        const suggestion = [caption, quote, dprompt];
        dfsResults.push(suggestion);
    }
    });

    return dfsResults;
}

export const ParseChatGPTResponse = (res) => {
    const SplitResponse = res.response.split('\n');
    let dfsResults = [];
        
    var caption = '';
    var quote = '';
    var dprompt = '';

    SplitResponse.forEach(function (item, index) {
        if((index)%3==0)
        {
            caption = '';
            quote = '';
            dprompt = '';   
        }
        
        if (item && item.trim()) {
            if(item.includes("\" - Caption"))
            {
                caption = item.slice(1, item.length-11);
            }
            else if(item.includes(" - Quote"))
            {
                quote = item.slice(1, item.length-8);
            }
            else if(item.includes("\" - DALL-E Prompt"))
            {
                dprompt = item.slice(1, item.length-18);
            }
        }

        if((index+1)%3==0)
        {
            const suggestion = [caption, quote, dprompt];
            dfsResults.push(suggestion);   
        }
    });

    return dfsResults;
}

export const splitCaption_Quote = (res) => {
    let captions = [];

    res.forEach(function (item, index) {
        if (item && item.length && item.length > 0 && item.trim()) {
            var caption = '';
            var quote = '';

            const splitRes =  item.split('Quote: ');
            splitRes.forEach(function (temp, index) {
                if(temp.includes("Caption: "))
                {
                    caption = temp.slice(10, temp.length-2);
                }
                else
                {
                    quote = temp.slice(0, temp.length);
                }
                
            })

            const suggestion = [caption, quote];
            captions.push(suggestion);
        }

    });

    return captions;
}

export const split_trivial_response = (res) => {
    var captions = [];
    res.forEach(function (item, index) {
        if (item && item.length && item.length > 0 && item.trim()) {
            var heading = '';
            var subheading = '';
            var dalle = '';

            const splitHeading =  item.split(' About: ');
            const splitSubheading = splitHeading[1].split(' Dalle: ')
            if(splitHeading[0].includes('Heading'))
            {
                heading = splitHeading[0].slice(12, splitHeading[0].length);
            }
            if(splitSubheading[0].length>0)
            {
                subheading = splitSubheading[0].slice(0, splitSubheading[0].length);
            }
            if(splitSubheading[1].length>0)
            {
                dalle = splitSubheading[1].slice(0, splitSubheading[1].length);
            }

            const suggestion = [heading, subheading, dalle];
            captions.push(suggestion);
        }

    });
    return captions;
}

export const genericPrompt = (payload) => {
    const gptprompt = `Generate design suggestions for the following query with following instructions:
* Design suggestions has two scenarios: {Single Page Suggestion, Multi Page Suggestion}. 
* Each scenario of design suggestion contains: {Design Inputs}
* Single Page Suggestion contains only fixed set of inputs: {Heading, Subheading, Visuals, Page Inputs}. Single page suggestion has only 1 page.
* Multi Page Suggestion has [n] number of pages. Each page consists: {Heading, Subheading, Visuals, Page Inputs}. Max page limit is 5. 
* Multi Page Suggestion consists: {Cover Page, Page 1,  ... , Page n, Conclusion}. Create a presentation slide deck for a multi Page Suggestion which should be ordered.
* Important - Don't repeat {Heading, Subheading, Visuals} at any page level.
* Page Inputs required at every page. Page inputs: {Visuals Count, Is Background, Is Video}. Keep every input in new line.
* Visuals Count depends if Design requires heading and Subheading with images. Keep Visual Counts limit from 1 to 3. Min Visual Count value is 1. Keep Visual Count lower.
* Is Background defines image should be at background.  Brand post values: {Yes, No}. Is Background default value as No if image is not required in background.
* Is Video defines video will be used over images for design.  Brand post values: {Yes, No}. Is Video default value as No if image is better than video for design.
* Design Inputs are common for all scenario of design suggestion.  Design Inputs are required for creation of designs.  Design inputs: {Colors, Style, Brand post, Design type, Suggested Design Size}. Design Inputs generated separately. Keep every input in new line.
* Colors defines theme of the design. Keep Colors as None if no particular recommendation.
* Style defines style of the design. Keep Style as None if no particular recommendation.
* Brand post defines the design is for brand. Brand post values: {Yes, No}. Keep Brand post as NO if design is not for brand.
* Design type defines the design is aiming to particular social media platform. Design type decided by {Query}. Design type values: {Instagram, Facebook Cover, LinkedIn Post, None}. Keep Design type as None if design is not specific to a platform.
* Valid Suggested Design Size: {Square, Landscape, Portrait, None}. Wide designs should map to Landscape, and Tall designs should map to Portrait.
* Try to infer Suggested Design Size if enough information.
* Important - Always generate non-empty Heading, Subheading, and Visuals for any query.

###

Query: "" Opening of new restaurant with a background of dishes of food ""
Scenario: Single Page Suggestion
Heading: Grand opening of new restaurant in town!
Subheading: Enjoy the sumptuous food!
Visuals: dishes of food
Page Inputs: 
Visuals count: 1
Is Background: Yes
Is Video: No

Design Inputs: 
Colors: None
Style: None
Brand post: No
Design type: None
Suggested Design Size: Square

Scenario: Multi Page Suggestion
Cover Page:
Heading: Welcome to our new restaurant 
Subheading: None
Visuals: Waiter standing in front of restaurant
Page Inputs: 
Visuals Count: 1 
Is Background: Yes 
Is Video: No
Page 1:
Heading: Enjoy a delicious dining experience 
Subheading: Explore our menu of tasty dishes 
Visuals: Food platters 
Page Inputs: 
Visuals Count: 2 
Is Background: No 
Is Video: No
Page 2: 
Heading: Experience our exquisite cuisine 
Subheading: Try out our variety of dishes 
Visuals: Chef food preparation 
Page Inputs: 
Visuals Count: 2 
Is Background: No 
Is Video: No 
Page 3: 
Heading: Discover new flavors 
Subheading: Taste the unique dishes of our restaurant 
Visuals: Waiter serving specialty dishes 
Page Inputs: 
Visuals Count: 2 
Is Background: No 
Is Video: No 
Conclusion: 
Heading: Join us at our new restaurant 
Subheading: Indulge in our unique flavors 
Visuals: Customers dinning at Restaurant
Page Inputs: 
Visuals Count: 1 
Is Background: No 
Is Video: No

Design Inputs: 
Colors: None 
Style: None 
Brand post: No 
Design type: None
Suggested Design Size: Square

Query: "" `+ payload +` ""`;
return gptprompt;
}