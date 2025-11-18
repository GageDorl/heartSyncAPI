import { renderHeader } from "../partials/header";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
});

const checkinBtn = document.querySelector(".checkin-btn");
checkinBtn.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "/checkins";
    }, 300);
});