import { renderHeader } from "../partials/header";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
});

const writeLetterBtn = document.querySelector('.write-letter');
const modalContainer = document.querySelector('.new-letter-modal-container');
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