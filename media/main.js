console.log('script loaded successfully');
hljs.initHighlightingOnLoad();

const resetButton = document.getElementById('reset-button');
const defaultContent = document.getElementById('default-content');
const chats = document.querySelector('.chats');
const form = document.querySelector('.searhbar');
const textarea = document.getElementById('textarea');
const loader = document.getElementById('loader');
const promptView = document.getElementById('prompt_view');
const promptText = document.getElementById('prompt_text');

const regeneratePromptForm = document.getElementById('prompt_generator');
const promptCopyButton = document.getElementById('prompt_copy');
const promptInsertButton = document.getElementById('prompt_insert');
const promptLoading = document.getElementById('prompt_loading');
const codeCheckBox = document.getElementById('code-checkbox');
const roleInputBox = document.getElementById('role');
const searchResults = document.getElementById('rolessearchresult');

const clearHistoryButton = document.getElementById('clear_history');

const vscode = acquireVsCodeApi();
let userIconURI = '';
let mainIconURI = '';
let companyLogoURI = '';

function getUserCard(prompt) {
	return `
    <div class="user chat px-4 py-4 mb-4 rounded-md" style="background: linear-gradient(90deg, #ba5502, #d46204);">
        <div class="flex">
            <img class="rounded" src="${userIconURI}" style="width: 30px;height: 30px;" />
            <p class="text-gray-200 ml-2 text-lg">You</p>
        </div>
        <div class="prompt text-white font-normal mt-2 ">
            ${prompt}
        </div>
    </div>
    `;
}

let id = 0;
let cache = {};
let scrollInterval = null;
let currentTypeWriter = null;

function handleCopy(currId) {
	vscode.postMessage({
		command: 'COPY_CLIPBOARD',
		message: cache[currId],
	});
}

function handleInsert(currId) {
	vscode.postMessage({
		command: 'INSERT_EDITOR',
		message: cache[currId],
	});
}

