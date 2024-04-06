import * as vscode from 'vscode';
import axios from 'axios'


function getCodeExplanationPrompt(prompt){
	return `
		Prompt Structure:
		
		Introduction:
		Begin with a brief, friendly summary of the code.
		
		Code with Comments:
		Always Generate selected code snippet with detailed comments explaining each line.
		
		Detailed Explanation:
		In-depth explanation of the code, focusing on beginner-friendly language and concepts.

		Don't Include headings.

		**User Query**: ${prompt}
	`
}

function getunitTestPrompt(prompt){
	return `
		write a code snippet unit test case for the below code with detailed comments
		
		Example: 
		
		code: function add(a,b){
			return a + b;
		}

		Here is a code snippet for a unit test case using Jest, which is a popular JavaScript testing framework: \n
		\`\`\`
			// Import the function to be tested
			const add = require('./add');
			
			// Unit test case for the add function
			describe('add function', () =&gt; {
				test('adds 1 + 2 to equal 3', () =&gt; {
					// Arrange
					const a = 1;
					const b = 2;
			
					// Act
					const result = add(a, b);
			
					// Assert
					expect(result).toBe(3);
				});
			
				test('adds -1 + 1 to equal 0', () =&gt; {
					// Arrange
					const a = -1;
					const b = 1;
			
					// Act
					const result = add(a, b);
			
					// Assert
					expect(result).toBe(0);
				});
			
				// Additional test cases can be added to cover edge cases, such as negative numbers or large numbers
			});
					
		\`\`\`
		
		In this code snippet:

		We import the add function from the file where it is defined.
		We create test cases using the test function provided by Jest.
		For each test case, we arrange the input values, call the add function with those values, and then assert the result using the expect function.
		We check if the result returned by the add function matches the expected result using expect(result).toBe(expectedResult).
		Remember to replace ./add with the correct file path where the add function is defined. Also, make sure to run the test using a testing framework like Jest to check the correctness and functionality of the add function.


		**user query**: ${prompt}

	`;
}

function getCommentsPrompt(prompt){

	// Explanation:

	// function add(a, b) {: This line starts the definition of a JavaScript function named add which takes two parameters a and b.
	
	// // Return the sum of 'a' and 'b'.: This line is a comment explaining what the function does. It clarifies that the purpose of the function is to return the sum of a and b.
	
	// return a + b;: This line is the actual logic of the function. It returns the sum of the parameters a and b.

	return `
		write a code snippet for the below code with detailed comments
		
		Example:

		code: function add(a,b){
			return a + b;
		}

		response: Here's the code snippet with detailed comments explaining each part:

		\`\`\`
		// Define a function named 'add' which takes two parameters 'a' and 'b'.
		function add(a, b) {
			// Return the sum of 'a' and 'b'.
			return a + b;
		}
		\`\`\`
				
		**User Query**:  ${prompt}
	`
}

function getFindBugsPrompt(prompt){
	return `
		Develop a 'Find Bugs in the Code' feature aimed at detecting and resolving common programming errors. The feature should analyze code snippets and identify potential bugs, providing detailed explanations of each issue along with suggested fixes. Consider including support for detecting various types of bugs such as syntax errors, logical errors, runtime errors, and potential security vulnerabilities.

		For each detected bug, the feature should provide:
		
		A clear and detailed explanation of the issue, including why it is a problem and its potential impact on the code's behavior.
		A code snippet highlighting the problematic section.
		Suggested fixes or solutions to resolve the issue effectively, including code snippets demonstrating the corrected implementation.
		Ensure that the feature covers a wide range of programming languages and supports popular coding practices and conventions. Additionally, provide options for customization and configuration to tailor bug detection strategies according to user preferences and project requirements.

		Example:
		
		Code: 
		
		# Calculating the average of a list of numbers
		numbers = [10, 20, 30, 40, 50]
		total_sum = sum(numbers)
		average = total_sum / len(numbers) 

		response:

		Bug Description:
		The following code snippet attempts to calculate the average of a list of numbers. However, it incorrectly computes the sum of the numbers by using the length of the list as the divisor instead of the total number of elements.

		Code Snippet:
		\`\`\`
		# Calculating the average of a list of numbers
		numbers = [10, 20, 30, 40, 50]
		total_sum = sum(numbers)
		average = total_sum / len(numbers)  # Bug: Incorrect calculation of average
		\`\`\`

		Explanation:
		The bug occurs because the average calculation uses the length of the numbers list as the divisor instead of the total count of numbers in the list. This results in an average value that is lower than the actual average of the numbers in the list.
		
		Suggested Fix:
		To fix the bug, calculate the total count of numbers in the list separately and use it as the divisor for the average calculation.

		Corrected Code Snippet:
		\`\`\`
		# Correctly calculating the average of a list of numbers
		numbers = [10, 20, 30, 40, 50]
		total_sum = sum(numbers)
		count = len(numbers)
		average = total_sum / count  # Correct calculation of average		
		\`\`\`

		Explanation of Fix:
		By calculating the total count of numbers in the list separately and using it as the divisor for the average calculation, the corrected code snippet ensures that the average is computed accurately.

		**User Query**: ${prompt}
	`
}

