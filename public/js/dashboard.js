import { renderHeader } from "../partials/header";
import { fetchCurrentUser, fetchRelationship, requestRelationship, getUserInfo, respondToRequest, fetchActivities, fetchCheckins } from "./fetch-data.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    renderRelationshipInfo(user, relationship);
    if(relationship && relationship.status === "accepted") {
        const activities = await fetchActivities(relationship._id);
        renderActivities(activities);
    }
    renderCheckinCard(user);

});

function renderActivities(activities) {
    console.log("Rendering activities:", activities);
    const activitiesContainer = document.getElementById("activities-list");
    activitiesContainer.innerHTML = '';
    const plannedActivities = [];
    if(activities && activities.length > 0) {
        activities.forEach(activity => {
            if(activity.status == "planned") {
                const listItem = document.createElement("li");
                listItem.textContent = `${activity.title} - ${new Date(activity.date).toLocaleDateString()}`;
                plannedActivities.push(listItem);
            }
        });
        if(plannedActivities.length > 0) {
            plannedActivities.forEach(item => activitiesContainer.appendChild(item));
        } else {
            const noActivitiesMessage = document.createElement("li");
            noActivitiesMessage.textContent = "No planned activities.";
            activitiesContainer.appendChild(noActivitiesMessage);
        }
    } else {
        const listItem = document.createElement("li");
        listItem.textContent = "No upcoming activities.";
        activitiesContainer.appendChild(listItem);
    }
}

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
            if(relationship.anniversary){
                const milestoneList = document.querySelector("#milestones .card-list");
                milestoneList.innerHTML = '';
                const anniversaryDate = new Date(relationship.anniversary);
                const now = new Date();
                const anniversaryYear = anniversaryDate.getFullYear();
                const anniversaryMonth = anniversaryDate.getMonth();
                const anniversaryDay = anniversaryDate.getDate();
                let yearsTogether = 0;
                let monthsTogether = 0;
                if(anniversaryYear < now.getFullYear() && anniversaryMonth <=now.getMonth()){
                    if (anniversaryMonth === now.getMonth() && anniversaryDay < now.getDate()) {
                        yearsTogether = now.getFullYear() - anniversaryYear;
                    } else {
                        yearsTogether = (now.getFullYear() - anniversaryYear) - 1;
                    }
                }
                if( yearsTogether == 0){
                    if (now.getFullYear() === anniversaryYear) {
                        if(now.getDate() >= anniversaryDay){
                            monthsTogether = now.getMonth() - anniversaryMonth;
                            
                        } else {
                            monthsTogether = (now.getMonth() - anniversaryMonth) - 1;
                        }
                    }
                }
                if(monthsTogether < 6){
                    const monthsTogetherItem = document.createElement("li");
                    monthsTogetherItem.textContent = `${monthsTogether+1} Month Anniversary: ${new Date(anniversaryYear, anniversaryMonth + monthsTogether+1, anniversaryDay).toLocaleDateString()}`;
                    milestoneList.appendChild(monthsTogetherItem);
                }
                console.log('Years Together:', yearsTogether);
                console.log('Months Together:', monthsTogether);
                if (now < new Date(now.getFullYear(), anniversaryMonth, anniversaryDay)) {
                    
                    var nextAnniversary = new Date(now.getFullYear(), anniversaryMonth, anniversaryDay);
                    const nextAnniversaryItem = document.createElement("li");
                    nextAnniversaryItem.textContent = `${now.getFullYear()-anniversaryYear} Year Anniversary: ${nextAnniversary.toLocaleDateString()}`;
                    milestoneList.appendChild(nextAnniversaryItem);
                } else {
                    var nextAnniversary = new Date(now.getFullYear() + 1, anniversaryMonth, anniversaryDay);
                    const nextAnniversaryItem = document.createElement("li");
                    nextAnniversaryItem.textContent = `${now.getFullYear()-anniversaryYear+1} Year Anniversary: ${nextAnniversary.toLocaleDateString()}`;
                    milestoneList.appendChild(nextAnniversaryItem);
                }
                    
            }
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

async function renderCheckinCard(user) {
    const checkins = await fetchCheckins(user._id);
    let todayCompleted = false;
    checkins.forEach(checkin => {
        const checkinDate = new Date(checkin.date);
        const today = new Date();
        if(checkinDate.toDateString() === today.toDateString()) {
            todayCompleted = true;
        }
    });
    document.querySelector("#checkin-status").textContent = todayCompleted ? "You have completed your check-in for today." : "You have not completed your check-in for today. Check in:";
    if(todayCompleted) {
        document.querySelector(".working").classList.add("hidden");
        document.querySelector(".disabled").classList.remove("hidden");
    } else {
        document.querySelector(".working").classList.remove("hidden");
        document.querySelector(".disabled").classList.add("hidden");
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
    const relationship = await requestRelationship(user, partnerEmail);
    if(relationship) {
        renderRelationshipInfo(user, relationship);
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