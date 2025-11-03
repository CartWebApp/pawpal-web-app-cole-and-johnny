// Load saved images and check authentication when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadSavedImages();
    updateNavigation();
});

// Update navigation based on login status
function updateNavigation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('currentUsername');
    const profilePic = localStorage.getItem('currentProfilePic');
    
    const signupLink = document.getElementById('signupLink');
    const loginLink = document.getElementById('loginLink');
    const userProfile = document.getElementById('userProfile');
    const navUsername = document.getElementById('navUsername');
    const bidenImg = document.getElementById('biden');
    
    if (isLoggedIn && username) {
        // Hide signup/login links
        if (signupLink) signupLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';
        
        // Show user profile
        if (userProfile) {
            userProfile.style.display = 'flex';
            userProfile.style.alignItems = 'center';
            userProfile.style.gap = '8px';
        }
        if (navUsername) navUsername.textContent = username;
        
        // Update profile picture if available
        if (profilePic && bidenImg) {
            bidenImg.src = profilePic;
        }
    } else {
        // Show signup/login links
        if (signupLink) signupLink.style.display = 'inline';
        if (loginLink) loginLink.style.display = 'inline';
        
        // Hide user profile
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Handle signup form submission (for sign2.html)
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.querySelector('.first').value;
    const lastName = document.querySelector('.last').value;
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password').value;
    
    const username = firstName + ' ' + lastName;
    
    // Store user data
    const userData = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUsername', username);
    
    // Get profile picture if uploaded
    const profilePic = localStorage.getItem('petImage_0');
    if (profilePic) {
        localStorage.setItem('currentProfilePic', profilePic);
    }
    
    alert('Account created successfully!');
    window.location.href = 'index.html';
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const storedData = localStorage.getItem('userData');
    
    if (!storedData) {
        alert('No account found. Please sign up first.');
        return;
    }
    
    const userData = JSON.parse(storedData);
    
    // Check if username matches email or username
    if ((userData.email === username || userData.username === username) && userData.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUsername', userData.username);
        
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid username/email or password!');
    }
}

// Logout function
function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('currentProfilePic');
    
    alert('You have been logged out.');
    window.location.href = 'index.html';
}

// Load saved images
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
    
    if (userName && document.getElementById('username')) {
        document.getElementById('username').value = userName;
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
    const userName = document.getElementById('username').value;
    const bio = document.getElementById('bio') ? document.getElementById('bio').value : '';
    
    if (userName) {
        localStorage.setItem('userName', userName);
        
        // Update current username if logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            localStorage.setItem('currentUsername', userName);
            
            // Update userData
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.username = userName;
            if (bio) userData.bio = bio;
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update profile picture in navigation
            const profilePic = localStorage.getItem('petImage_0');
            if (profilePic) {
                localStorage.setItem('currentProfilePic', profilePic);
            }
        }
        
        alert('User profile saved!');
        updateNavigation(); // Refresh navigation
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

// Map initialization (if map element exists)
document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById('map');
    if (mapElement && typeof L !== 'undefined') {
        const map = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
});
// Check authentication status on page load
window.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});

// Update navigation based on login status
function updateNavigation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('currentUsername');
    const profilePic = localStorage.getItem('currentProfilePic');
    
    const signupLink = document.getElementById('signupLink');
    const loginLink = document.getElementById('loginLink');
    const userProfile = document.getElementById('userProfile');
    const navUsername = document.getElementById('navUsername');
    const bidenImg = document.getElementById('biden');
    
    if (isLoggedIn && username) {
        // Hide signup/login links
        if (signupLink) signupLink.style.display = 'none';
        if (loginLink) loginLink.style.display = 'none';
        
        // Show user profile
        if (userProfile) {
            userProfile.style.display = 'flex';
            userProfile.style.alignItems = 'center';
            userProfile.style.gap = '8px';
        }
        if (navUsername) navUsername.textContent = username;
        
        // Update profile picture if available
        if (profilePic && bidenImg) {
            bidenImg.src = profilePic;
        }
    } else {
        // Show signup/login links
        if (signupLink) signupLink.style.display = 'inline';
        if (loginLink) loginLink.style.display = 'inline';
        
        // Hide user profile
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Store user data (in a real app, this would be sent to a server)
    const userData = {
        username: username,
        email: email,
        password: password // In production, NEVER store plain text passwords!
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUsername', username);
    
    alert('Account created successfully!');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Retrieve stored user data
    const storedData = localStorage.getItem('userData');
    
    if (!storedData) {
        alert('No account found. Please sign up first.');
        return;
    }
    
    const userData = JSON.parse(storedData);
    
    // Validate credentials
    if (userData.email === email && userData.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUsername', userData.username);
        
        alert('Login successful!');
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password!');
    }
}

// Logout function
function logout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUsername');
    localStorage.removeItem('currentProfilePic');
    
    alert('You have been logged out.');
    window.location.href = 'index.html';
}
/* ============================================== */
/* CALENDAR FUNCTIONS - Add to ai.js             */
/* ============================================== */

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize calendar if on schedule page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calendar')) {
        initCalendar();
    }
});

function initCalendar() {
    renderCalendar(currentMonth, currentYear);
    loadEvents();
}

function renderCalendar(month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    document.getElementById('monthYear').textContent = monthNames[month] + ' ' + year;
    
    const calendarGrid = document.getElementById('calendar');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = createDayElement(daysInPrevMonth - i, month - 1, year, true);
        calendarGrid.appendChild(day);
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = createDayElement(i, month, year, false);
        calendarGrid.appendChild(day);
    }
    
    // Add next month's leading days
    const totalCells = calendarGrid.children.length - 7; // subtract headers
    const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const day = createDayElement(i, month + 1, year, true);
        calendarGrid.appendChild(day);
    }
    
    loadEvents();
}

function createDayElement(dayNum, month, year, isOtherMonth) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayDiv.classList.add('other-month');
    }
    
    // Check if today
    const today = new Date();
    if (dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayDiv.classList.add('today');
    }
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    dayDiv.dataset.date = dateStr;
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = dayNum;
    dayDiv.appendChild(dayNumber);
    
    return dayDiv;
}

function addEvent() {
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventName = document.getElementById('eventName').value;
    
    if (!eventDate || !eventName) {
        alert('Please fill in date and event name');
        return;
    }
    
    const event = {
        id: Date.now(),
        date: eventDate,
        time: eventTime || '',
        name: eventName
    };
    
    // Get existing events
    let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    events.push(event);
    localStorage.setItem('calendarEvents', JSON.stringify(events));
    
    // Clear form
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventName').value = '';
    
    // Reload events
    loadEvents();
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    // Clear existing event displays
    document.querySelectorAll('.event-item').forEach(el => el.remove());
    
    events.forEach(event => {
        const dayElement = document.querySelector(`[data-date="${event.date}"]`);
        if (dayElement) {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.title = event.name;
            
            const eventContent = document.createElement('span');
            if (event.time) {
                eventContent.innerHTML = `<span class="event-time">${event.time}</span> ${event.name}`;
            } else {
                eventContent.textContent = event.name;
            }
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-event';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = function(e) {
                e.stopPropagation();
                deleteEvent(event.id);
            };
            
            eventItem.appendChild(eventContent);
            eventItem.appendChild(deleteBtn);
            dayElement.appendChild(eventItem);
        }
    });
}

function deleteEvent(eventId) {
    if (confirm('Delete this event?')) {
        let events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
        events = events.filter(e => e.id !== eventId);
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        loadEvents();
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}