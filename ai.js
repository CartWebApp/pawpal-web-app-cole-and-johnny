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
// Activity type emojis
const activityIcons = {
    'Walk': '🚶',
    'Fed': '🍽️',
    'Play': '🎾',
    'Vet': '💉',
    'Grooming': '✂️',
    'Training': '📚',
    'Bath': '🛁',
    'Medicine': '💊',
    'Other': '📝'
};

// Initialize activity log if on page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('recentActivities')) {
        loadActivities();
    }
});

function addActivity() {
    const activityType = document.getElementById('activityType').value;
    const activityDetails = document.getElementById('activityDetails').value.trim();
    
    if (!activityType) {
        alert('Please select an activity type');
        return;
    }
    
    const now = new Date();
    const activity = {
        id: Date.now(),
        type: activityType,
        details: activityDetails || activityType,
        timestamp: now.toISOString(),
        dateStr: now.toLocaleDateString(),
        timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Get existing activities
    let activities = JSON.parse(localStorage.getItem('petActivities') || '[]');
    activities.unshift(activity); // Add to beginning
    
    // Keep only last 100 activities
    if (activities.length > 100) {
        activities = activities.slice(0, 100);
    }
    
    localStorage.setItem('petActivities', JSON.stringify(activities));
    
    // Clear form
    document.getElementById('activityType').value = '';
    document.getElementById('activityDetails').value = '';
    
    // Reload activities
    loadActivities();
}

function loadActivities() {
    const activities = JSON.parse(localStorage.getItem('petActivities') || '[]');
    
    const recentContainer = document.getElementById('recentActivities');
    const upcomingContainer = document.getElementById('upcomingActivities');
    
    if (!recentContainer || !upcomingContainer) return;
    
    // Clear existing
    recentContainer.innerHTML = '';
    upcomingContainer.innerHTML = '';
    
    const now = new Date();
    const recentActivities = [];
    const upcomingActivities = [];
    
    // Get scheduled events from calendar
    const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    
    // Separate upcoming events (future dates)
    calendarEvents.forEach(event => {
        const eventDate = new Date(event.date + (event.time ? ' ' + event.time : ''));
        if (eventDate > now) {
            upcomingActivities.push({
                type: 'Scheduled',
                details: event.name,
                timestamp: eventDate.toISOString(),
                dateStr: eventDate.toLocaleDateString(),
                timeStr: event.time || 'All day',
                isScheduled: true
            });
        }
    });
    
    // Sort upcoming by date
    upcomingActivities.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Get recent activities (completed)
    activities.forEach(activity => {
        recentActivities.push(activity);
    });
    
    // Render recent activities
    if (recentActivities.length === 0) {
        recentContainer.innerHTML = '<div class="empty-state">No recent activities</div>';
    } else {
        recentActivities.slice(0, 20).forEach(activity => {
            const activityEl = createActivityElement(activity, false);
            recentContainer.appendChild(activityEl);
        });
    }
    
    // Render upcoming activities
    if (upcomingActivities.length === 0) {
        upcomingContainer.innerHTML = '<div class="empty-state">No upcoming activities</div>';
    } else {
        upcomingActivities.slice(0, 10).forEach(activity => {
            const activityEl = createActivityElement(activity, true);
            upcomingContainer.appendChild(activityEl);
        });
    }
}

function createActivityElement(activity, isUpcoming) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    
    const icon = document.createElement('div');
    icon.className = 'activity-icon';
    icon.textContent = activityIcons[activity.type] || '📝';
    
    const content = document.createElement('div');
    content.className = 'activity-content';
    
    const name = document.createElement('div');
    name.className = 'activity-name';
    name.textContent = activity.details;
    
    const time = document.createElement('div');
    time.className = 'activity-time';
    time.textContent = activity.timeStr;
    
    content.appendChild(name);
    content.appendChild(time);
    
    div.appendChild(icon);
    div.appendChild(content);
    
    // Add delete button only for non-scheduled activities
    if (!isUpcoming && !activity.isScheduled) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-activity';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            deleteActivity(activity.id);
        };
        div.appendChild(deleteBtn);
    }
    
    return div;
}