function getRefactoredPrompt(prompt){
	return `
		You have been given a code snippet that performs a specific task. However, the code is difficult to understand and lacks clarity. Your task is to refactor the code to improve its readability, maintainability, and efficiency without altering its functionality. Focus on simplifying complex logic, eliminating redundant code, and adhering to best coding practices.

		Example:

		code: 
		def calculate_average(numbers):
			total = 0
			count = 0
			for num in numbers:
				total += num
				count += 1
			if count != 0:
				average = total / count
			else:
				average = 0
			return average
	
		numbers = [10, 20, 30, 40, 50]
		avg = calculate_average(numbers)
		print("Average:", avg)

		Refactored Code Snippet:
		\`\`\`
		def calculate_average(numbers):
			if not numbers:
				return 0  # If the list is empty, return 0 to avoid division by zero
			total = sum(numbers)  # Using sum() to calculate total sum of numbers
			return total / len(numbers)  # Calculate average directly and return
	
		numbers = [10, 20, 30, 40, 50]
		avg = calculate_average(numbers)
		print("Average:", avg)
	
		\`\`\`

		In this refactored version:

		1) I've removed the unnecessary 'count' variable and the loop to calculate the count of numbers. Instead, I used the built-in sum() function to calculate the total sum of numbers.
		2) I've simplified the calculation of the average by directly dividing the total sum by the length of the list.
		3) Added a check to return 0 if the list is empty to prevent division by zero.

		
		**User Prompt**: ${prompt}
	`;
}

function getOptimizedPrompt(prompt){
	return `
	You have been given a code snippet that performs a specific task. However, the code is not as efficient as it could be, and you've been tasked with optimizing it for better performance. Your goal is to identify areas where the code can be made more efficient without altering its functionality. Focus on improving algorithmic complexity, minimizing redundant operations, and utilizing built-in functions or libraries where applicable.

	Example:
	Code: 
	def find_duplicate(numbers):
		seen = set()
		duplicates = set()
		for num in numbers:
			if num in seen:
				duplicates.add(num)
			else:
				seen.add(num)
		return duplicates

	numbers = [1, 2, 3, 4, 5, 2, 6, 7, 8, 9, 1]
	dup = find_duplicate(numbers)
	print("Duplicates:", dup)

	Optimized Code Snippet:
	\`\`\`
	def find_duplicate(numbers):
		seen = set()
		duplicates = set()
		for num in numbers:
			if num in seen:  # Using set membership check for faster lookup
				duplicates.add(num)
			else:
				seen.add(num)
		return duplicates

	numbers = [1, 2, 3, 4, 5, 2, 6, 7, 8, 9, 1]
	dup = find_duplicate(numbers)
	print("Duplicates:", dup)

	\`\`\`


	In this optimized version:

	I've utilized Python's set() data structure for faster membership checking. This change reduces the time complexity of checking for duplicates from O(n^2) to O(n), significantly improving performance, especially for large lists.
	The algorithm remains unchanged, preserving the functionality of the original code while making it more efficient.


	**User Prompt**: ${prompt}
	`
}

