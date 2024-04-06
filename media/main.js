console.log('script loaded successfully')
hljs.initHighlightingOnLoad();
// hljs.addPlugin(new CopyButtonPlugin());

const resetButton = document.getElementById('reset-button');
const defaultContent = document.getElementById('default-content')
const chats = document.querySelector('.chats')
const form = document.querySelector('.searhbar');
const textarea = document.getElementById('textarea');
const loader = document.getElementById('loader');

const vscode = acquireVsCodeApi();
let userIconURI = "";
let mainIconURI = "";
let companyLogoURI = "";


function getUserCard(prompt){
    return `
    <div class="user chat px-4 py-4 mb-4 rounded-md" style="background: linear-gradient(90deg, #4f4966, #3a3451);">
        <div class="flex">
            <img class="rounded" src="${userIconURI}" style="width: 30px;height: 30px;" />
            <p class="text-gray-200 ml-2 text-lg">You</p>
        </div>
        <div class="prompt text-white font-normal mt-2 ">
            ${prompt}
        </div>
    </div>
    `
}

let id = 0;
let cache = {}
let scrollInterval = null;
let currentTypeWriter = null;

function handleCopy(currId){
    vscode.postMessage({
        command: "COPY_CLIPBOARD",
        message: cache[currId]
    })
}

function getAssistandCard(prompt){

    const renderer = new marked.Renderer();
        renderer.code = (code, language) => {

        cache[id] = code;
        return `
        <pre style="position:relative">
            <button class="bg-white text-black text-xs rounded-md p-1" style="position:absolute; top:0px; right: 10px" onClick="handleCopy(${id++})")>Copy</button>
            <code class="hljs ${language}">${hljs.highlightAuto(code).value}
            </code>
        </pre>`;
    };

    const newMarked = new marked.Marked({ renderer });


    // Create the main div element
    var mainDiv = document.createElement("div");
    mainDiv.classList.add("assistant", "chat", "px-4", "py-4", "mb-4", "rounded-md");
    mainDiv.style.backgroundColor = "#3c3c3c";

    // Create the inner div for the flex layout
    var flexDiv = document.createElement("div");
    flexDiv.classList.add("flex");
    flexDiv.classList.add("items-center");

    // Create the image element
    var img = document.createElement("img");
    img.classList.add("rounded");
    img.src = mainIconURI;
    img.style.width = "30px";
    img.style.height = "30px";

    // Create the paragraph element
    // var paragraph = document.createElement("p");
    // paragraph.classList.add("text-gray-200", "ml-2", "text-lg");
    // paragraph.textContent = "monkeyteam.io";

    //create the image element
    var img2 = document.createElement("img");
    img2.classList.add("rounded");
    img2.src = companyLogoURI;
    img2.style.width = "40%";
    img2.style.marginLeft = "8px";

    // Append the image and paragraph elements to the flex div
    flexDiv.appendChild(img);
    flexDiv.appendChild(img2);

    // Create the prompt div
    var promptDiv = document.createElement("div");
    promptDiv.classList.add("prompt", "text-white", "font-normal", "mt-2");

    // Append the flex div and prompt div to the main div
    mainDiv.appendChild(flexDiv);
    mainDiv.appendChild(promptDiv);

    // Append the main div to the document body or any other desired parent element
    // document.body.appendChild(mainDiv);
    chats.appendChild(mainDiv);

    const markedParsedString = newMarked.parse(prompt);

    var typewriter = new Typewriter(promptDiv, {
        loop: false,
        delay: 0, // Adjust the typing speed here
        cursor: ""
    });

    // typewriter.options.speed = 1;

    currentTypeWriter = typewriter;
    typewriter
        .typeString(markedParsedString)
        .start();


    
    if(scrollInterval != null) return;

    // Get the last height of the page
    var lastHeight = document.body.scrollHeight;

    // Function to scroll to the bottom of the page
    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Check if the current height is greater than the last height
    function checkScroll() {
        var currentHeight = document.body.scrollHeight;

        console.log("scroll",lastHeight,currentHeight);
        if (currentHeight > lastHeight) {
            scrollToBottom();
            lastHeight = currentHeight;
        }
    }

    // Set an interval to check for page height changes
    scrollInterval = setInterval(checkScroll, 200); // Adjust the interval as needed

    // return `
    // <div class="assistant chat px-4 py-4 mb-4 rounded-md" style="background-color: #3c3c3c;">
    //     <div class="flex">
    //         <img class="rounded" src="${mainIconURI}" style="width: 30px;height: 30px;" />
    //         <p class="text-gray-200 ml-2 text-lg">monkeyteam.io</p>
    //     </div>
    //     <div class="prompt text-white font-normal mt-2">
    //         ${newMarked.parse(prompt)}
    //     </div>
    // </div>
    // `
}

