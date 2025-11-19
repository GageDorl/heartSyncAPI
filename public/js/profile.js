import { renderHeader, showNotification } from "../partials/header";
import { fetchRelationship, fetchCurrentUser, updateUser, getUserInfo } from "./fetch-data.mjs";


document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    renderProfileInfo(user);
    renderRelationshipInfo(user);
});


async function renderProfileInfo(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-timezone').textContent = user.timezone;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-id').textContent = user._id;

    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-timezone').value = user.timezone;
    return user;
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

    const response = await updateUser({ name, timezone });

    if (response.ok) {
        editForm.classList.add('hidden');
        profileDetails.classList.remove('hidden');
        renderProfileInfo();
    } else {
        console.error('Failed to update profile');
        showNotification("Failed to update profile", true);
    }
});

async function renderRelationshipInfo(user) {
    const relationship = await fetchRelationship(user);
    if(relationship) {
        displayRelationship(user, relationship);
    } else {
        document.getElementById('relationship-status').textContent = 'You are not in a relationship. Start one now!';
        document.getElementById('request-relationship-form').classList.remove('hidden');
    }
}

async function displayRelationship(user, relationship) {
    const otherUser = await getUserInfo(relationship.user2 == user._id ? relationship.user1 : relationship.user2);
    if(relationship.status == 'accepted') {
        document.getElementById('relationship-status').textContent = 'You are in a relationship!';
        document.getElementById('partner-name').textContent = relationship.partnerName;
        document.getElementById('partner-email').textContent = relationship.partnerEmail;
        document.getElementById('partner-info').classList.remove('hidden');
    } else if(relationship.status == 'pending') {
        if(user._id == relationship.user1) {
            document.getElementById('relationship-status').textContent = 'Your relationship is pending acceptance.';
            document.getElementById('pending-request').classList.remove('hidden');
        } 
        if(user._id == relationship.user2) {
            document.getElementById('relationship-status').textContent = 'You have a pending relationship request.';
            document.getElementById('requester-email').textContent = otherUser.email;
            document.getElementById('incoming-request').setAttribute('data-relationship-id', relationship._id);
            document.getElementById('incoming-request').classList.remove('hidden');
        }
    }
}



async function requestRelationship(user, partnerEmail) {
    const response = await fetch('/api/relationships/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user1: user._id, user2Email: partnerEmail })
    });

    if (response.ok) {
        const relationship = await response.json();
        displayRelationship(user, relationship);
    } else {
        console.error(`Failed to send relationship request: ${JSON.stringify(await response.json())}`);
        showNotification("Failed to send relationship request", true);
    }
}

const requestForm = document.getElementById('request-relationship-form');
requestForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const partnerEmail = document.getElementById('partner-email-input').value;
    const user = await renderProfileInfo();
    requestRelationship(user, partnerEmail);
});

const acceptBtn = document.getElementById('accept-request-btn');
const declineBtn = document.getElementById('decline-request-btn');

async function respondToRequest(user, relationshipId, choice) {
    const response = await fetch(`/api/relationships/${user._id}/${relationshipId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: choice })
    });

    if (response.ok) {
        const updatedRelationship = await response.json();
        displayRelationship(user, updatedRelationship);
    } else {
        console.error('Failed to respond to relationship request');
        showNotification("Failed to respond to relationship request", true);
    }
}

acceptBtn.addEventListener('click', async () => {
    const user = await renderProfileInfo();
    const relationshipId = document.getElementById('incoming-request').getAttribute('data-relationship-id');
    respondToRequest(user, relationshipId, 'accepted');
});

declineBtn.addEventListener('click', async () => {
    const user = await renderProfileInfo();
    const relationshipId = document.getElementById('incoming-request').getAttribute('data-relationship-id');
    respondToRequest(user, relationshipId, 'blocked');
});
