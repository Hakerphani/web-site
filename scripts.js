// Sample video data (replace with your videos)
const videos = [
    {
        id: 1,
        title: "cyber security",
        thumbnail: "t/thumb1.png",
        src: "/video1.mp4",
        description: "A fun trip to the beach!",
        duration: "4:15",
        category: "music",
        likes: 0,
        comments: ["Great video!", "Loved the beach vibes!"]
    },
    {
        id: 2,
        title: "overthewire levels",
        thumbnail: "thumbnails/thumb1.png",
        src: "videos/video1.mp4",
        description: "Learn to make pasta from scratch.",
        duration: "6:30",
        category: "tutorials",
        likes: 0,
        comments: ["Super helpful!", "Can't wait to try this!"]
    }
];

// Populate video grid
function populateVideoGrid(filteredVideos = videos) {
    const videoGrid = document.getElementById('video-grid');
    if (videoGrid) {
        videoGrid.innerHTML = '';
        filteredVideos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden';
            videoCard.innerHTML = `
                <a href="video.html?id=${video.id}">
                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover lazy-load">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold">${video.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">${video.description}</p>
                        <span class="text-gray-500 dark:text-gray-500 text-sm">${video.duration}</span>
                    </div>
                </a>
            `;
            videoGrid.appendChild(videoCard);
        });
        lazyLoadImages();
    }
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img.lazy-load');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-load');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => observer.observe(img));
}

// Populate video player
function populateVideoPlayer() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'));
    const video = videos.find(v => v.id === videoId);
    if (video) {
        document.getElementById('video-source').src = video.src;
        const player = document.getElementById('video-player');
        player.load();
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-description').textContent = video.description;
        document.getElementById('like-count').textContent = video.likes;
        populateComments(video.comments);
        populateRelatedVideos(videoId);
        setupVideoProgress(player);
        setupKeyboardShortcuts(player);
        setupLikeButton(video);
    }
}

// Populate related videos
function populateRelatedVideos(currentVideoId) {
    const relatedVideos = videos.filter(v => v.id !== currentVideoId);
    const relatedContainer = document.getElementById('related-videos');
    if (relatedContainer) {
        relatedContainer.innerHTML = '';
        relatedVideos.forEach(video => {
            const relatedCard = document.createElement('div');
            relatedCard.className = 'flex space-x-2';
            relatedCard.innerHTML = `
                <a href="video.html?id=${video.id}" class="flex space-x-2">
                    <img src="${video.thumbnail}" alt="${video.title}" class="w-24 h-14 object-cover rounded">
                    <div>
                        <h3 class="text-sm font-semibold">${video.title}</h3>
                        <span class="text-gray-500 dark:text-gray-500 text-xs">${video.duration}</span>
                    </div>
                </a>
            `;
            relatedContainer.appendChild(relatedCard);
        });
    }
}

// Populate comments
function populateComments(comments) {
    const commentsContainer = document.getElementById('comments');
    if (commentsContainer) {
        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.textContent = comment;
            commentsContainer.appendChild(commentDiv);
        });
    }
}

// Setup video progress bar
function setupVideoProgress(player) {
    const progress = document.getElementById('progress');
    player.addEventListener('timeupdate', () => {
        const percent = (player.currentTime / player.duration) * 100;
        progress.style.width = `${percent}%`;
    });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts(player) {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return; // Ignore inputs
        if (e.code === 'Space') {
            e.preventDefault();
            player.paused ? player.play() : player.pause();
        }
    });
}

// Setup like button
function setupLikeButton(video) {
    const likeBtn = document.getElementById('like-btn');
    const likeCount = document.getElementById('like-count');
    likeBtn.addEventListener('click', () => {
        video.likes++;
        likeCount.textContent = video.likes;
    });
}

// Sidebar toggle
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Theme toggle
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Search functionality
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filteredVideos = videos.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.description.toLowerCase().includes(query)
    );
    populateVideoGrid(filteredVideos);
});

// Category filter
function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            const filteredVideos = category === 'all' ? videos : videos.filter(video => video.category === category);
            populateVideoGrid(filteredVideos);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    if (document.getElementById('video-grid')) {
        populateVideoGrid();
        setupCategoryFilter();
    }
    if (document.getElementById('video-player')) {
        populateVideoPlayer();
    }
});
