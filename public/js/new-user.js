import { renderHeader, showNotification } from "../partials/header";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
});

const form = document.getElementById('new-user-form');
form.addEventListener('submit', createNewUser);

async function createNewUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const timezone = document.getElementById('timezone').value;
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, timezone })
    });

    if (response.ok) {
        const newUser = await response.json();
        showNotification("User created successfully!", false);
        setTimeout(() => {
            window.location.href = "/profile";
        }, 1500);
    } else {
        console.error('Error creating user:', response.statusText);
        showNotification("Error creating user. Please try again.", true);
    }
}