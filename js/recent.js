// GitHub API URL and Authentication Token
const recentRepoOwner = "ImamiaFoundation";
const recentRepoName = "Official";
const recentFilePath = "recent.json";

const Rtoken1 = "ghp_q3mmOxJa";
const Rtoken2 = "pX5EUstNhwRohQlRbYm2Fz";
const Rtoken3 = "2Xl2Qb";
const RecentToken = `${Rtoken1}${Rtoken2}${Rtoken3}`; // Full GitHub token

// Fetch recent.json from GitHub
async function fetchRecentJson() {
    const url = `https://api.github.com/repos/${recentRepoOwner}/${recentRepoName}/contents/${recentFilePath}`;
    const headers = {
        Authorization: `token ${RecentToken}`,
        Accept: "application/vnd.github.v3.raw"
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json(); // Parse JSON content
    } catch (error) {
        console.error("Error fetching recent.json:", error);
        return null;
    }
}
// Function to display content
async function displayContent() {
    const contentDiv = document.getElementById("content");
    if (!contentDiv) {
        console.error("Content div not found!");
        return;
    }

    const data = await fetchRecentJson();

    if (!data) {
        contentDiv.innerHTML = "<p>Error loading content.</p>";
        return;
    }

    // Iterate through JSON data
    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        // Display the description
        const description = document.createElement("p");
        description.textContent = `${item.description}`;

        const br = document.createElement("div");
        br.className = "br";

        // Add clickable link as the title for files
        const fileLink = document.createElement("a");
        const encodedDetails = encodeURIComponent(item.description);
        fileLink.textContent = item.title; // Display title here
        fileLink.href = `recent.html?file=${encodeURIComponent(item.filePaths ? item.filePaths[0] : '')}&details=${encodedDetails}`;
        fileLink.target = "_self"; // Open in the same window

        // Add an image if available
        if (item.imagePath) {
            const img = document.createElement("img");
            img.src = `https://raw.githubusercontent.com/${recentRepoOwner}/${recentRepoName}/main/${item.imagePath}`;
            img.alt = item.description;

            // Add click event to redirect to recent.html with parameters
            img.addEventListener("click", () => {
                const encodedFile = encodeURIComponent(item.imagePath);
                const encodedDetails = encodeURIComponent(item.description);
                const url = `recent.html?file=${encodedFile}&details=${encodedDetails}`;
                window.location.href = url;
            });
            
            card.appendChild(img);
            // card.appendChild(fileLink);
            br.appendChild(fileLink);
        }

        // Add file paths (if any) below the clickable title link
        if (item.filePaths && item.filePaths.length > 0) {
            item.filePaths.forEach(filePath => {
                const encodedFilePath = encodeURIComponent(filePath);
                const fileLink = document.createElement("a");
                fileLink.textContent = filePath; // Show file path as text
                fileLink.href = `recent.html?file=${encodedFilePath}&details=${encodedDetails}`;
                fileLink.target = "_self"; // Open in the same window
                // card.appendChild(fileLink);
            });
        }
        br.appendChild(description);
        card.appendChild(br);

        contentDiv.appendChild(card);
    });
}


// Run the script after DOM has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    displayContent();
});