function getAskAnythingPrompt(prompt){

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

function checkAPIKEY() : Boolean{
	const confival = vscode.workspace.getConfiguration();
	if(!confival.get('API_KEY') || confival.get('API_KEY') == ""){
		vscode.window.showErrorMessage('Please add your API_KEY in plugin settings')
		return false;
	}

	return true;
}

export function activate(context: vscode.ExtensionContext) {

	const provider = new GPTViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(GPTViewProvider.viewType, provider));
	

	const explainDisposable = vscode.commands.registerCommand('code-instance.explain',async ()=>{
		
		if(!checkAPIKEY()){
			return;
		}

		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;

		let highlighted = "";

		if(selection && !selection.isEmpty){
			const selectionRange = new vscode.Range(selection.start.line,selection.start.character, selection.end.line,selection.end.character);
			highlighted  = editor.document.getText(selectionRange);
		}
		else {
			vscode.window.showInformationMessage('Please Select Code For Explanation');
			return;
		}
		
		const actualMessage : Message = {
			role: Role.User,
			content: getCodeExplanationPrompt(highlighted)
		}

		const truncatedMessage : Message = {
			role: Role.User,
			content: `Explain the highlighted text`
		}
		
		// provider.sendMessage(message);
		await provider.startConversation(actualMessage,truncatedMessage)
	})

	const unitTestcaseDisposable = vscode.commands.registerCommand('code-instance.unit_test_case',async ()=>{
		
		if(!checkAPIKEY()){
			return;
		}

		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;

		let highlighted = "";

		if(selection && !selection.isEmpty){
			const selectionRange = new vscode.Range(selection.start.line,selection.start.character, selection.end.line,selection.end.character);
			highlighted  = editor.document.getText(selectionRange);
		}
		else {
			vscode.window.showInformationMessage('Please Select Code For Unit Test Case');
			return;
		}
		
		const actualMessage : Message = {
			role: Role.User,
			content: getunitTestPrompt(highlighted)
		}

		const truncatedMessage : Message = {
			role: Role.User,
			content: `Generate Unit Testcase for the highlighted text`
		}
		
		// provider.sendMessage(message);
		await provider.startConversation(actualMessage,truncatedMessage)
	})

	const commentsDisposable = vscode.commands.registerCommand('code-instance.add_comments',async ()=>{
		
		if(!checkAPIKEY()){
			return;
		}
		
		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;

		let highlighted = "";

		if(selection && !selection.isEmpty){
			const selectionRange = new vscode.Range(selection.start.line,selection.start.character, selection.end.line,selection.end.character);
			highlighted  = editor.document.getText(selectionRange);
		}
		else {
			vscode.window.showInformationMessage('Please Select Code For Adding Comments');
			return;
		}
		
		const actualMessage : Message = {
			role: Role.User,
			content: getCommentsPrompt(highlighted)
		}

		const truncatedMessage : Message = {
			role: Role.User,
			content: `Add Comments in the highlighted text`
		}
		
		// provider.sendMessage(message);
		await provider.startConversation(actualMessage,truncatedMessage)
	})

	const bugsDisposable = vscode.commands.registerCommand('code-instance.find_bugs',async ()=>{
		if(!checkAPIKEY()){
			return;
		}

		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;

		let highlighted = "";

		if(selection && !selection.isEmpty){
			const selectionRange = new vscode.Range(selection.start.line,selection.start.character, selection.end.line,selection.end.character);
			highlighted  = editor.document.getText(selectionRange);
		}
		else {
			vscode.window.showInformationMessage('Please Select Code For Finding Bugs');
			return;
		}
		
		const actualMessage : Message = {
			role: Role.User,
			content: getFindBugsPrompt(highlighted)
		}

		const truncatedMessage : Message = {
			role: Role.User,
			content: `Find Bugs in the highlighted text`
		}
		
		// provider.sendMessage(message);
		await provider.startConversation(actualMessage,truncatedMessage)
	})

	const codeRefactorDisposable = vscode.commands.registerCommand('code-instance.code_refactor',async ()=>{
		
		if(!checkAPIKEY()){
			return;
		}

		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;

		let highlighted = "";

		if(selection && !selection.isEmpty){
			const selectionRange = new vscode.Range(selection.start.line,selection.start.character, selection.end.line,selection.end.character);
			highlighted  = editor.document.getText(selectionRange);
		}
		else {
			vscode.window.showInformationMessage('Please Select Code For Code Refactoring');
			return;
		}
		
		const actualMessage : Message = {
			role: Role.User,
			content: getRefactoredPrompt(highlighted)
		}

		const truncatedMessage : Message = {
			role: Role.User,
			content: `Refactor in the highlighted text`
		}
		
		// provider.sendMessage(message);
		await provider.startConversation(actualMessage,truncatedMessage)
	})

	const codeOptimizeDisposable = vscode.commands.registerCommand('code-instance.code_optimize',async ()=>{
		
		if(!checkAPIKEY()){
			return;
		}

		const editor = vscode.window.activeTextEditor;
		const selection = editor.selection;

		let highlighted = "";

		if(selection && !selection.isEmpty){
			const selectionRange = new vscode.Range(selection.start.line,selection.start.character, selection.end.line,selection.end.character);
			highlighted  = editor.document.getText(selectionRange);
		}
		else {
			vscode.window.showInformationMessage('Please Select Code For Code Optimize');
			return;
		}
		
		const actualMessage : Message = {
			role: Role.User,
			content: getOptimizedPrompt(highlighted)
		}

		const truncatedMessage : Message = {
			role: Role.User,
			content: `Optimize in the highlighted text`
		}
		
		// provider.sendMessage(message);
		await provider.startConversation(actualMessage,truncatedMessage)
	})

	const askAnythingDisposable = vscode.commands.registerCommand('code-instance.ask_anything',async ()=>{
		
		if(!checkAPIKEY()){
			return;
		}

		const highlighted = await vscode.window.showInputBox({
			title: "Ask Anything",
			prompt: "Turn your questions into code",			
		})

		if(!highlighted || highlighted == ""){
			vscode.window.showInformationMessage('Please type something to search');
			return;
		}

		const actualMessage : Message = {
			role: Role.User,
			content: getAskAnythingPrompt(highlighted)
		}

		const truncatedMessage : Message = {
			role: Role.User,
			content: highlighted
		}
		
		// provider.sendMessage(message);
		await provider.startConversation(actualMessage,truncatedMessage)
	})

	context.subscriptions.push(explainDisposable);
	context.subscriptions.push(unitTestcaseDisposable);
	context.subscriptions.push(commentsDisposable);
	context.subscriptions.push(bugsDisposable);
	context.subscriptions.push(codeRefactorDisposable);
	context.subscriptions.push(codeOptimizeDisposable);
	context.subscriptions.push(askAnythingDisposable);

}

