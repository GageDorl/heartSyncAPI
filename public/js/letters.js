import { renderHeader } from "../partials/header";
import { fetchCurrentUser, fetchRelationship, fetchLetters, saveLetter } from "./fetch-data.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    if (!relationship || relationship.status !== "accepted") {
        showNotification("You need an accepted relationship to view letters.", true);
        return;
    }
    document.querySelector('.letter-container').setAttribute('data-relationship-id', relationship._id);
    const letters = await fetchLetters(relationship._id);
    let filterValue = document.querySelector('input[name="filter"]:checked').value;
    renderLetters(letters, filterValue);
});

const writeLetterBtn = document.querySelector('.add-button');
const modalContainer = document.querySelector('.modal-container');
const closeModalBtn = document.querySelector('.close-modal-btn');

writeLetterBtn.addEventListener('click', () => {
    modalContainer.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    modalContainer.classList.add('hidden');
});

modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
        modalContainer.classList.add('hidden');
    }
});

const filterSelect = document.querySelector('.filter-group');
filterSelect.addEventListener('change', async () => {
    document.querySelector('.letter-container').innerHTML = '<li class="letter-item"><a>Loading...</a></li>';
    const filterValue = document.querySelector('input[name="filter"]:checked').value;
    console.log("Filter changed to:", filterValue);
    const letters = await fetchLetters(document.querySelector('.letter-container').dataset.relationshipId);
    renderLetters(letters, filterValue);
});

async function renderLetters(letters, filter) {
    const user = await fetchCurrentUser();
    const lettersList = document.querySelector('.letter-container');
    console.log(lettersList);
    lettersList.innerHTML = '';
    let filteredLetters = [];
    switch (filter) {
        case 'inbox':
            filteredLetters = letters.filter(letter => letter.type == 'sent' && letter.senderId !==user._id);
            break;
        case 'sent':
            filteredLetters = letters.filter(letter => letter.type == 'sent' && letter.senderId === user._id);
            break;
        case 'draft':
            filteredLetters = letters.filter(letter => letter.type == 'draft' && letter.senderId === user._id);
            break;
    }
    if(filteredLetters.length === 0){
        lettersList.innerHTML = '<li class="letter-item"><a>No letters to display.</a></li>';
    } else {
        filteredLetters.forEach(letter => {
            const letterItem = document.createElement('div');
            letterItem.classList.add('letter-item');
            letterItem.innerHTML = `
            <a href="/letters/${letter._id}">
                <span class="letter-title">${letter.title}</span>
                <span class="letter-date">${new Date(letter.sentAt).toLocaleDateString()}</span>
            </a>
            `;
            lettersList.appendChild(letterItem);
        });
    }
}

const newLetterForm = document.querySelector('.new-letter-form');
const saveDraftBtn = document.querySelector('.save-draft-btn');

newLetterForm.addEventListener('submit', async (e) => {
    saveLetterEvent(e);
});

saveDraftBtn.addEventListener('click', async (e) => {
    saveLetterEvent(e);
});


async function saveLetterEvent(e) {
    e.preventDefault();
    let type;
    console.log(e.target.classList);
    if(e.target.classList.contains("new-letter-form")){
        type = "sent";
    } else {
        type = "draft";
    }
    const relationshipId = document.querySelector('.letter-container').getAttribute('data-relationship-id');
    console.log("Submitting new letter for relationship:", relationshipId);
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    const recipientId = (user._id === relationship.user1) ? relationship.user2 : relationship.user1;
    const letterData = {
        relationshipId: relationshipId,
        senderId: user._id,
        recipientId: recipientId,
        title: document.getElementById('letter-title').value,
        type: type,
        content: document.getElementById('letter-content').value
    };
    await saveLetter(letterData);
    modalContainer.classList.add('hidden');
    newLetterForm.reset();
    const letters = await fetchLetters(relationshipId);
    console.log(type)
    document.getElementById(type).checked = true;
    renderLetters(letters, type);
}