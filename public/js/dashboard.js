import { renderHeader } from "../partials/header";
import { fetchCurrentUser, fetchRelationship, requestRelationship, getUserInfo, respondToRequest } from "./fetch-data.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    renderRelationshipInfo(user, relationship);
});

async function renderRelationshipInfo(user, relationship) {
    document.getElementById("relationshipContainer").classList.add("hidden");
    document.getElementById("relationshipRequest").classList.add("hidden");
    document.getElementById("noRelationshipContainer").classList.add("hidden");
    document.getElementById("pendingRelationshipContainer").classList.add("hidden");
    if(relationship) {
        if(relationship.status === "accepted") {
            document.getElementById("userName").textContent = user.name;
            const partnerInfo = await getUserInfo(relationship.user1 === user._id ? relationship.user2 : relationship.user1);
            document.getElementById("partnerName").textContent = partnerInfo.name;
            document.getElementById("relationshipContainer").classList.remove("hidden");
        } else if(relationship.status === "pending" && relationship.user2 === user._id) {
            console.log('Pending relationship for user2');
            const requesterInfo = await getUserInfo(relationship.user1);
            document.getElementById("requester-name").textContent = requesterInfo.name;
            document.getElementById("requester-email").textContent = requesterInfo.email;
            document.getElementById("relationshipRequest").setAttribute("data-relationship-id", relationship._id);
            document.getElementById("relationshipRequest").classList.remove("hidden");
        } else if(relationship.status === "pending" && relationship.user1 === user._id) {
            console.log('Pending relationship for user1');
            const pendingPartnerInfo = await getUserInfo(relationship.user2);
            document.getElementById("pending-partner-name").textContent = pendingPartnerInfo.name;
            document.getElementById("pending-partner-email").textContent = pendingPartnerInfo.email;
            document.getElementById("pendingRelationshipContainer").classList.remove("hidden");
        }
    } else {
        document.getElementById("noRelationshipContainer").classList.remove("hidden");
    }
}

const checkinBtn = document.querySelector(".checkin-btn");
checkinBtn.addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = "/checkins";
    }, 300);
});

const relationshipForm = document.getElementById("request-relationship-form");
relationshipForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const partnerEmail = document.getElementById("partner-email-input").value;
    const user = await fetchCurrentUser();
    const response = await requestRelationship(user, partnerEmail);
    if (response.ok) {
        alert("Relationship request sent successfully!");
        window.location.reload();
    } else {
        alert("Failed to send relationship request. Please try again.");
    }
});

const acceptBtn = document.getElementById("accept-relationship-btn");
const declineBtn = document.getElementById("decline-relationship-btn");

acceptBtn.addEventListener("click", async () => {
    const user = await fetchCurrentUser();
    const relationshipId = document.getElementById("relationshipRequest").getAttribute("data-relationship-id");
    const updatedRelationship = await respondToRequest(user, relationshipId, 'accepted');
    renderRelationshipInfo(user, updatedRelationship);
});

declineBtn.addEventListener("click", async () => {
    const user = await fetchCurrentUser();
    const relationshipId = document.getElementById("relationshipRequest").getAttribute("data-relationship-id");
    const updatedRelationship = await respondToRequest(user, relationshipId, 'blocked');
    renderRelationshipInfo(user, updatedRelationship);
});