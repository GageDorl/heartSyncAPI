
import { renderHeader, showNotification } from "../partials/header";
import { fetchCurrentUser, fetchRelationship, fetchActivities, addActivity, deleteActivity, updateActivity } from "./fetch-data.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    if (!relationship || relationship.status !== "accepted") {
        showNotification("You need an accepted relationship to view activities.", true);
        return;
    }
    const activities = await fetchActivities(relationship._id);
    renderActivities(activities);
});

function renderActivities(activities) {
    const plannedActivitiesList = document.querySelector("#planned-activities .activity-list");
    const ideasList = document.querySelector("#activity-ideas .activity-list");
    const completedActivitiesList = document.querySelector("#completed-activities .activity-list");
    plannedActivitiesList.innerHTML = '';
    ideasList.innerHTML = '';
    completedActivitiesList.innerHTML = '';
    activities.forEach(activity => {
        const listItem = document.createElement("li");
        const formattedCategory = activity.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        listItem.innerHTML = `
        <span class="close-btn">&times;</span>
        <strong>${activity.title}</strong>
        <p>${formattedCategory}</p>
        <p>${new Date(activity.date).toLocaleDateString()}</p>
        <p>${activity.duration} minutes</p>
        <p>${activity.description}</p>
        <div class="form-btns">
            <button class="action-btn">${activity.status === 'idea' ? 'Plan' : activity.status === 'planned' ? 'Complete' : 'Reopen'}</button>
            <button class="edit-activity-btn">Edit</button>
        </div>
        `;
        listItem.classList.add("activity-card");
        listItem.setAttribute("data-activity-id", activity._id);
        const closeBtn = listItem.querySelector(".close-btn");
        closeBtn.addEventListener("click", async () => {
            await deleteActivity(activity);
            renderActivities(await fetchActivities(activity.relationshipId));
            console.log(`Deleted activity with ID: ${activity._id}`);
        });
        const actionBtn = listItem.querySelector(".action-btn");
        actionBtn.addEventListener("click", async () => {
            if(activity.status === "idea") {
                activity.status = "planned";
            } else if(activity.status === "planned") {
                activity.status = "completed";
            } else if(activity.status === "completed") {
                activity.status = "planned";
            }
            await updateActivity(activity, { status: activity.status });
            renderActivities(await fetchActivities(activity.relationshipId));
            console.log(`Update activity status to ${activity.status} for ID: ${activity._id}`);
        });
        const editBtn = listItem.querySelector(".edit-activity-btn");
        editBtn.addEventListener("click", async () => {
            console.log(`Edit activity with ID: ${activity._id}`);
        });

        if(activity.status === "planned") {
            plannedActivitiesList.appendChild(listItem);
        } else if(activity.status === "idea") {
            ideasList.appendChild(listItem);
        } else if(activity.status === "completed") {
            completedActivitiesList.appendChild(listItem);
        }

    });
}

const activityForm = document.querySelector(".add-activity-form");
activityForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = await fetchCurrentUser();
    const relationship = await fetchRelationship(user);
    const newActivity = {
        relationshipId: relationship._id,
        title: activityForm.querySelector("#activity-title").value,
        description: activityForm.querySelector("#activity-description").value,
        category: activityForm.querySelector("#activity-category").value,
        date: activityForm.querySelector("#activity-date").value,
        duration: activityForm.querySelector("#activity-duration").value,
        status: activityForm.querySelector("#activity-status").value
    };
    await addActivity(relationship._id, newActivity);
    activityForm.reset();
    renderActivities(await fetchActivities(relationship._id));
});