function deleteActivity(activityId) {
    if (confirm('Delete this activity?')) {
        let activities = JSON.parse(localStorage.getItem('petActivities') || '[]');
        activities = activities.filter(a => a.id !== activityId);
        localStorage.setItem('petActivities', JSON.stringify(activities));
        loadActivities();
    }
}
let currentDataFilter = 'week';

// Initialize data page if present
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('activityChart')) {
        initActivityData();
    }
});

function initActivityData() {
    renderActivityChart(currentDataFilter);
    updateStatCards();
}

function setDataFilter(filter) {
    currentDataFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderActivityChart(filter);
}

function renderActivityChart(filter) {
    const activities = JSON.parse(localStorage.getItem('petActivities') || '[]');
    const chartContainer = document.getElementById('activityChart');
    
    if (!chartContainer) return;
    
    // Clear existing chart
    chartContainer.innerHTML = '';
    
    // Add Y-axis
    const yAxis = document.createElement('div');
    yAxis.className = 'y-axis';
    yAxis.innerHTML = `
        <div class="y-axis-title">Activities</div>
        <div class="y-axis-label">10</div>
        <div class="y-axis-label">8</div>
        <div class="y-axis-label">6</div>
        <div class="y-axis-label">4</div>
        <div class="y-axis-label">2</div>
        <div class="y-axis-label">0</div>
    `;
    chartContainer.appendChild(yAxis);
    
    // Get data based on filter
    let chartData = [];
    const now = new Date();
    
    if (filter === 'week') {
        // Last 7 days
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay()];
            const count = activities.filter(a => {
                const actDate = new Date(a.timestamp);
                return actDate.toDateString() === date.toDateString();
            }).length;
            chartData.push({ label: dayName, value: count });
        }
    } else if (filter === 'month') {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now);
            weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
            const weekEnd = new Date(now);
            weekEnd.setDate(weekEnd.getDate() - (i * 7));
            
            const count = activities.filter(a => {
                const actDate = new Date(a.timestamp);
                return actDate >= weekStart && actDate <= weekEnd;
            }).length;
            
            chartData.push({ 
                label: `Week ${4-i}`, 
                value: count 
            });
        }
    } else if (filter === 'year') {
        // Last 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(date.getMonth() - i);
            const monthName = months[date.getMonth()];
            
            const count = activities.filter(a => {
                const actDate = new Date(a.timestamp);
                return actDate.getMonth() === date.getMonth() && 
                       actDate.getFullYear() === date.getFullYear();
            }).length;
            
            chartData.push({ label: monthName, value: count });
        }
    }
    
    // Find max value for scaling
    const maxValue = Math.max(...chartData.map(d => d.value), 10);
    
    // Create bars
    chartData.forEach(data => {
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const heightPercent = (data.value / maxValue) * 100;
        bar.style.height = `${Math.max(heightPercent, 5)}%`;
        
        if (data.value > 0) {
            const valueLabel = document.createElement('div');
            valueLabel.className = 'bar-value';
            valueLabel.textContent = data.value;
            bar.appendChild(valueLabel);
        }
        
        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = data.label;
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chartContainer.appendChild(barContainer);
    });
}

function updateStatCards() {
    const activities = JSON.parse(localStorage.getItem('petActivities') || '[]');
    
    // Count activities by type
    const walkCount = activities.filter(a => a.type === 'Walk').length;
    const fedCount = activities.filter(a => a.type === 'Fed').length;
    const medicineCount = activities.filter(a => a.type === 'Medicine').length;
    
    // Update stat cards
    const walkCard = document.querySelector('[data-stat="walking"]');
    const feedCard = document.querySelector('[data-stat="feeding"]');
    const medicineCard = document.querySelector('[data-stat="medicine"]');
    
    if (walkCard) {
        walkCard.querySelector('.stat-value').textContent = walkCount;
    }
    if (feedCard) {
        feedCard.querySelector('.stat-value').textContent = fedCount;
    }
    if (medicineCard) {
        medicineCard.querySelector('.stat-value').textContent = medicineCount;
    }
}

