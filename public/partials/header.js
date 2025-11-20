const header = `
<header>
    <div class="header-content">
        <h3 class="logo"><a href="/"><img src="/images/heart-logo.svg" alt="HeartSync Logo">HeartSync</a></h3>
        <div class="mobile-menu-toggle">☰</div>
    </div>
    <nav>
        <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/activities">Activities</a></li>
            <li><a href="/letters">Letters</a></li>
            <li><a href="/checkins">Check-ins</a></li>
            <li><a href="/stats">Stats</a></li>
        </ul>
    </nav>
</header>
<div id="notification" class="notification hidden"></div>
`;

export function renderHeader() {
    document.body.insertAdjacentHTML('afterbegin', header);
    document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
        document.querySelector('nav').classList.toggle('open');
    });
    let link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/images/heart-logo.svg';
    document.head.appendChild(link);
}

export function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.innerHTML = `
        <p>${message}</p>
        <span class="close-btn" onclick="this.parentElement.classList.add('hidden')">&times;</span>
    `;
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    notification.classList.remove('hidden');
    notification.classList.add('fade-out');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}