enum Role {
	Assistant = "assistant",
	User = "user"
}

enum CustomEventCommand {
	CALL_API = "CALL_API",
	POST_MESSAGE = "POST_MESSAGE",
	INIT = "INIT",
	COPY_CLIPBOARD = "COPY_CLIPBOARD"
}

type Message = {
	role: String,
	content: String
};


async function getAPIResponse(messages: Message[]) : Promise<Message>{


	//  call the api

	try {
		
		const confival = vscode.workspace.getConfiguration();
		const url = "https://api.openai.com/v1/chat/completions";
		const model = "gpt-3.5-turbo"
		const payload = {
			"model": model,
			"messages": messages
		  }
		const apiKey = confival.get('API_KEY');

		const res = await axios.post(url,payload,{
			headers: {
				"Authorization": `Bearer ${apiKey}`
			}
		});
	
		return {
			role: Role.Assistant,
			content: res.data.choices[0].message.content
		}		
	} catch (error) {
		return {
			role: Role.Assistant,
			content: error.message
		}	
	}

}

class GPTViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'chatGPT.gptview';

	private _view?: vscode.WebviewView;

	private messages : Message[] = [];
	private mainIconURI: any ;
	private userIconURI: any;
	private compandLogoURI: any;

	constructor(
		private readonly _extensionUri: vscode.Uri,
		prevMessages: Message[] = []
	) { 
		this.messages = prevMessages;
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async data => {
			const command = data.command;
			switch(command){
				case CustomEventCommand.CALL_API : 
					const newMessage = data.message

					if(!checkAPIKEY()){
						return;
					}

					this.messages.push(newMessage);
					const res : Message = await getAPIResponse(this.messages)
					this.sendMessage(res);
					break;

				case CustomEventCommand.INIT:
					this.init();
					break;
				
				case CustomEventCommand.COPY_CLIPBOARD:
					const value = data.message;
					vscode.env.clipboard.writeText(value);
					vscode.window.showInformationMessage("copied to clipboard");
			}

		});
	}

	public async startConversation(message : Message, truncatedMessage : Message){
		this.sendMessage(truncatedMessage);
		this.messages.push(message);
		const res : Message = await getAPIResponse(this.messages)
		this.sendMessage(res);	
	}

	public sendMessage(message : Message) {
		if (this._view) {
			this._view.webview.postMessage({ type: CustomEventCommand.POST_MESSAGE, message: message });
		}
	}

	public init(){
		if (this._view) {
			this._view.webview.postMessage({ type: CustomEventCommand.INIT, mainIconURI: this.mainIconURI, userIconURI: this.userIconURI, compandLogoURI: this.compandLogoURI });
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		const plusIconUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'plus.png'));
		this.mainIconURI = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'icon.png')).toString();
		this.userIconURI = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'profile-user.png')).toString();
		this.compandLogoURI = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'company_logo.png')).toString();

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<script src="https://cdn.tailwindcss.com"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.1/marked.min.js" integrity="sha512-pSeTnZAQF/RHxb0ysMoYQI/BRZsa5XuklcrgFfU3YZIdnD3LvkkqzrIeHxzFi6gKtI8Cpq2DEWdZjMTcNVhUYA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" integrity="sha512-D9gUyxqja7hBtkWpPWGt9wfbfaMGVt9gnyCvYa+jojwwPHLCzUm5i8rpk7vD7wNee9bA35eYIjobYPaQuKS1MQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

			<link
			rel="stylesheet"
			href="https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/github-dark.min.css"
			/>

			<script src="https://unpkg.com/typewriter-effect@latest/dist/core.js"></script>
			
			<title>CHAT</title>
			<style>
				textarea:focus {
					outline: 0;
					resize: none;
				}
		
				textarea {
					resize: none;
				}
				
				.prompt p {
					margin-bottom: 12px;
				}

				pre {
					margin: -12px 0px !important;
				}

				li {
					margin: 8px 0px !important;
				}
			</style>
		</head>
		<body class="py-12" style="font-family: Segoe WPC, Segoe UI, sans-serif; font-weight: bold;">
			
			<div class="flex flex-col h-screen items-center">
		
				<div id="default-content" class="mt-4 ">
					<div id="intro" class="flex flex-col items-center">
						<a href="https://google.com" class="flex flex-col items-center" >
							<img src="${this.compandLogoURI}" style="width:70%" />
						</a>
			
						<p class="text-white mt-3" style="font-size: 22px;text-align: center;">Hi, I'm your AI powered programmer</p>
						<img class="mt-2" src="https://codesnippets.ai/_next/image?url=%2Fassets%2Fimages%2Fpoweredby.png&w=384&q=75" style="height: 60px;" />
					</div>
			
					<div class="features flex flex-col items-center mt-6">
						<p class="text-white text-xl">How can I help?</p>
						<div class="text-gray-300 mt-2">
							<p class="font-normal bg-slate-600 rounded-md py-3 px-10 mt-4" style="background-color: #3c3c3c;text-align: center;">Turn your questions into code</p>
							<p class="font-normal bg-slate-600 rounded-md py-3 px-10 mt-4" style="background-color: #3c3c3c;text-align: center;">Optimize your code</p>
							<p class="font-normal bg-slate-600 rounded-md py-3 px-10 mt-4" style="background-color: #3c3c3c;text-align: center;">Debug and fix errors</p>
							<p class="font-normal bg-slate-600 rounded-md py-3 px-10 mt-4" style="background-color: #3c3c3c;text-align: center;">Get explanation of your code</p>
							<p class="font-normal bg-slate-600 rounded-md py-3 px-10 mt-4" style="background-color: #3c3c3c;text-align: center;">Generate test cases for your code</p>
						</div>
					</div>
			
					<div class="usage flex flex-col items-center">
			
						<div class="flex flex-col items-center mt-4">
							<p class="font-normal text-gray-300">Use AI anywhere</p>
							<p class="text-white">(<strong class="font-bold">alt + k</strong>)</p>
						</div>
			
						<div class="flex flex-col items-center mt-4">
							<p class="font-normal text-gray-300">How to use the AI</p>
							<p class="text-white">1. <strong class="font-bold">Select Code</strong></p>
							<p class="text-white">2. <strong class="font-bold">Right Click</strong></p>
							<p class="text-white">3. <strong class="font-bold">Select AI -> Function</strong></p>
						</div>
			
						<div class="flex flex-col items-center mt-4" style="visibility:hidden">
							<p class="font-normal text-gray-300">Quick insert Snippets</p>
							<p class="text-white">(<strong class="font-bold">Ctrl/cmd + Shift + Q</strong>)</p>
						</div>
					</div>
					
					<!-- <div class="w-full h-48"></div> -->


				</div>
				
				<div class="chats hidden" style="width: 100%;">
				</div>
				
				<div class="usage flex flex-col items-center" style="visibility:hidden">
				
				<div class="flex flex-col items-center mt-2">
					<p class="font-normal text-gray-300">How to use the AI</p>
					<p class="text-white">1. <strong class="font-bold">Select Code</strong></p>
				</div>

			</div>

			<div id="loader" class="rounded-xl p-4 cursor-pointer hover:bg-slate-800 bg-slate-700 text-white fixed bottom-14 right-0 mx-2" style="visibility:hidden;">
				Stop Generating
			</div>

				<form  class="searhbar flex items-center pt-2 px-2 fixed bottom-2 rounded-md  text-slate-200" style="width: 95%;background-color: #3c3c3c;">
					
					<textarea id="textarea" class="w-full bg-transparent font-normal placeholder:text-slate-300 placeholder:font-normal max-h-6" 
					style="border: none;text-decoration: none; width: 85%;resize: none;" placeholder="Turn your questions into code"></textarea>
		
					<div class="flex py-1 items-center">
						<button class="hover:bg-slate-600" style="padding: 5px;" type="submit">
							<img id="reset-button" src="${plusIconUri}" style="width: 15px;height: 15px;">
						</button>
						<button class="ml-3">
							<img src="${this.mainIconURI}" style="width: 30px;height: 30px;">
						</button>
					</div>
		
				</form>
		
			</div>
			<script src="${scriptUri}" ></script>
		</body>
		
		</html>`;
		// return `<!DOCTYPE html>
		// 	<html lang="en">
		// 	<head>
		// 		<meta charset="UTF-8">

		// 		<!--
		// 			Use a content security policy to only allow loading styles from our extension directory,
		// 			and only allow scripts that have a specific nonce.
		// 			(See the 'webview-sample' extension sample for img-src content security policy examples)
		// 		-->
		// 		<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

		// 		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		// 		<link href="${styleResetUri}" rel="stylesheet">
		// 		<link href="${styleVSCodeUri}" rel="stylesheet">
		// 		<link href="${styleMainUri}" rel="stylesheet">

		// 		<title>Cat Colors</title>
		// 	</head>
		// 	<body>
		// 		<ul class="color-list">
		// 		</ul>

		// 		<button class="add-color-button">Add Color</button>

		// 		<script nonce="${nonce}" src="${scriptUri}"></script>
		// 	</body>
		// 	</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