function toggleStatCard(card) {
    // Remove active from all cards
    document.querySelectorAll('.stat-card').forEach(c => {
        c.classList.remove('active');
    });
    
    // Add active to clicked card
    card.classList.add('active');
    
    // You could filter the chart based on this selection
    const statType = card.dataset.stat;
    console.log('Selected stat:', statType);
}

let gameCanvas, gameCtx;
let gameRunning = false;
let gameScore = 0;
let gameHighScore = 0;
let gameBestScore = 0;

let pet = {
    x: 100,
    y: 200,
    width: 50,
    height: 50,
    velocity: 0,
    gravity: 0.06,
    jump: -3,
    image: null
};

let pipes = [];
let frameCount = 0;
const pipeGap = 200;
const pipeWidth = 60;
const pipeSpeed = 2;

// Initialize game if on game page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('gameCanvas')) {
        initFlappyGame();
    }
});

function initFlappyGame() {
    gameCanvas = document.getElementById('gameCanvas');
    gameCtx = gameCanvas.getContext('2d');
    
    // Load high scores
    gameHighScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
    gameBestScore = parseInt(localStorage.getItem('flappyBestScore')) || 0;
    updateGameStats();
    
    // Load pet image
    loadPetImage();
    
    // Event listeners
    gameCanvas.addEventListener('click', () => {
        if (gameRunning) {
            pet.velocity = pet.jump;
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameRunning) {
            e.preventDefault();
            pet.velocity = pet.jump;
        }
    });
}

function loadPetImage() {
    const savedPetImage = localStorage.getItem('petImage_0');
    
    if (savedPetImage) {
        pet.image = new Image();
        pet.image.src = savedPetImage;
        pet.image.onload = function() {
            // Image loaded successfully
        };
    } else {
        // Create a default pet circle if no image
        pet.image = null;
    }
}

function startGame() {
    // Reset game state
    gameRunning = true;
    gameScore = 0;
    frameCount = 0;
    pipes = [];
    pet.y = 200;
    pet.velocity = 0;
    
    // Hide overlay
    document.getElementById('gameOverlay').classList.add('hidden');
    
    // Start game loop
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Draw background
    drawBackground();
    
    // Update and draw pet
    updatePet();
    drawPet();
    
    // Update and draw pipes
    updatePipes();
    drawPipes();
    
    // Draw score
    drawScore();
    
    // Check collisions
    checkCollisions();
    
    frameCount++;
    requestAnimationFrame(gameLoop);
}

