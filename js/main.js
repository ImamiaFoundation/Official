// Your GitHub token (replace with your actual token)
const token1 = "ghp_q3mmOxJa";
const token2 = "pX5EUstNhwRohQlRbYm2Fz";
const token3 = "2Xl2Qb";
const token = `${token1}${token2}${token3}`; // Full GitHub token

const repo = "ImamiaFoundation/Official";
const folder = "Json";
const apiUrl = `https://api.github.com/repos/${repo}/contents/${folder}`;

// Base URL for images
const imageBaseUrl = "https://raw.githubusercontent.com/ImamiaFoundation/Official/main/";

// Fetch JSON files from the GitHub repository
async function fetchJsonFiles() {
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `token ${token}`
        }
    });
    const data = await response.json();
    return data.filter(file => file.name.endsWith(".json"));
}
async function displayJsonFiles() {
    const jsonFiles = await fetchJsonFiles();
    const container = document.getElementById("jsonFilesContainer");

    jsonFiles.forEach(file => {
        const fileElement = document.createElement("div");
        fileElement.classList.add("json-file");

        // Remove the file extension from the displayed name
        const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        const title = document.createElement("p");
        title.innerText = fileNameWithoutExtension;
        fileElement.appendChild(title);

        // Redirect to files.html with the selected file's name when the file is clicked
        // fileElement.addEventListener('click', () => {
        //     // Pass the full file name (with extension) to the URL
        //     window.location.href = `files.html?file=${encodeURIComponent(file.name)}`;
        // });

        // Fetch JSON data to create dropdowns
        fetch(file.download_url)
            .then(response => response.json())
            .then(jsonData => {
                if (jsonData.dropdowns) {
                    const dropdownContainer = document.createElement("div");
                    dropdownContainer.classList.add("dropdown-container");

                    const dropdownList = document.createElement("ul");
                    dropdownList.classList.add("dropdown-list");

                    // Create dropdown list items
                    jsonData.dropdowns.forEach(option => {
                        const listItem = document.createElement("li");
                        listItem.innerText = option;

                        // Redirect to files.html with both file name and subcategory (option) when option is clicked
                        listItem.addEventListener('click', event => {
                            event.stopPropagation(); // Prevent file click event
                            const fileName = encodeURIComponent(file.name);
                            const subcategory = encodeURIComponent(option);
                            window.location.href = `files.html?file=${fileName}&subcategory=${subcategory}`;
                        });

                        dropdownList.appendChild(listItem);
                    });

                    dropdownContainer.appendChild(dropdownList);
                    fileElement.appendChild(dropdownContainer);
                }
            });

        container.appendChild(fileElement);
    });
}

// Initialize by displaying the JSON files

// Filter metadata based on the selected subcategory
function filterBySubcategory(subcategory, metadata) {
    const filteredItems = metadata.filter(item => item.subcategory === subcategory);
    displayMetadata(filteredItems);
}

// Display filtered metadata items
function displayMetadata(metadata) {
    const contentContainer = document.getElementById("contentContainer");
    contentContainer.innerHTML = ''; // Clear previous content

    metadata.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("metadata-item");

        // Construct image URL based on the image path
        const imageUrl = `${imageBaseUrl}${item.imagePath}`;

        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = item.title;

        // Add event listener to image for fetching respective data
        image.addEventListener('click', () => {
            // Call displaySpecificData when image is clicked
            displaySpecificData(item);
        });

        const textContainer = document.createElement("div");

        const title = document.createElement("h4");
        title.innerText = item.title;

        const description = document.createElement("p");
        description.innerText = item.description;

        textContainer.appendChild(title);
        textContainer.appendChild(description);

        itemElement.appendChild(image);
        itemElement.appendChild(textContainer);

        contentContainer.appendChild(itemElement);
    });
}

// Display more specific data for a clicked image (if needed)
function displaySpecificData(item) {
    const contentContainer = document.getElementById("contentContainer");
    contentContainer.innerHTML = ''; // Clear current content

    // Create a detailed view for the selected image
    const detailedView = document.createElement("div");
    detailedView.classList.add("detailed-view");
    
    const title = document.createElement("h4");
    title.innerText = item.title;
    detailedView.appendChild(title);
    
    const timestamp = document.createElement("p");
    timestamp.innerText = `Timestamp: ${item.timestamp}`;
    detailedView.appendChild(timestamp);

    // Add image, title, timestamp, description, and file paths to detailed view
    const imageUrl = `${imageBaseUrl}${item.imagePath}`;
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = item.title;
    detailedView.appendChild(image);

    const description = document.createElement("p");
    description.innerText = item.description;
    detailedView.appendChild(description);

    const filePathsTitle = document.createElement("h5");
    filePathsTitle.innerText = "\nDownloads:";
    detailedView.appendChild(filePathsTitle);

    item.filePaths.forEach(filePath => {
        const fileLink = document.createElement("a");
        fileLink.href = `${imageBaseUrl}${filePath}`;
        fileLink.innerText = filePath;
        fileLink.target = "_blank"; // Opens in a new tab
        detailedView.appendChild(fileLink);
        detailedView.appendChild(document.createElement("br")); // Line break
    });

    // Append the detailed view to the container
    contentContainer.appendChild(detailedView);
}

// Initialize by displaying the JSON files
displayJsonFiles();
