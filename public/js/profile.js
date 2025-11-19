import { renderHeader, showNotification } from "../partials/header";
import { fetchRelationship, fetchCurrentUser, updateUser, getUserInfo, requestRelationship, respondToRequest, updateRelationship } from "./fetch-data.mjs";


document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    renderProfileInfo(user);
    renderRelationshipInfo(user, relationship);

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
    const user = fetchCurrentUser();
    renderProfileInfo(user);
});

saveButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const name = document.getElementById('edit-name').value;
    const timezone = document.getElementById('edit-timezone').value;

    const response = await updateUser({ name, timezone });

    if (response.ok) {
        editForm.classList.add('hidden');
        profileDetails.classList.remove('hidden');
        const user = await fetchCurrentUser();
        renderProfileInfo(user);
    } else {
        console.error('Failed to update profile');
        showNotification("Failed to update profile", true);
    }
});

async function renderRelationshipInfo(user, relationship=null) {
    document.getElementById('request-relationship-form').classList.add('hidden');
    document.getElementById('partner-info').classList.add('hidden');
    document.getElementById('pending-request').classList.add('hidden');
    document.getElementById('incoming-request').classList.add('hidden');

    if(relationship) {
        displayRelationship(user, relationship);
    } else {
        document.getElementById('relationship-status').textContent = 'You are not in a relationship. Start one now!';
        document.getElementById('request-relationship-form').classList.remove('hidden');
    }
}

document.getElementById('anniversary-date').addEventListener('change', async (event) => {
    const newDate = new Date(`${event.target.value}T12:00:00`);
    console.log("New anniversary date selected:", newDate);
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    if(relationship && relationship.status === 'accepted') {
        relationship.anniversary = newDate;
        const updatedRelationship = await updateRelationship(user, relationship._id, { anniversary: newDate });
        console.log("Updated anniversary date:", updatedRelationship);
        renderRelationshipInfo(user, updatedRelationship);
    }
});

async function displayRelationship(user, relationship) {
    const otherUser = await getUserInfo(relationship.user2 == user._id ? relationship.user1 : relationship.user2);
    if(relationship.status == 'accepted') {
        document.getElementById('relationship-status').textContent = 'You are in a relationship!';
        document.getElementById('partner-name').textContent = otherUser.name;
        document.getElementById('partner-email').textContent = otherUser.email;
        let anniversary = relationship.anniversary ? new Date(relationship.anniversary) : null;
        let anniversaryMonth = (anniversary.getMonth() + 1).toString().padStart(2, '0');
        let anniversaryDay = anniversary.getDate().toString().padStart(2, '0');

        document.getElementById('anniversary-date').value = anniversary ? `${anniversary.getFullYear()}-${anniversaryMonth}-${anniversaryDay}` : null;
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

const requestForm = document.getElementById('request-relationship-form');
requestForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const partnerEmail = document.getElementById('partner-email-input').value;
    const user = await fetchCurrentUser();
    const relationship = await requestRelationship(user, partnerEmail);
    renderRelationshipInfo(user, relationship);
});

const acceptBtn = document.getElementById('accept-request-btn');
const declineBtn = document.getElementById('decline-request-btn');



acceptBtn.addEventListener('click', async () => {
    const user = await fetchCurrentUser();
    const relationshipId = document.getElementById('incoming-request').getAttribute('data-relationship-id');
    const updatedRelationship = await respondToRequest(user, relationshipId, 'accepted');
    renderRelationshipInfo(user, updatedRelationship);
});

declineBtn.addEventListener('click', async () => {
    const user = await fetchCurrentUser();
    const relationshipId = document.getElementById('incoming-request').getAttribute('data-relationship-id');
    const updatedRelationship = await respondToRequest(user, relationshipId, 'blocked');
    renderRelationshipInfo(user, updatedRelationship);
});

const removeBtn = document.getElementById('remove-relationship-btn');
removeBtn.addEventListener('click', async () => {
    const confirmRemoval = confirm("Are you sure you want to remove this relationship? This action cannot be undone.");
    if(!confirmRemoval) return;
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    const updatedRelationship = await respondToRequest(user, relationship._id, 'blocked');
    renderRelationshipInfo(user);
});