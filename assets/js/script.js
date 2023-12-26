// API key for Hugging Face
const apiKey = "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";
// Number of images to generate for each prompt
const maxImages = 4;
// Variable to store the selected image number (not used in the provided code)

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to disable the generate button during processing
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// Function to enable the generate button after processing
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

// Function to clear the image grid
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Function to display an enlarged image directly on the page
function displayEnlargedImage(imgUrl) {
    // Close previous preview
    closePreview();

    // Create an image element
    const enlargedImage = document.createElement("img");
    enlargedImage.src = imgUrl;
    enlargedImage.alt = "Enlarged Image";
    enlargedImage.style.width = "100%";

    // Create a close button
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.id = "closePreview";
    closeButton.className = "close";

    // Create a download button
    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = "Download";
    downloadButton.id = "download";

    // Append the download icon to the download button
    const downloadIcon = document.createElement("i");
    downloadIcon.className = "uil uil-import";
    downloadButton.appendChild(downloadIcon);

    // Event listener for the close button in the enlarged image modal
    closeButton.addEventListener('click', () => {
        closePreview();
    });

    // Event listener for the download button in the enlarged image modal
    downloadButton.addEventListener('click', () => {
        downloadEnlargedImage(imgUrl);
    });

    // Clear the content before appending new elements
    previewContainer.innerHTML = "";

    // Append elements to the preview container
    previewContainer.appendChild(enlargedImage);
    previewContainer.appendChild(closeButton);
    previewContainer.appendChild(downloadButton);

    // Show the enlarged image modal
    previewContainer.style.display = "flex";
}

// Function to close the enlarged image preview
function closePreview() {
    // Hide the enlarged image modal
    previewContainer.style.display = "none";
    // Clear the content
    previewContainer.innerHTML = "";
}

// Event listener for the "Surprise me" button
document.getElementById("surprise").addEventListener("click", function () {
    // Generate a random index to get a random text from the surpriseMe array
    const randomIndex = Math.floor(Math.random() * surpriseMe.length);
    const randomText = surpriseMe[randomIndex].Text;
    // Set the random text as the value of the user-prompt input
    document.getElementById("user-prompt").value = randomText;
});

// Function to handle displaying the error message
function showError(message) {
    // Get the error container element
    const errorContainer = document.getElementById("error-container");
    // Set the error message
    errorContainer.innerHTML = message;
    // Show the error container
    errorContainer.style.display = "block";

    // Hide the error container after a delay (adjust as needed)
    setTimeout(() => {
        errorContainer.style.display = "none";
    }, 3000);
}

// Asynchronous function to generate images based on user input
async function generateImages(input, maxImages) {
    // Disable the generate button and clear the image grid
    disableGenerateButton();
    clearImageGrid();

    // Display loading indicator
    const loading = document.getElementById("loading");
    loading.style.display = "block";

    try {
        // Loop to generate the specified number of images
        for (let i = 0; i < maxImages; i++) {
            // Generate a random number
            const randomNumber = getRandomNumber(1, 10000);
            // Create a prompt by combining the user input and the random number
            const prompt = `${input} ${randomNumber}`;

            // Make a POST request to the Hugging Face API
            const response = await fetch(
                "https://api-inference.huggingface.co/models/prompthero/openjourney",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({ inputs: prompt }),
                }
            );

            // Check if the response is successful
            if (!response.ok) {
                // Use the showError function to display a custom error message
                showError("Failed to generate image!");
                throw new Error("Failed to generate image!");
            }

            // Convert the response to a blob and create a URL for the image
            const blob = await response.blob();
            const imgUrl = URL.createObjectURL(blob);

            // Create an image element
            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = `art-${i + 1}`;
            img.style.cursor = "pointer"; // Indicate it's clickable

            // Attach an event listener to display the enlarged image on click
            img.addEventListener("click", () => displayEnlargedImage(imgUrl));

            // Append the image to the image grid
            document.getElementById("image-grid").appendChild(img);
        }
    } catch (error) {
        // Call your custom showError function instead of logging to the console
        showError("An error occurred while generating images");
    } finally {
        // Hide the loading indicator and enable the generate button
        loading.style.display = "none";
        enableGenerateButton();
        // Reset the selected image number (not used in the provided code)
        selectedImageNumber = null;
    }
}

// Event listener for the "Generate Images" button
document.getElementById("generate").addEventListener("click", () => {
    // Get user input and the maximum number of images from the input fields
    const input = document.getElementById("user-prompt").value;
    const maxImages = parseInt(document.getElementById("imageCount").value, 10);

    // Log the number of images to be generated (you can remove this line)
    console.log(`Generating ${maxImages} images`);
    // Call the generateImages function with the user input and maximum number of images
    generateImages(input, maxImages);
});

// Event listener for the ENTER key in the input field
document.getElementById("user-prompt").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // Prevent the default behavior of the ENTER key (form submission)
        event.preventDefault();

        // Get user input and the maximum number of images from the input fields
        const input = document.getElementById("user-prompt").value;
        const maxImages = parseInt(document.getElementById("imageCount").value, 10);

        // Log the number of images to be generated (you can remove this line)
        console.log(`Generating ${maxImages} images`);
        // Call the generateImages function with the user input and maximum number of images
        generateImages(input, maxImages);
    }
});

// Function to handle image download in the enlarged image modal
function downloadEnlargedImage(imgUrl) {
    // Create a link element
    const link = document.createElement("a");
    // Set the href attribute to the image URL
    link.href = imgUrl;

    // Set filename for the downloaded image
    const filename = `*.jpg`;
    link.download = filename;

    // Trigger the download
    link.click();
}

// Get the preview container element
const previewContainer = document.getElementById("preview-container");

// Event listener for the close button in the enlarged image modal
document.getElementById("closePreview").addEventListener('click', closePreview);

// Event listener for the download button in the enlarged image modal
document.getElementById("download").addEventListener('click', () => {
    // Call the downloadEnlargedImage function with the source URL of the image
    downloadEnlargedImage(document.getElementById("img01").src);
});