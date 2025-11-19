
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
            <button class="edit-activity-btn">Edit</button>
        </div>
        `;
        listItem.classList.add("activity-card");
        listItem.setAttribute("data-activity-id", activity._id);
        listItem.addEventListener("mousedown", (e) => {
            if(e.target.classList.contains("close-btn") || e.target.classList.contains("edit-activity-btn")) return;
            e.preventDefault();
            listItem.classList.add("dragging");
            listItem.style.top = `calc(${e.clientY}px + ${document.documentElement.scrollTop}px - 10px)`;
            listItem.style.left = `calc(${e.clientX}px - ${listItem.offsetWidth / 2}px)`;
            const onMouseMove = (e) => {
                listItem.style.top = `calc(${e.clientY}px + ${document.documentElement.scrollTop}px - 10px)`;
                listItem.style.left = `calc(${e.clientX}px - ${listItem.offsetWidth / 2}px)`;
            };
            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                let plannedActivities = document.getElementById("planned-activities");
                let ideas = document.getElementById("activity-ideas");
                let completedActivities = document.getElementById("completed-activities");
                let plannedActivitiesRect = plannedActivities.getBoundingClientRect();
                let ideasRect = ideas.getBoundingClientRect();
                let completedActivitiesRect = completedActivities.getBoundingClientRect();
                let isOverlapping = (elem, rect) => {
                    let elemRect = elem.getBoundingClientRect();
                    return !(
                        elemRect.right < rect.left ||
                        elemRect.left > rect.right ||
                        elemRect.bottom < rect.top ||
                        elemRect.top > rect.bottom
                    );
                };
                if(listItem) {
                    if (isOverlapping(listItem, plannedActivitiesRect)) {
                        plannedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'planned' });
                    } else if (isOverlapping(listItem, ideasRect)) {
                        ideasList.appendChild(listItem);
                        updateActivity(activity, { status: 'idea' });
                    } else if (isOverlapping(listItem, completedActivitiesRect)) {
                        completedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'completed' });
                    }
                }
                listItem.classList.remove("dragging");

            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
        listItem.addEventListener("touchstart", (e) => {
            if(e.target.classList.contains("close-btn") || e.target.classList.contains("edit-activity-btn")) return;
            e.preventDefault();
            listItem.classList.add("dragging");
            listItem.style.top = `calc(${e.touches[0].clientY}px + ${document.documentElement.scrollTop}px - 10px)`;
            listItem.style.left = `calc(${e.touches[0].clientX}px - ${listItem.offsetWidth / 2}px)`;
            document.body.style.touchAction = "none";
            const onTouchMove = (e) => {

                listItem.style.top = `calc(${e.touches[0].clientY}px + ${document.documentElement.scrollTop}px - 10px)`;
                listItem.style.left = `calc(${e.touches[0].clientX}px - ${listItem.offsetWidth / 2}px)`;
            };
            const onTouchEnd = () => {
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
                let plannedActivities = document.getElementById("planned-activities");
                let ideas = document.getElementById("activity-ideas");
                let completedActivities = document.getElementById("completed-activities");
                let plannedActivitiesRect = plannedActivities.getBoundingClientRect();
                let ideasRect = ideas.getBoundingClientRect();
                let completedActivitiesRect = completedActivities.getBoundingClientRect();
                let isOverlapping = (elem, rect) => {
                    let elemRect = elem.getBoundingClientRect();
                    console.log("Elem Rect:", elemRect, "Target Rect:", rect);
                    console.log(elem, "Is Overlapping:", !(
                        elemRect.right < rect.left ||
                        elemRect.left > rect.right ||
                        elemRect.bottom < rect.top ||
                        elemRect.top > rect.bottom
                    ));
                    return !(
                        elemRect.right < rect.left ||
                        elemRect.left > rect.right ||
                        elemRect.bottom < rect.top ||
                        elemRect.top > rect.bottom
                    );
                };
                if(listItem) {
                    if (isOverlapping(listItem, plannedActivitiesRect)) {
                        plannedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'planned' });
                    } else if (isOverlapping(listItem, ideasRect)) {
                        ideasList.appendChild(listItem);
                        updateActivity(activity, { status: 'idea' });
                    } else if (isOverlapping(listItem, completedActivitiesRect)) {
                        completedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'completed' });
                    }
                }
                
                listItem.style.top = ``;
                listItem.style.left = ``;
                listItem.classList.remove("dragging");
                document.body.style.touchAction = "auto";
            };
            
            document.addEventListener("touchmove", onTouchMove);
            document.addEventListener("touchend", onTouchEnd);
        });
        const closeBtn = listItem.querySelector(".close-btn");
        closeBtn.addEventListener("click", async () => {
            await deleteActivity(activity);
            renderActivities(await fetchActivities(activity.relationshipId));
            console.log(`Deleted activity with ID: ${activity._id}`);
        });
        // const actionBtn = listItem.querySelector(".action-btn");
        // actionBtn.addEventListener("click", async () => {
        //     if(activity.status === "idea") {
        //         activity.status = "planned";
        //     } else if(activity.status === "planned") {
        //         activity.status = "completed";
        //     } else if(activity.status === "completed") {
        //         activity.status = "planned";
        //     }
        //     await updateActivity(activity, { status: activity.status });
        //     renderActivities(await fetchActivities(activity.relationshipId));
        //     console.log(`Update activity status to ${activity.status} for ID: ${activity._id}`);
        // });
        const editBtn = listItem.querySelector(".edit-activity-btn");
        editBtn.addEventListener("click", async () => {
            const addActivityForm = document.querySelector(".add-activity-form");
            addActivityForm.querySelector("#activity-title").value = activity.title;
            addActivityForm.querySelector("#activity-description").value = activity.description;
            addActivityForm.querySelector("#activity-category").value = activity.category;
            addActivityForm.querySelector("#activity-date").value = activity.date.split('T')[0];
            addActivityForm.querySelector("#activity-duration").value = activity.duration;
            addActivityForm.querySelector("#activity-status").value = activity.status;
            const addButton = document.querySelector("#add-activity-btn");
            addButton.textContent = "Update Activity";
            window.scrollTo({ top: document.querySelector(".add-activity-form").offsetTop, behavior: 'smooth' });
            addButton.onclick = async (e) => {
                e.preventDefault();
                const updatedActivity = {
                    title: addActivityForm.querySelector("#activity-title").value,
                    description: addActivityForm.querySelector("#activity-description").value,
                    category: addActivityForm.querySelector("#activity-category").value,
                    date: new Date(`${addActivityForm.querySelector("#activity-date").value}T12:00:00`),
                    duration: addActivityForm.querySelector("#activity-duration").value,
                    status: addActivityForm.querySelector("#activity-status").value
                };
                await updateActivity(activity, updatedActivity);
                renderActivities(await fetchActivities(activity.relationshipId));
                window.scrollTo({ top: document.querySelector(`[data-activity-id="${activity._id}"]`).offsetTop - 100, behavior: 'smooth' });
                addActivityForm.reset();
                addButton.textContent = "Add Activity";
                addButton.onclick = null;
            };
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
        date: new Date(`${activityForm.querySelector("#activity-date").value}T12:00:00`),
        duration: activityForm.querySelector("#activity-duration").value,
        status: activityForm.querySelector("#activity-status").value
    };
    await addActivity(relationship._id, newActivity);
    activityForm.reset();
    renderActivities(await fetchActivities(relationship._id));
});