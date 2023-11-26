
async function showLeaderboard() {
    try {
        console.log('Fetching leaderboard data...');
        // Fetch data from the server
        let response = await fetch("/leaderBoarding");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        let data = await response.json();

        // Log the data to the console for verification
        console.log(data);

        // Display data on the webpage
        displayLeaderboard(data);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
}

function displayLeaderboard(data) {
    // Access the DOM element where you want to display the leaderboard
    let leaderboardContainer = document.getElementById("div_LeaderBoard");

    // Clear existing content
    leaderboardContainer.innerHTML = "";

    // Iterate through the data and create HTML elements to display it
    for (let entry of data) {
        let entryElement = document.createElement("div");
        entryElement.textContent = `Username: ${entry.username}, Score: ${entry.Score}`;
        leaderboardContainer.appendChild(entryElement);
    }
}