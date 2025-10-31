
// Load saved images when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadSavedImages();
});

function loadSavedImages() {
    const boxes = document.querySelectorAll('.pictures');
    boxes.forEach((box, index) => {
        const savedImage = localStorage.getItem('petImage_' + index);
        if (savedImage) {
            displayImage(box, savedImage);
        }
    });
    
    // Load saved names
    const userName = localStorage.getItem('userName');
    const petName = localStorage.getItem('petName');
    
    if (userName && document.getElementById('userName')) {
        document.getElementById('userName').value = userName;
    }
    if (petName && document.getElementById('petName')) {
        document.getElementById('petName').value = petName;
    }
}

function triggerUpload(box) {
    const fileInput = box.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.click();
    }
}

function handleImageUpload(event, input) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    const reader = new FileReader();
    const box = input.parentElement;

    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Save to localStorage
        const boxes = document.querySelectorAll('.pictures');
        const boxIndex = Array.from(boxes).indexOf(box);
        localStorage.setItem('petImage_' + boxIndex, imageData);
        
        // Display the image
        displayImage(box, imageData);
    };

    reader.readAsDataURL(file);
}

function displayImage(box, imageData) {
    // Clear existing content except file input
    const existingImg = box.querySelector('img');
    const existingBtn = box.querySelector('.remove-btn');
    const existingSpan = box.querySelector('span');
    
    if (existingImg) existingImg.remove();
    if (existingBtn) existingBtn.remove();
    if (existingSpan) existingSpan.remove();
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = 'Profile photo';
    
    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.onclick = function(event) {
        event.stopPropagation();
        removeImage(this);
    };
    
    // Add elements to box
    box.appendChild(img);
    box.appendChild(removeBtn);
}

function removeImage(btn) {
    event.stopPropagation();
    const box = btn.parentElement;
    const img = box.querySelector('img');
    
    // Remove from localStorage
    const boxes = document.querySelectorAll('.pictures');
    const boxIndex = Array.from(boxes).indexOf(box);
    localStorage.removeItem('petImage_' + boxIndex);
    
    if (img) img.remove();
    btn.remove();
    
    // Reset file input
    const input = box.querySelector('input[type="file"]');
    if (input) {
        input.value = '';
    }
    
    // Restore upload text
    const span = document.createElement('span');
    span.textContent = 'Click to Upload Photo';
    box.appendChild(span);
}

function saveUserProfile() {
    const userName = document.getElementById('userName').value;
    if (userName) {
        localStorage.setItem('userName', userName);
        alert('User profile saved!');
    } else {
        alert('Please enter your name');
    }
}

function savePetProfile() {
    const petName = document.getElementById('petName').value;
    if (petName) {
        localStorage.setItem('petName', petName);
        alert('Pet profile saved!');
    } else {
        alert('Please enter your pet\'s name');
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([20, 0], 2); // Centered world view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
});
