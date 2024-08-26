// Function to create and inject the button
function createButton() {
    const button = document.createElement('button');
    button.id = 'video-solution-button';
    button.innerText = 'Set DSA Channel';
    button.style = `
        position: fixed;
        left: 20px;
        top: 100px;
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
    `;

    // Append button to the body
    document.body.appendChild(button);

    // Add click event to the button
    button.addEventListener('click', toggleInputBox);
}

// Function to toggle the input box
function toggleInputBox() {
    const existingInputBox = document.getElementById('dsa-channel-input-box');
    if (existingInputBox) {
        existingInputBox.remove(); // Remove if already exists
    } else {
        createInputBox(); // Create input box
    }
}

// Function to create the input box for DSA channel link
function createInputBox() {
    const inputBox = document.createElement('div');
    inputBox.id = 'dsa-channel-input-box';
    inputBox.style = `
        position: fixed;
        left: 20px;
        top: 150px;
        width: 300px;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 9999;
    `;

    const title = document.createElement('h3');
    title.innerText = 'Enter DSA Channel Link';
    inputBox.appendChild(title);

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter video channel link';
    inputField.style = `
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;
    inputBox.appendChild(inputField);

    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    submitButton.style = `
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
    `;
    inputBox.appendChild(submitButton);

    // Append input box to the body
    document.body.appendChild(inputBox);

    // Handle the submit action
    submitButton.addEventListener('click', () => {
        const channelLink = inputField.value;
        console.log('User preferred DSA channel:', channelLink);
        inputBox.remove();
        fetchVideoSolutions(channelLink);
    });
}

// Function to fetch video solutions
async function fetchVideoSolutions(channelLink) {
    const currentProblemTitle = document.title; // Get the current problem title from the page.
    const videoData = await fetchVideosForProblem(currentProblemTitle, channelLink); // Pass channelLink here

    // Check if there's a video from the preferred channel
    const preferredVideo = videoData.find(video => video.channel === channelLink);

    // Create a container to display the videos
    injectVideoSolutionContainer(videoData, preferredVideo);
}

// Function to fetch videos for the problem (with channelLink parameter)
async function fetchVideosForProblem(problemTitle, channelLink) {
    const apiKey = 'AIzaSyC14WT71R0hTCqWbxDpwJpIwVAcpHPWfgk'; 
    const query = `${problemTitle} DSA`; 
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10&type=video`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Process the video items
        const videos = data.items.map(item => ({
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            views: 0, // Placeholder for views
            channel: item.snippet.channelTitle // Channel name
        }));

        // Check if a preferred channel video exists
        const preferredVideos = videos.filter(video => video.channel === channelLink);
        const otherVideos = videos.filter(video => video.channel !== channelLink);

        // Concatenate preferred videos at the start and other videos
        const sortedVideos = [...preferredVideos, ...otherVideos];

        return sortedVideos; // Return sorted videos
    } catch (error) {
        console.error('Error fetching videos:', error);
        return []; // Return an empty array in case of an error
    }
}



// Function to inject video solution container
function injectVideoSolutionContainer(videoData, preferredVideo) {
    // Create a container for video solutions
    const container = document.createElement('div');
    container.id = 'video-solution-container';
    container.style = `
        position: fixed;
        left: 350px;
        top: 100px;
        width: 400px;
        max-height: 200px;
        overflow-x: auto;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        gap: 10px;
    `;

    // If preferred video exists, create an element for it
    if (preferredVideo) {
        const preferredVideoElement = document.createElement('a');
        preferredVideoElement.innerText = preferredVideo.title;
        preferredVideoElement.href = preferredVideo.url;
        preferredVideoElement.target = '_blank'; 
        preferredVideoElement.style = `
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        `;
        container.appendChild(preferredVideoElement);
    } else {
        const noPreferredMessage = document.createElement('span');
        noPreferredMessage.innerText = 'No preferred video found.';
        container.appendChild(noPreferredMessage);
    }

    // Create elements for other videos
    videoData.forEach(video => {
        const videoElement = document.createElement('a');
        videoElement.innerText = video.title;
        videoElement.href = video.url;
        videoElement.target = '_blank'; 
        videoElement.style = `
            padding: 10px;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        `;
        container.appendChild(videoElement);
    });

    // Append the video solution container to the body
    document.body.appendChild(container);
}

// Call the function to create the button when the content script loads
createButton();
