
  // Variables
  const username2 = "ImamiaFoundation"; // Replace with your GitHub username
  const folderPath = "Post"; // Path to the folder in the repository

  // GitHub API endpoint to list files in the folder
  const apiUrl2 = `https://api.github.com/repos/${username2}/Official/contents/${folderPath}`;

  // Fetch the list of files in the "Post" folder
  fetch(apiUrl2, {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Find an image file (filter by extension like .png, .jpg, .jpeg)
      const imageFile = data.find(file => /\.(png|jpg|jpeg|gif)$/i.test(file.name));
      
      if (imageFile) {
        // Fetch image content
        fetch(imageFile.download_url)
          .then(imgResponse => imgResponse.blob())
          .then(imgBlob => {
            const imgUrl = URL.createObjectURL(imgBlob);
            document.getElementById("repo-image").src = imgUrl;
          })
          .catch(error => {
            console.error("Error fetching the image:", error);
          });
      } else {
        console.error("No image file found in the folder.");
      }
    })
    .catch(error => {
      console.error("Error fetching the folder contents:", error);
    });