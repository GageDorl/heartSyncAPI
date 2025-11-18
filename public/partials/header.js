const header = `
<header>
    <div class="header-content">
        <h3><a href="/">HeartSync</a></h3>
        <div class="mobile-menu-toggle">☰</div>
    </div>
    <nav>
        <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/activities">Activities</a></li>
            <li><a href="/letters">Letters</a></li>
            <li><a href="/stats">Stats</a></li>
        </ul>
    </nav>
</header>`;

export function renderHeader() {
    document.body.insertAdjacentHTML('afterbegin', header);
    document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
        document.querySelector('nav').classList.toggle('open');
    });
}
