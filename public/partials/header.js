import { fetchCurrentUser } from '../js/fetch-data.mjs';

const header = `
<header>
    <div class="header-content">
        <h3 class="logo"><a href="/"><img src="/images/heart-logo.svg" alt="HeartSync Logo">HeartSync</a></h3>
        <div class="mobile-menu-toggle">☰</div>
    </div>
    <nav>
        <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/activities">Activities</a></li>
            <li><a href="/letters">Letters</a></li>
            <li><a href="/checkins">Check-ins</a></li>
            <li><a href="/stats">Stats</a></li>
            <li><a href="/profile">Profile</a></li>
        </ul>
    </nav>
</header>
<div id="notification" class="notification hidden"></div>
`;

export async function renderHeader() {
    const user = await fetchCurrentUser();
    const rootStyles = getComputedStyle(document.documentElement);
    const rootElement = document.documentElement;
    rootElement.style.setProperty('--base-hue', user.baseHue || '343');
    rootElement.style.setProperty('--middle-tone', (user.baseLightness || '70') + '%');
    if (user.baseLightness<=50) {
        rootElement.style.setProperty('--text-color', '#ffffff');
        rootElement.classList.add('dark-text');
    }
    document.body.insertAdjacentHTML('afterbegin', header);
    document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
        document.querySelector('nav').classList.toggle('open');
    });
    let path = window.location.pathname;
    console.log("Current path:", path);
    let navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') == path) {
            link.classList.add('active');
        }
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