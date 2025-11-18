import { renderHeader } from "../partials/header";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderProfileInfo();
});

async function renderProfileInfo() {
    const userInfo = await fetch('/api/users/current');
    const user = await userInfo.json();
    console.log(user);
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-timezone').textContent = user.timezone;
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-timezone').value = user.timezone;
}

const editButton = document.getElementById('edit-profile-btn');
const profileDetails = document.querySelector('.profile-display');
const editForm = document.getElementById('edit-profile');
const saveButton = document.querySelector('.save-profile-btn');
const cancelButton = document.querySelector('.cancel-edit-btn');
editButton.addEventListener('click', () => {
    profileDetails.classList.add('hidden');
    editForm.classList.remove('hidden');
});

cancelButton.addEventListener('click', () => {
    editForm.classList.add('hidden');
    profileDetails.classList.remove('hidden');
    renderProfileInfo();
});

saveButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const name = document.getElementById('edit-name').value;
    const timezone = document.getElementById('edit-timezone').value;

    const response = await fetch('/api/users/current', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, timezone })
    });

    if (response.ok) {
        editForm.classList.add('hidden');
        profileDetails.classList.remove('hidden');
        renderProfileInfo();
    } else {
        console.error('Failed to update profile');
    }
});