function drawBackground() {
    // Sky gradient
    const gradient = gameCtx.createLinearGradient(0, 0, 0, gameCanvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    gameCtx.fillStyle = gradient;
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Ground
    gameCtx.fillStyle = '#8fb996';
    gameCtx.fillRect(0, gameCanvas.height - 50, gameCanvas.width, 50);
}

function updatePet() {
    pet.velocity += pet.gravity;
    pet.y += pet.velocity;
    
    // Keep pet on screen
    if (pet.y < 0) pet.y = 0;
    if (pet.y > gameCanvas.height - 50 - pet.height) {
        pet.y = gameCanvas.height - 50 - pet.height;
        endGame();
    }
}

function drawPet() {
    if (pet.image && pet.image.complete) {
        // Draw pet image in circular clip
        gameCtx.save();
        gameCtx.beginPath();
        gameCtx.arc(pet.x + pet.width/2, pet.y + pet.height/2, pet.width/2, 0, Math.PI * 2);
        gameCtx.closePath();
        gameCtx.clip();
        gameCtx.drawImage(pet.image, pet.x, pet.y, pet.width, pet.height);
        gameCtx.restore();
        
        // Draw border
        gameCtx.strokeStyle = '#fff';
        gameCtx.lineWidth = 3;
        gameCtx.beginPath();
        gameCtx.arc(pet.x + pet.width/2, pet.y + pet.height/2, pet.width/2, 0, Math.PI * 2);
        gameCtx.stroke();
    } else {
        // Draw default circle
        gameCtx.fillStyle = '#ff9999';
        gameCtx.beginPath();
        gameCtx.arc(pet.x + pet.width/2, pet.y + pet.height/2, pet.width/2, 0, Math.PI * 2);
        gameCtx.fill();
        
        gameCtx.strokeStyle = '#fff';
        gameCtx.lineWidth = 3;
        gameCtx.stroke();
    }
}

function updatePipes() {
    // Add new pipe every 90 frames
    if (frameCount % 90 === 0) {
        const minHeight = 50;
        const maxHeight = gameCanvas.height - 50 - pipeGap - 50;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        
        pipes.push({
            x: gameCanvas.width,
            topHeight: topHeight,
            scored: false
        });
    }
    
    // Move pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;
        
        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }
        
        // Score point
        if (!pipe.scored && pipe.x + pipeWidth < pet.x) {
            pipe.scored = true;
            gameScore++;
            
            // Update high score
            if (gameScore > gameHighScore) {
                gameHighScore = gameScore;
                localStorage.setItem('flappyHighScore', gameHighScore);
            }
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        gameCtx.fillStyle = '#2d5016';
        gameCtx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        gameCtx.strokeStyle = '#1a3010';
        gameCtx.lineWidth = 2;
        gameCtx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        
        // Bottom pipe
        const bottomY = pipe.topHeight + pipeGap;
        const bottomHeight = gameCanvas.height - 50 - bottomY;
        gameCtx.fillStyle = '#2d5016';
        gameCtx.fillRect(pipe.x, bottomY, pipeWidth, bottomHeight);
        gameCtx.strokeRect(pipe.x, bottomY, pipeWidth, bottomHeight);
    });
}

function drawScore() {
    gameCtx.fillStyle = 'white';
    gameCtx.font = 'bold 48px Nunito';
    gameCtx.textAlign = 'center';
    gameCtx.strokeStyle = 'black';
    gameCtx.lineWidth = 3;
    gameCtx.strokeText(gameScore, gameCanvas.width / 2, 60);
    gameCtx.fillText(gameScore, gameCanvas.width / 2, 60);
}

function checkCollisions() {
    pipes.forEach(pipe => {
        // Check collision with top pipe
        if (pet.x + pet.width > pipe.x && 
            pet.x < pipe.x + pipeWidth && 
            pet.y < pipe.topHeight) {
            endGame();
        }
        
        // Check collision with bottom pipe
        const bottomY = pipe.topHeight + pipeGap;
        if (pet.x + pet.width > pipe.x && 
            pet.x < pipe.x + pipeWidth && 
            pet.y + pet.height > bottomY) {
            endGame();
        }
    });
}

function endGame() {
    gameRunning = false;
    
    // Update best score
    if (gameScore > gameBestScore) {
        gameBestScore = gameScore;
        localStorage.setItem('flappyBestScore', gameBestScore);
    }
    
    // Show game over
    document.getElementById('finalScore').textContent = gameScore;
    document.getElementById('gameOverlay').classList.remove('hidden');
    updateGameStats();
}

function updateGameStats() {
    const currentScoreEl = document.getElementById('currentScore');
    const highScoreEl = document.getElementById('highScore');
    const bestScoreEl = document.getElementById('bestScore');
    
    if (currentScoreEl) currentScoreEl.textContent = gameScore;
    if (highScoreEl) highScoreEl.textContent = gameHighScore;
    if (bestScoreEl) bestScoreEl.textContent = gameBestScore;
}