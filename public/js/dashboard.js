import { renderHeader } from "../partials/header";
import { fetchCurrentUser, fetchRelationship, requestRelationship, getUserInfo } from "./fetch-data.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    if(relationship) {
        if(relationship.status === "accepted") {
            document.getElementById("userName").textContent = user.name;
            document.getElementById("partnerName").textContent = relationship.partnerName;
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
            document.getElementById("pendingRequestInfo").classList.remove("hidden");
        }
    } else {
        document.getElementById("noRelationshipContainer").classList.remove("hidden");
    }
});

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
