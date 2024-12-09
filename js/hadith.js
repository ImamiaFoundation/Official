const username = "ImamiaFoundation";
const repository = "Official";
const branch = "main";
    
// GitHub API URLs
const mainHadithUrl = `https://api.github.com/repos/${username}/${repository}/contents/mainhadith.json?ref=${branch}`;
const mainJsonUrl = `https://api.github.com/repos/${username}/${repository}/contents/main.json?ref=${branch}`;
const hadithJsonUrl = `https://api.github.com/repos/${username}/${repository}/contents/hadith.json?ref=${branch}`;

// Function to decode Base64 content (handles UTF-8 encoding)
function decodeBase64(base64String) {
    let decodedString = atob(base64String);
    try {
        decodedString = decodeURIComponent(escape(decodedString)); // Converts to UTF-8
    } catch (e) {
        console.error("Error decoding Base64 content:", e);
    }
    return decodedString;
}

// Function to fetch GitHub file
async function fetchGithubFile(url) {
    try {
        console.log(`Fetching data from: ${url}`);
        const response = await fetch(url, {
            headers: {
                Authorization: `token ${token}`,
                Accept: "application/vnd.github.v3+json; charset=utf-8", // Ensure UTF-8 encoding
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${url}, Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched raw data:', data);

        if (data.content) {
            const decodedContent = decodeBase64(data.content);
            console.log('Decoded Content:', decodedContent);
            return JSON.parse(decodedContent); // Parse the decoded content
        }

        throw new Error('No content found in response');
    } catch (error) {
        console.error(`Error fetching file from GitHub: ${error.message}`);
        return null;
    }
}

// Function to fetch hadith data
async function fetchHadithData() {
    try {
        const mainData = await fetchGithubFile(mainHadithUrl);

        if (!mainData) {
            console.error("mainhadith.json data is null or invalid");
            return;
        }

        console.log("mainhadith.json content:", mainData);

        if (mainData.button === "custom") {
            const customData = await fetchGithubFile(mainJsonUrl);
            console.log("main.json content:", customData);
            if (Array.isArray(customData) && customData.length > 0) {
                displayHadithContent(customData[0]); // Display the first item
            } else {
                console.error("main.json is empty or invalid.");
            }
        } else if (mainData.button === "random") {
            const hadithData = await fetchGithubFile(hadithJsonUrl);
            console.log("hadith.json content:", hadithData);
            if (Array.isArray(hadithData) && hadithData.length > 0) {
                const randomHadith = getRandomHadith(hadithData);
                displayHadithContent(randomHadith);
            } else {
                console.error("hadith.json is empty or invalid.");
            }
        }
    } catch (error) {
        console.error("Error fetching hadith data:", error);
    }
}

// Helper function to get a random hadith
function getRandomHadith(hadithArray) {
    const randomIndex = Math.floor(Math.random() * hadithArray.length);
    return hadithArray[randomIndex];
}

// Function to display hadith content
function displayHadithContent(hadithContent) {
    const container = document.getElementById("hadith-container");

    if (!container) {
        console.error("Error: Hadith container not found.");
        return;
    }

    container.innerHTML = "";

    if (!hadithContent || !hadithContent.title || !hadithContent.hadith || !hadithContent.reference) {
        container.innerHTML = "<p>Error: Invalid hadith content</p>";
        return;
    }

    const { title, hadith, reference } = hadithContent;

    // Replace \n with <br> to create line breaks in the HTML
    const formattedHadith = hadith.replace(/\n/g, "<br>");

    container.innerHTML = `
        <h3>${title}</h3>
        <p><em>${formattedHadith}</em></p>
        <p><strong>Reference:</strong> ${reference}</p>
        <button id="copy-button">Copy</button>
    `;

    const copyButton = document.getElementById("copy-button");
    copyButton.addEventListener("click", () => copyHadithContent(title, formattedHadith, reference));
}


// Function to copy hadith content
function copyHadithContent(title, hadith, reference) {
    // Replace <br> with actual newlines for the copied content
    const formattedHadithForCopy = hadith.replace(/<br>/g, '\n');

    const contentToCopy = `${title}

${formattedHadithForCopy}

Reference:
${reference}
`;

    const textArea = document.createElement("textarea");
    textArea.value = contentToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Content copied to clipboard!");
}


// Trigger fetching
fetchHadithData();