function getAssistandCard(prompt, useAnimation = true) {
	const renderer = new marked.Renderer();
	renderer.code = (code, language) => {
		cache[id] = code;
		return `
        <pre style="position:relative">
            <div class="flex" style="position:absolute; top:12px; right:0px;">
                <button class="bg-white text-black text-xs rounded-md p-1"  onClick="handleCopy(${id})")>${'Copy'}</button>
                <button class="bg-white text-black text-xs rounded-md p-1 ml-1"  onClick="handleInsert(${id++})")>${'Insert'}</button>
            </div>
            <code class="hljs ${language}">${hljs.highlightAuto(code).value}
            </code>
        </pre>`;
	};

	const newMarked = new marked.Marked({ renderer });

	// Create the main div element
	var mainDiv = document.createElement('div');
	mainDiv.classList.add(
		'assistant',
		'chat',
		'px-4',
		'py-4',
		'mb-4',
		'rounded-md'
	);
	mainDiv.style.backgroundColor = '#3c3c3c';

	// Create the inner div for the flex layout
	var flexDiv = document.createElement('div');
	flexDiv.classList.add('flex');
	flexDiv.classList.add('items-center');

	// Create the image element
	var img = document.createElement('img');
	img.classList.add('rounded');
	img.src = mainIconURI;
	img.style.width = '30px';
	img.style.height = '30px';

	// Create the paragraph element
	// var paragraph = document.createElement("p");
	// paragraph.classList.add("text-gray-200", "ml-2", "text-lg");
	// paragraph.textContent = "monkeyteam.io";

	//create the image element
	var img2 = document.createElement('img');
	img2.classList.add('rounded');
	img2.src = companyLogoURI;
	img2.style.width = 'fit';
	img2.style.height = '40px';
	img2.style.marginLeft = '8px';

	// Append the image and paragraph elements to the flex div
	flexDiv.appendChild(img);
	flexDiv.appendChild(img2);

	const flexDiv2 = document.createElement('div');
	flexDiv2.classList.add('flex');
	flexDiv2.classList.add('justify-between', 'items-center');

	flexDiv2.appendChild(flexDiv);

	const buttonflexdiv = document.createElement('div');
	const copyResponseButton = document.createElement('button');
	copyResponseButton.classList.add(
		'bg-white',
		'text-black',
		'text-xs',
		'rounded-md',
		'p-1'
	);
	copyResponseButton.innerText = 'copy';

	copyResponseButton.onclick = (e) => {
		e.preventDefault();
		vscode.postMessage({
			command: 'COPY_CLIPBOARD',
			message: prompt,
		});
	};

	const insertResponseButton = document.createElement('button');
	insertResponseButton.classList.add(
		'bg-white',
		'text-black',
		'text-xs',
		'rounded-md',
		'p-1',
		'ml-1'
	);
	insertResponseButton.innerText = 'insert';

	insertResponseButton.onclick = (e) => {
		e.preventDefault();
		vscode.postMessage({
			command: 'INSERT_EDITOR',
			message: prompt,
		});
	};

	buttonflexdiv.appendChild(copyResponseButton);
	buttonflexdiv.appendChild(insertResponseButton);

	flexDiv2.appendChild(buttonflexdiv);

	// Create the prompt div
	var promptDiv = document.createElement('div');
	promptDiv.classList.add('prompt', 'text-white', 'font-normal', 'mt-2');

	if (!useAnimation) promptDiv.innerHTML = newMarked.parse(prompt);

	// Append the flex div and prompt div to the main div
	mainDiv.appendChild(flexDiv2);
	mainDiv.appendChild(promptDiv);

	// Append the main div to the document body or any other desired parent element
	// document.body.appendChild(mainDiv);
	chats.appendChild(mainDiv);

	if (useAnimation) {
		const markedParsedString = newMarked.parse(prompt);

		var typewriter = new Typewriter(promptDiv, {
			loop: false,
			delay: 0, // Adjust the typing speed here
			cursor: '',
		});

		typewriter.options.speed = 1;

		currentTypeWriter = typewriter;
		typewriter.typeString(markedParsedString).start();
	}

	if (scrollInterval != null) return;

	// Get the last height of the page
	var lastHeight = document.body.scrollHeight;

	// Function to scroll to the bottom of the page
	function scrollToBottom() {
		window.scrollTo(0, document.body.scrollHeight);
	}

	// Check if the current height is greater than the last height
	function checkScroll() {
		var currentHeight = document.body.scrollHeight;

		console.log('scroll', lastHeight, currentHeight);
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

function strcuturePrompt(prompt) {
	if (codeCheckBox.checked) {
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
        `;

		return promptStructure;
	} else {
		const promptStructure = `
            All headings should be bold
            Don't include response in the output
            
            Example:
            User Query: Hey there, Revit Dynamo Expert! 🚀 Let's talk about can you get the clashed elements with ducts & wallscan you get the clashed elements with ducts & walls.

            To find clashes between ducts and walls in Revit using Dynamo, you can follow a strategy similar to what you'd do with the Revit API in Python, but leveraging Dynamo's visual programming environment. Dynamo provides nodes to access and filter elements within the Revit model, and perform geometric operations, including intersection checks. Here’s how you can approach this task in Dynamo:

            Step 1: Collect Ducts and Walls
            Categories Node: Use the Categories node to select the categories for Ducts and Walls.
            All Elements of Category Node: Use this node to collect all elements of the specified categories.
            Step 2: Get Geometry
            Element.Geometry Node: For both ducts and walls, use the Element.Geometry node to extract their geometry.
            Step 3: Check for Intersections
            Geometry.Intersect Node: Use this node to check for intersections between the geometries of each duct and each wall. This node will return the intersection geometry if there is a clash.
            Step 4: Filter and Report Clashes
            Filter Out Non-Intersecting Elements: You may get empty lists or null values for pairs without a clash. Use nodes like List.FilterByBoolMask to filter out non-intersecting pairs.
            Report or Visualize Clashes: Collect the IDs or other identifying information of the clashing ducts and walls. You can then use this data as needed, for example, by writing it to a file, displaying it in Dynamo, or even creating Revit elements to mark these locations.
            Example of a Dynamo Workflow:
            Step 1: Use Categories nodes to select Ducts and Walls, and then use All Elements of Category nodes to get all ducts and walls.
            Step 2: Extract the geometry of these elements using Element.Geometry.
            Step 3: Use Geometry.Intersect with each duct's geometry against all walls' geometries to find intersections.
            Step 4: Use List.FilterByBoolMask to separate out the elements that have intersections (i.e., clashes).
            This workflow is a guideline. Depending on the complexity of your model and the specifics of what you consider a "clash," you might need to adjust your approach. For example, you might need to consider the tolerance for intersections or the specific types of ducts and walls you're interested in.
            
            Dynamo's visual programming interface makes it relatively straightforward to experiment with different nodes and workflows, so don't hesitate to try out different configurations until you find one that suits your needs. Remember, Dynamo also allows you to create custom nodes using Python scripting if you need more control over the process than what the standard nodes offer.

            User Query: Act as a Revit Dynamo Developer, Explain the below Exercise. 

            Create a List of Coordinates for Every Room.
            
            List me out all the Nodes used to Create this Dynamo Graph. 
            Explain input nodes, Output Nodes, Function & logic 
            
            
            
            Please write in English language.

            
            response: Creating a list of coordinates for every room in a Revit model using Dynamo involves retrieving room elements from the model, extracting their location information, and then formatting this information into a list of coordinates. This process requires a combination of selection, extraction, and data manipulation nodes in Dynamo. Here's a step-by-step breakdown of the nodes you would use and the logic behind their selection and arrangement:

            1. Select Rooms
            Node(s):
            
            Categories: This node allows you to select categories within Revit. For this task, you would choose the "Rooms" category.
            All Elements of Category: Takes the chosen category and finds all instances within the Revit model.
            Function & Logic: These nodes work together to select all the room elements present in the Revit model. "Categories" specifies the element category to search for, and "All Elements of Category" retrieves every instance of this category from the model, effectively gathering all rooms.
            
            2. Extract Room Locations
            Node(s):
            
            Element.Location: Extracts the location data from each room element. Rooms typically have a "Location Point" that represents their centroid.
            Function & Logic: This node takes each room element and extracts its location, specifically focusing on the centroid of the room as its defining coordinate. The location data will typically include the X, Y (and sometimes Z) coordinates, representing the room's position within the building's 3D space.
            
            3. Format Coordinates
            Node(s):
            
            Point.X, Point.Y, (and possibly Point.Z): These nodes extract the X, Y, and Z components of the point representing the room's location.
            Code Block or String.Format: Can be used to format the extracted X, Y, (and Z) coordinates into a string or a structured list format, depending on the desired output.
            Function & Logic: After extracting the location points, the individual X, Y, (and Z) values are separated using the "Point.X" and "Point.Y" nodes (and "Point.Z" if working in 3D space). These values can then be formatted into a readable list or string using "Code Block" nodes with custom code or "String.Format" to concatenate the values into a coordinate format (e.g., "(X, Y, Z)").
            
            4. Create List of Coordinates
            Node(s):
            
            List.Create: This node can be used to aggregate the formatted coordinates into a single list.
            Watch or Data.ExportExcel: To visualize or export the list of coordinates.
            Function & Logic: The "List.Create" node compiles the individual coordinates into a comprehensive list. This list can be visualized within Dynamo using a "Watch" node or exported to an external file (like Excel) for further use or analysis, using "Data.ExportExcel".
            
            Summary
            This Dynamo graph automates the process of generating a list of coordinates for every room in a Revit model. It systematically selects room elements, extracts their centroid locations, formats these locations into coordinates, and compiles them into a list. The process efficiently bridges the gap between Revit's spatial data and a usable list of room coordinates, facilitating space analysis, documentation, or any other application requiring precise location data of rooms within a building model.
                        

            User Query: ${prompt}
        `;
		return promptStructure;
	}
}

function cardFactory(message) {
	if (message.role == 'user') {
		return getUserCard(message.content);
	} else if (message.role == 'assistant') {
		return getAssistandCard(message.content);
	} else {
		return getAssistandCard(message.content);
	}
}

function insertToUI(view) {
	chats.innerHTML += view;
}

resetButton.addEventListener('click', (e) => {
	e.preventDefault();

	clearInterval(scrollInterval);
	scrollInterval = null;

	if (currentTypeWriter) currentTypeWriter.stop();

	document.documentElement.scrollTop = 0;

	defaultContent.style.display = 'block';
	chats.style.display = 'none';

	// clear all the chats
	chats.innerHTML = '';

	vscode.postMessage({
		command: 'CLEAR_HISTORY',
	});
});

textarea.addEventListener('keydown', (e) => {
	if (e.keyCode == 13 && !e.shiftKey) {
		e.preventDefault();
		form.dispatchEvent(new Event('submit'));
	}
});

vscode.postMessage({
	command: 'INIT',
});

form.addEventListener('submit', (e) => {
	e.preventDefault();

	console.log(e.target);

	//Remove the Default UI
	chats.style.display = 'block';
	defaultContent.style.display = 'none';

	const userPrompt = textarea.value;

	chats.innerHTML += getUserCard(userPrompt);
	// window.scrollTo(0, document.body.scrollHeight);
	textarea.value = '';

	const paddedPrompt =
		chats.children.length >= 2 ? userPrompt : strcuturePrompt(userPrompt);
	const message = {
		role: 'user',
		content: paddedPrompt,
	};

	vscode.postMessage({
		command: 'CALL_API',
		message: message,
		userPrompt: userPrompt,
	});

	console.log('form submitted');
});

function sendErrorMessage(message) {
	vscode.postMessage({
		command: 'ERROR_MESSAGE',
		message: message,
	});
}

function regeneratePrompt(obj) {
	// const action = "rewrite";

	// return `
	//     You are to act as ${obj.role}, providing prompt appropriate to the given topics in the context of ${obj.role} in ${obj.tone}, in the style of ${obj.writingStyle}, with ${action}. The prompts should be self-explanatory and not refer to any examples given. Topic is ${obj.keywords}.
	// `;

	// Split the query into sentences
	const query = obj.keywords;
	const role = obj.role;
	const tone = obj.tone;
	const writingStyle = obj.writingStyle;

	const sentences = query
		.split('.')
		.map((sentence) => sentence.trim())
		.filter((sentence) => sentence !== '');

	// Create prompt template
	// let prompt = `Hey there, ${role}! 🚀 Let's talk about ${sentences[0]}. in ${tone} with ${writingStyle}`;

	// If there are more sentences, add them as details
	// if (sentences.length > 1) {
	//     prompt += `\n\nHere are some more details:\n`;
	//     for (let i = 1; i < sentences.length; i++) {
	//         prompt += `- ${sentences[i]}. `;
	//     }
	// }

	let prompt = `rewrite below text  \n ${query}`;

	return prompt;
}

regeneratePromptForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const roleView = document.getElementById('role');
	const role = document.getElementById('role').value;

	const toneView = document.getElementById('tone');
	const tone = toneView.options[toneView.selectedIndex].value;

	if (toneView.selectedIndex == 0) {
		sendErrorMessage('Please select the tone!');
		return;
	}

	const writingStyleView = document.getElementById('writing_style');
	const writingStyle =
		writingStyleView.options[writingStyleView.selectedIndex].value;

	if (writingStyleView.selectedIndex == 0) {
		sendErrorMessage('Please select the writing style');
		return;
	}

	const taskView = document.getElementById('task');
	const task = writingStyleView.options[writingStyleView.selectedIndex].value;

	if (taskView.selectedIndex == 0) {
		sendErrorMessage('Please select the task');
		return;
	}

	const keywords = document.getElementById('keywords').value;
	const regenratedPrompt = regeneratePrompt({
		role,
		tone,
		writingStyle,
		keywords,
	});
	const message = {
		role: 'user',
		content: regenratedPrompt,
	};

	promptLoading.style.visibility = 'visible';
	// promptView.style.display = "flex";
	// promptText.innerText = `${regenratedPrompt}`;

	vscode.postMessage({
		command: 'GENERATE_PROMPT',
		message: message,
	});
});

promptCopyButton.addEventListener('click', (e) => {
	e.preventDefault();

	vscode.postMessage({
		command: 'COPY_CLIPBOARD',
		message: promptText.innerText,
	});
});

promptInsertButton.addEventListener('click', (e) => {
	e.preventDefault();
	textarea.value = promptText.innerText;
});

const rolesMock = [
	'Revit Dynamo Expert',
	'Revit API with Python Developer',
	'Revit API with C# Developer',
	'Revit Add-In Specialist',
	'BIM Modeler',
	'BIM Coordinator',
	'BIM Manager',
	'BIM Analyst',
	'BIM Consultant',
	'BIM Technician',
	'BIM Project Manager',
	'BIM Implementation Specialist',
	'BIM Strategy Consultant',
	'BIM Data Manager',
	'BIM Software Developer',
	'BIM Integration Specialist',
];

roleInputBox.addEventListener('input', (e) => {
	const searchText = roleInputBox.value.toLowerCase();
	const matchedCountries = rolesMock.filter((country) =>
		country.toLowerCase().startsWith(searchText)
	);

	// // Clear previous results
	searchResults.innerHTML = '';

	// Display matched results
	matchedCountries.forEach((country) => {
		const listItem = document.createElement('li');
		listItem.classList.add('roles_results');
		listItem.textContent = country;
		searchResults.appendChild(listItem);
	});

	// Show search results
	searchResults.style.display =
		matchedCountries.length > 0 ? 'block' : 'none';
});

searchResults.addEventListener('click', (event) => {
	if (event.target.tagName === 'LI') {
		roleInputBox.value = event.target.textContent;
		searchResults.style.display = 'none';
	}
});

// Close dropdown if clicked outside
document.addEventListener('click', (event) => {
	if (!event.target.matches('#searchResults, #searchInput')) {
		searchResults.style.display = 'none';
	}
});

clearHistoryButton.addEventListener('click', (e) => {
	vscode.postMessage({
		command: 'CLEAR_HISTORY',
	});

	clearInterval(scrollInterval);
	scrollInterval = null;

	if (currentTypeWriter) currentTypeWriter.stop();

	document.documentElement.scrollTop = 0;

	defaultContent.style.display = 'block';
	chats.style.display = 'none';

	// clear all the chats
	chats.innerHTML = '';
});

window.addEventListener('message', (event) => {
	const type = event.data.type;

	switch (type) {
		case 'POST_MESSAGE':
			chats.style.display = 'block';
			defaultContent.style.display = 'none';

			const data = event.data.message;
			console.log('get the response', data);
			const messageView = cardFactory(data);

			if (data.role == 'assistant') {
				// chats.appendChild(messageView);
			} else {
				insertToUI(messageView);
			}

			break;
		case 'INIT':
			mainIconURI = `${event.data.mainIconURI}`;
			userIconURI = `${event.data.userIconURI}`;
			companyLogoURI = `${event.data.compandLogoURI}`;

			const prevMessages = event.data.messages;
			if (prevMessages && prevMessages.length > 0) {
				chats.style.display = 'block';
				defaultContent.style.display = 'none';

				prevMessages.forEach((message) => {
					if (message.role == 'user') {
						const cardView = getUserCard(message.content);
						insertToUI(cardView);
					} else {
						getAssistandCard(message.content, false);
					}
				});
			}
			break;
		case 'REGENRATED_PROMPT':
			const promptData = event.data.message;

			const role = document.getElementById('role').value;

			const toneView = document.getElementById('tone');
			const tone = toneView.options[toneView.selectedIndex].value;

			const writingStyleView = document.getElementById('writing_style');
			const writingStyle =
				writingStyleView.options[writingStyleView.selectedIndex].value;

			const taskView = document.getElementById('task');
			const task = taskView.options[taskView.selectedIndex].value;

			promptView.style.display = 'flex';
			const prompt = `Act as a ${role}, ${task} the below Exercise in ${tone} with ${writingStyle}.  \n ${promptData.content}`;
			promptText.innerText = prompt;

			promptLoading.style.visibility = 'hidden';

			break;
	}
});
