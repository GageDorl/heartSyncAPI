import { renderHeader } from "../partials/header";
import { fetchCurrentUser, fetchRelationship, getUserInfo, fetchLetter, updateLetter, deleteLetter } from "./fetch-data.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    const otherUserId = (user._id === relationship.user1) ? relationship.user2 : relationship.user1;
    const otherUser = await getUserInfo(otherUserId);
    const letter = await fetchLetter(relationship, window.location.pathname.split('/').pop());
    if(!letter){
        window.location.href = '/letters';
        return;
    }
    if(letter.type === "draft" && letter.senderId !== user._id){
        window.location.href = '/letters';
        return;
    } else if(letter.type === "draft") {
        document.querySelector('.sent-letter').remove();
        document.querySelector('.draft-letter').classList.remove('hidden');
    } else {
        document.querySelector('.draft-letter').remove();
        document.querySelector('.sent-letter').classList.remove('hidden');
    }
    const titleElem = document.querySelector('.letter-title');
    const dateElem = document.querySelector('.letter-date');
    const contentElem = document.querySelector('.letter-content');
    const senderNameElem = document.querySelector('.letter-sender-name');
    const recipientNameElem = document.querySelector('.letter-recipient-name');
    

    titleElem.textContent = letter.title;
    titleElem.value = letter.title;
    dateElem.textContent = new Date(letter.sentAt).toLocaleDateString();
    contentElem.textContent = letter.content;
    senderNameElem.textContent = (letter.senderId === user._id) ? user.name : otherUser.name;
    recipientNameElem.textContent = (letter.recipientId === user._id) ? user.name : otherUser.name;
    const backButton = document.querySelector('.back-to-letters-btn');
    const sendLetterBtn = document.querySelector('.send-letter-btn');
    const saveDraftBtn = document.querySelector('.save-draft-btn');
    const deleteDraftBtn = document.querySelector('.delete-draft-btn');
    backButton.addEventListener('click', () => {
        window.location.href = '/letters';
    });
    sendLetterBtn.addEventListener('click', async () => {
        letter.type = "sent";
        letter.title = titleElem.value;
        letter.content = contentElem.value;
        letter.Date = Date.now();
        await updateLetter(letter);
        setTimeout(() => {
            window.location.href = '/letters';
        }, 3000);
    });
    saveDraftBtn.addEventListener('click', async () => {
        letter.type = "draft";
        letter.title = titleElem.value;
        letter.content = contentElem.value;
        letter.Date = Date.now();
        await updateLetter(letter);
        setTimeout(() => {
            window.location.href = '/letters';
        }, 3000);
    });
    deleteDraftBtn.addEventListener('click', async () => {
        await deleteLetter(letter);
        setTimeout(() => {
            window.location.href = '/letters/';
        }, 3000);
    });

});