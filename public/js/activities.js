
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

const addActivityBtn = document.querySelector('.add-button');
const modalContainer = document.querySelector('.modal-container');

addActivityBtn.addEventListener('click', () => {
    modalContainer.classList.remove('hidden');
});

modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
        modalContainer.classList.add('hidden');
    }
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
        <p class="activity-title">${activity.title}</p>
        <p class="activity-category">Category: ${formattedCategory}</p>
        <p class="activity-date">${new Date(activity.date).toLocaleDateString()}</p>
        <p class="activity-duration">${activity.duration} minutes</p>
        <p class="activity-description">${activity.description}</p>
        <div class="form-btns">
            <button class="edit-activity-btn">Edit</button>
        </div>
        `;
        listItem.classList.add("activity-card", "card");
        listItem.setAttribute("data-activity-id", activity._id);
        const isOverlapping = (elem, otherElem) => {
            let elemRect = elem.getBoundingClientRect();
            let elemCenterX = elemRect.left + elemRect.width / 2;
            let elemCenterY = elemRect.top + elemRect.height / 2;
            let otherRect = otherElem.getBoundingClientRect();
            return !(
                elemCenterX < otherRect.left ||
                elemCenterX > otherRect.right ||
                elemCenterY < otherRect.top ||
                elemCenterY > otherRect.bottom
            );
        };
        const plannedActivities = document.getElementById("planned-activities");
        const ideas = document.getElementById("activity-ideas");
        const completedActivities = document.getElementById("completed-activities");
        listItem.addEventListener("mousedown", (e) => {
            if(e.target.classList.contains("close-btn") || e.target.classList.contains("edit-activity-btn")) return;
            e.preventDefault();
            const itemWidth = listItem.offsetWidth;
            listItem.classList.add("dragging");
            listItem.style.width = `${itemWidth}px`;
            plannedActivities.classList.add("droppable");
            ideas.classList.add("droppable");
            completedActivities.classList.add("droppable");
            listItem.style.top = `calc(${e.clientY}px + ${document.documentElement.scrollTop}px - ${listItem.offsetHeight / 2}px)`;
            listItem.style.left = `calc(${e.clientX}px - ${listItem.offsetWidth / 2}px)`;
            const onMouseMove = (e) => {
                listItem.style.top = `calc(${e.clientY}px + ${document.documentElement.scrollTop}px - ${listItem.offsetHeight / 2}px)`;
                listItem.style.left = `calc(${e.clientX}px - ${listItem.offsetWidth / 2}px)`;
            };
            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                if(listItem) {
                    if (isOverlapping(listItem, plannedActivities)) {
                        plannedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'planned' });
                    } else if (isOverlapping(listItem, ideas)) {
                        ideasList.appendChild(listItem);
                        updateActivity(activity, { status: 'idea' });
                    } else if (isOverlapping(listItem, completedActivities)) {
                        completedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'completed' });
                    }
                }
                listItem.classList.remove("dragging");
                listItem.style.top = ``;
                listItem.style.left = ``;
                listItem.style.width = ``;
                plannedActivities.classList.remove("droppable");
                ideas.classList.remove("droppable");
                completedActivities.classList.remove("droppable");

            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
        listItem.addEventListener("touchstart", (e) => {
            if(e.target.classList.contains("close-btn") || e.target.classList.contains("edit-activity-btn")||e.target.classList.contains("activity-description")) return;
            e.preventDefault();
            const itemWidth = listItem.offsetWidth;
            listItem.style.width = `${itemWidth}px`;
            listItem.classList.add("dragging");
            plannedActivities.classList.add("droppable");
            ideas.classList.add("droppable");
            completedActivities.classList.add("droppable");
            listItem.style.top = `calc(${e.touches[0].clientY}px + ${document.documentElement.scrollTop}px - ${listItem.offsetHeight / 2}px)`;
            listItem.style.left = `calc(${e.touches[0].clientX}px - ${listItem.offsetWidth / 2}px)`;
            const onTouchMove = (e) => {

                listItem.style.top = `calc(${e.touches[0].clientY}px + ${document.documentElement.scrollTop}px - ${listItem.offsetHeight / 2}px)`;
                listItem.style.left = `calc(${e.touches[0].clientX}px - ${listItem.offsetWidth / 2}px)`;
            };
            const onTouchEnd = () => {
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
                if(listItem) {
                    if (isOverlapping(listItem, plannedActivities)) {
                        plannedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'planned' });
                    } else if (isOverlapping(listItem, ideas)) {
                        ideasList.appendChild(listItem);
                        updateActivity(activity, { status: 'idea' });
                    } else if (isOverlapping(listItem, completedActivities)) {
                        completedActivitiesList.appendChild(listItem);
                        updateActivity(activity, { status: 'completed' });
                    }
                }
                
                listItem.style.top = ``;
                listItem.style.left = ``;
                listItem.style.width = ``;
                listItem.classList.remove("dragging");
                plannedActivities.classList.remove("droppable");
                ideas.classList.remove("droppable");
                completedActivities.classList.remove("droppable");
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
            modalContainer.classList.remove('hidden');
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
                modalContainer.classList.add('hidden');
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