function strcuturePrompt(prompt){

	const promptStructure = `
    User Query: Capture the user's code-related question or query in a friendly and approachable manner, acknowledging any potential confusion or uncertainty and try to always give a code example.

    Explanation: Provide a warm and encouraging explanation of the concept or problem addressed by the user's query, using relatable analogies or everyday examples to aid understanding. Ensure simplicity and clarity in the explanation, addressing any potential beginner-level confusion.
    
    Code Snippet: Present a well-formatted and commented code snippet that demonstrates a solution to the problem or addresses the user's query. Use friendly comments and language to guide the user through the code, highlighting key steps and concepts.
    
    Example Usage: Illustrate how the provided code snippet can be used in a practical context using relatable scenarios or everyday situations. Provide sample input data or scenarios and the corresponding output generated by the code, reinforcing understanding through real-world application.
    
    Example Prompt for CodeBot Response with Friendly and Easy-to-Understand Explanations:

    **User Query**: How can I sort a list of strings alphabetically in Python?

    Sure thing! Sorting a list of strings alphabetically in Python is super easy. You can use either the \`sorted()\` function or the \`sort()\` method. These handy tools arrange your list in alphabetical order, just like organizing your books from A to Z!
    
    \`\`\`python
    # Let's sort a list of strings alphabetically
    # Method 1: Using sorted() function
    original_list = ["banana", "apple", "grape", "orange"]
    sorted_list = sorted(original_list)
    print("Sorted list using sorted():", sorted_list)
    
    # Method 2: Using sort() method
    original_list.sort()
    print("Sorted list using sort():", original_list)
    \`\`\`
    
    **Example Usage**: 
    
    Awesome! How can I use this code to sort a list of names?
    
    Easy peasy! Just swap out the \`original_list\` with your list of names and run the code. Here's a quick example:
    
    \`\`\`python
    names = ["Emma", "Liam", "Olivia", "Noah", "Ava"]
    names.sort()
    print("Sorted list of names:", names)
    \`\`\`
    
    **User Query**: ${prompt}
    `

	return promptStructure;
}

function cardFactory(message){
    if(message.role == "user"){
        return getUserCard(message.content)
    }
    else if(message.role == "assistant"){
        return getAssistandCard(message.content)
    }
    else {
        return getAssistandCard(message.content)
    }
}

function insertToUI(view){
    chats.innerHTML += view;
}

resetButton.addEventListener('click',(e)=>{
    e.preventDefault();

    clearInterval(scrollInterval);
    scrollInterval = null;

    if(currentTypeWriter) currentTypeWriter.stop();

    document.documentElement.scrollTop = 0;

    defaultContent.style.display = "block";
    chats.style.display = "none";

    // clear all the chats
    chats.innerHTML = "";

    console.log('reset button clicked');
})


textarea.addEventListener('keydown',(e) => {
    if(e.keyCode == 13 && !e.shiftKey){
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
})

vscode.postMessage({
    command: "INIT"
})

form.addEventListener('submit',(e) => {
    e.preventDefault();

    console.log(e.target);
    
    //Remove the Default UI
    chats.style.display = "block";
    defaultContent.style.display = "none";

    const userPrompt = textarea.value;

    chats.innerHTML += getUserCard(userPrompt);
    // window.scrollTo(0, document.body.scrollHeight);
    textarea.value = "";

    const message = {
        role: "user",
        content: strcuturePrompt(userPrompt)
    }

    vscode.postMessage({
        command: "CALL_API",
        message: message
    })

    console.log('form submitted')
})


window.addEventListener('message',(event) => {
    const type = event.data.type;

    switch(type){
        case 'POST_MESSAGE':

            chats.style.display = "block";
            defaultContent.style.display = "none";

            const data = event.data.message
            console.log("get the response",data);
            const messageView = cardFactory(data);

            if(data.role == "assistant"){
                // chats.appendChild(messageView);
            }
            else{
                insertToUI(messageView);
            }


            break;
        case 'INIT':
            console.log("data",event.data);
            mainIconURI = `${event.data.mainIconURI}`;
            userIconURI = `${event.data.userIconURI}`;
            companyLogoURI = `${event.data.compandLogoURI}`;
    }

})