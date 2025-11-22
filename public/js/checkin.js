import { renderHeader } from "../partials/header";
import { fetchCurrentUser, fetchRelationship, fetchCheckins, addCheckin, deleteCheckin, getUserInfo } from "./fetch-data.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    if(relationship && relationship.status === "accepted") {
        const partnerInfo = await getUserInfo(relationship.user1 === user._id ? relationship.user2 : relationship.user1);
        renderCheckins(user, partnerInfo);
    } else {
        document.querySelector(".checkingBoard").textContent = "You need an accepted relationship to view check-ins.";
    }
});

const renderCheckins = async (user, partnerInfo, pageNumber = 1) => {
    const checkins = await fetchCheckins(user._id);
    let todayCompleted = false;
    checkins.forEach(checkin => {
        const checkinDate = new Date(checkin.createdAt);
        const today = new Date();
        if(checkinDate.toDateString() === today.toDateString()) {
            todayCompleted = true;
        }
    });
    document.getElementById("todayStatus").textContent = todayCompleted ? "You have completed your check-in for today." : "You have not completed your check-in for today.";
    if(todayCompleted) {
        document.querySelector(".checkInForm").classList.add("hidden");
    } else {
        document.querySelector(".checkInForm").classList.remove("hidden");
    }
    const sortedCheckins = checkins.sort((a, b) => new Date(b.date) - new Date(a.date));
    const checkinList = document.getElementById("checkin-list");
    if(sortedCheckins.length === 0) {
        checkinList.innerHTML = "<li>No check-ins available.</li>";
        return;
    }
    checkinList.innerHTML = "";
    const paginationContainer = document.querySelector(".pagination");
    if(sortedCheckins.length > 5) {
        const pagination = document.createElement("div");
        pagination.classList.add("pagination");
        const totalPages = Math.ceil(sortedCheckins.length / 5);
        for(let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("page-button");
            pageButton.addEventListener("click", () => {
                renderCheckins(user, partnerInfo, i);
            });
            pagination.appendChild(pageButton);
        }
        pagination.insertAdjacentHTML("afterbegin", `
            <button class="prev-page" ${pageNumber === 1 ? 'disabled' : ''}>« Prev</button>
        `);
        pagination.insertAdjacentHTML("beforeend", `
            <button class="next-page" ${pageNumber === totalPages ? 'disabled' : ''}>Next »</button>
        `);
        pagination.querySelector(".prev-page").addEventListener("click", () => {
            if(pageNumber > 1) {
                renderCheckins(user, partnerInfo, pageNumber - 1);
            }
        });
        pagination.querySelector(".next-page").addEventListener("click", () => {
            if(pageNumber < totalPages) {
                renderCheckins(user, partnerInfo, pageNumber + 1);
            }
        });
        paginationContainer.innerHTML = "";
        paginationContainer.insertAdjacentElement("beforeend", pagination);
    }
    const currentCheckins = sortedCheckins.slice((pageNumber - 1) * 5, pageNumber * 5);
    currentCheckins.forEach(checkin => {
        const listItem = document.createElement("li");
        listItem.classList.add("checkin-card");
        listItem.innerHTML = `
            <strong class="checkin-date">${new Date(checkin.date).toLocaleDateString()}</strong>
            <p class="checkin-mood">Mood: ${checkin.mood}</p>
            <p class="checkin-closeness">Closeness: ${checkin.closenessLevel}/10</p>
            <p class="checkin-notes">Notes: ${checkin.notes}</p>
            <div class="form-btns">
                <button class="delete-checkin" data-id="${checkin._id}">Delete</button>
            </div>
        `;
        listItem.querySelector(".delete-checkin").addEventListener("click", async () => {
            await deleteCheckin({ userId: user._id, _id: checkin._id });
            renderCheckins(user, partnerInfo, pageNumber);
        });
        checkinList.appendChild(listItem);
    });
};

document.querySelector(".checkInForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    const partnerInfo = await getUserInfo(relationship.user1 === user._id ? relationship.user2 : relationship.user1);
    if(!relationship || relationship.status !== "accepted") {
        alert("You need an accepted relationship to add check-ins.");
        return;
    }
    const date = new Date(Date.now()).toISOString().split('T')[0] + 'T12:00:00Z';
    const mood = document.getElementById("mood").value;
    const closenessLevel = document.getElementById("closeness").value;
    const notes = document.getElementById("notes").value;
    const newCheckin = {
        userId: user._id,
        relationshipId: relationship._id,
        date,
        mood,
        closenessLevel,
        notes
    };
        console.log('New check-in data:', newCheckin);
    await addCheckin(newCheckin);
    document.querySelector(".checkInForm").reset();
    renderCheckins(user, partnerInfo);
});
