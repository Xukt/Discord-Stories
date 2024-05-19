/**
 * @name DiscordStories
 * @version 1.0.0 Alpha
 * @description A plugin to add Snapchat-like stories to Discord. (THIS IS IN VERY VERY EARLY STAGES AND A LOT OF BUGS ARE EXPECTED!)
 * @github https://github.com/Xukt/Discord-Stories
 * @author xkt
 */

module.exports = class SnapchatStories {
    constructor() { }

    
        load() { }
    
        start() {
            this.initialize();
        }
    
        stop() {
            this.cleanup();
        }
    
        initialize() {
            // Add buttons to the UI
            this.createUploadButton();
            this.createViewButton();
        }
    
        createUploadButton() {
            const uploadButton = document.createElement("button");
            uploadButton.innerText = "Upload Story";
            uploadButton.className = "snapchat-stories-upload-button";
            document.body.appendChild(uploadButton);
        
            uploadButton.addEventListener("click", this.uploadStory);
            console.log("Upload button created.");
          }
      

    createViewButton() {
        const viewButton = document.createElement("button");
        viewButton.innerText = "View Stories";
        viewButton.className = "snapchat-stories-view-button";
        document.body.appendChild(viewButton);

        viewButton.addEventListener("click", () => this.viewStories());
    }


    async uploadToGitHub(file) {
        try {
            const base64Image = await this.convertImageToBase64(file);
            const githubToken = "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"; // Replace with your GitHub token
            const owner = "2389751894872jn1s8h1m12"; // Replace with your GitHub username
            const repo = "902314828uijf1892du213"; // Replace with your repository name
            const path = "images/" + file.name; // Adjust the path as needed
            const commitMessage = "Upload image " + file.name;

            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
                method: "PUT",
                headers: {
                    Authorization: `token ${githubToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: base64Image,
                    branch: "main" // Adjust if you are using a different branch
                })
            });

            if (!response.ok) {
                throw new Error("Failed to upload image to GitHub: " + response.statusText);
            }

            const responseData = await response.json();
            console.log("Image uploaded to GitHub:", responseData);
            BdApi.UI.showToast("Image uploaded! Users might need to re-open discord to see any updates!");
        } catch (error) {
            console.error("Error uploading image to GitHub:", error);
            throw error; // Propagate the error to handle it appropriately
        }
    }
    
    uploadStory = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
      
        document.body.appendChild(input);
      
        input.addEventListener("change", async () => {
          const file = input.files[0];
          try {
            await this.uploadToGitHub(file);
            console.log("Image uploaded to GitHub successfully.");
          } catch (error) {
            console.error("Error uploading image to GitHub:", error);
          }
        });
      
        input.click();
        document.body.removeChild(input);
      }
    
    async viewStories() {
        try {
            const response = await fetch("https://api.github.com/repos/2389751894872jn1s8h1m12/902314828uijf1892du213/contents/images");
            if (!response.ok) {
                throw new Error("Failed to fetch stories from GitHub.");
            }
            
            const data = await response.json();
            
            const storiesContainer = document.createElement("div");
            storiesContainer.className = "snapchat-stories-container";
            document.body.appendChild(storiesContainer);
            
            let currentIndex = 0;
    
            const updateStoryView = () => {
                storiesContainer.innerHTML = '';
    
                const storyElement = document.createElement("img");
                storyElement.src = data[currentIndex].download_url;
                storyElement.className = "snapchat-story";
                storiesContainer.appendChild(storyElement);
                
                const usernameLabel = document.createElement("div");
                usernameLabel.className = "snapchat-story-username";
                usernameLabel.innerText = `Uploaded by: ${data[currentIndex].uploader_username}`;
                storiesContainer.appendChild(usernameLabel);
    
                const closeButton = document.createElement("button");
                closeButton.innerText = "×";
                closeButton.className = "snapchat-stories-close-button";
                closeButton.addEventListener("click", () => {
                    storiesContainer.remove();
                });
                storiesContainer.appendChild(closeButton);
    
                const prevButton = document.createElement("button");
                prevButton.innerText = "<";
                prevButton.className = "snapchat-stories-nav-button snapchat-stories-prev-button";
                prevButton.addEventListener("click", () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateStoryView();
                    }
                });
                storiesContainer.appendChild(prevButton);
    
                const nextButton = document.createElement("button");
                nextButton.innerText = ">";
                nextButton.className = "snapchat-stories-nav-button snapchat-stories-next-button";
                nextButton.addEventListener("click", () => {
                    if (currentIndex < data.length - 1) {
                        currentIndex++;
                        updateStoryView();
                    }
                });
                storiesContainer.appendChild(nextButton);
            };
    
            updateStoryView();
        } catch (error) {
            console.error("Error fetching stories:", error);
        }
    }
    
    
    


    async convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }


    

    cleanup() {
        // Remove any added buttons or elements from the UI
        const uploadButton = document.querySelector(".snapchat-stories-upload-button");
        if (uploadButton) uploadButton.remove();

        const viewButton = document.querySelector(".snapchat-stories-view-button");
        if (viewButton) viewButton.remove();
    }
};


// Add custom styles to the plugin
const style = document.createElement('style');
style.innerHTML = `
.snapchat-stories-upload-button,
.snapchat-stories-view-button {
    position: fixed;
    bottom: 10px;
    right: 10px;
    padding: 10px 20px;
    margin: 5px;
    background-color: #7289da;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.snapchat-stories-view-button {
    bottom: 50px;
}

.snapchat-stories-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}

.snapchat-story-wrapper {
    margin: 10px 0;
    text-align: center;
}

.snapchat-story-username {
    color: white;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
}

.snapchat-story {
    max-width: 90%;
    max-height: 80%;
    border: 5px solid white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.snapchat-stories-close-button {
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    font-size: 20px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
}

.snapchat-stories-nav-button {
    position: fixed;
    top: 50%;
    padding: 10px;
    font-size: 20px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    user-select: none;
}

.snapchat-stories-prev-button {
    left: 10px;
}

.snapchat-stories-next-button {
    right: 10px;
}
`;
document.head.appendChild(style);
