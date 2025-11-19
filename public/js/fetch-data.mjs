import { showNotification } from "../partials/header";

export async function fetchRelationship(user) {
    const relationshipInfo = await fetch(`/api/relationships/${user._id}`);

    if (relationshipInfo.ok) {
        const relationship = await relationshipInfo.json();
        if (relationship) {
            return relationship;
        }
    } else {
        if (!relationshipInfo.ok && relationshipInfo.status !== 404) {
            console.error('Failed to fetch relationship info');
            showNotification("Failed to fetch relationship info", true);
            return null;
        }
        return null;
    }
}

export async function fetchCurrentUser() {
    const userInfo = await fetch('/api/users/current');
    const user = await userInfo.json();
    if (user) {
        return user;
    } else {
        console.error('Failed to fetch current user');
        showNotification("Failed to fetch current user", true);
        return null;
    }
}

export async function updateUser(userData) {
    const response = await fetch('/api/users/current', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return response;
}

export async function getUserInfo(userID) {
    const response = await fetch(`/api/users/${userID}`);
    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Failed to fetch user info with id ${userID}`);
        showNotification(`Failed to fetch user info`, true);
        return null;
    }
}

export async function requestRelationship(user, partnerEmail) {
    const response = await fetch('/api/relationships/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user1: user._id, user2Email: partnerEmail })
    });

    if (response.ok) {
        const relationship = await response.json();
        showNotification("Relationship request sent successfully", false);
        return relationship;
    } else {
        console.error(`Failed to send relationship request: ${JSON.stringify(await response.json())}`);
        showNotification("Failed to send relationship request", true);
    }
}

export async function respondToRequest(user, relationshipId, status) {
    const response = await fetch(`/api/relationships/${user._id}/${relationshipId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    if (response.ok) {
        const updatedRelationship = await response.json();
        if(status === 'blocked') {
            showNotification("Relationship request removed or blocked", false);
            return null;
        } else {
            showNotification("Successfully responded to relationship request", false);
            return updatedRelationship;
        }
    } else {
        console.error('Failed to respond to relationship request');
        showNotification("Failed to respond to relationship request", true);
    }
}

export async function updateRelationship(user, relationshipId, updateData) {
    const response = await fetch(`/api/relationships/${user._id}/${relationshipId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });

    if (response.ok) {
        const updatedRelationship = await response.json();
        showNotification("Relationship updated successfully", false);
        return updatedRelationship;
    } else {
        console.error('Failed to update relationship');
        showNotification("Failed to update relationship", true);
    }
}

export async function fetchActivities(relationshipId) {
    const response = await fetch(`/api/activities/relationship/${relationshipId}`);
    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Failed to fetch activities for relationship ${relationshipId}`);
        showNotification("Failed to fetch activities", true);
        return [];
    }
}

export async function addActivity(relationshipId, activityData) {
    const response = await fetch(`/api/activities/relationship/${relationshipId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
    });
    console.log(response);
    if (response.ok) {
        const newActivity = await response.json();
        showNotification("Activity added successfully", false);
        return newActivity;
    } else {
        console.error('Failed to add activity');
        showNotification("Failed to add activity", true);
    }
}

export async function deleteActivity(activity) {
    const response = await fetch(`/api/activities/relationship/${activity.relationshipId}/${activity._id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        showNotification("Activity deleted successfully", false);
    } else {
        console.error('Failed to delete activity');
        showNotification("Failed to delete activity", true);
    }
}

export async function updateActivity(activity, activityData) {
    const response = await fetch(`/api/activities/relationship/${activity.relationshipId}/${activity._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
    });
    if (response.ok) {
        const updatedActivity = await response.json();
        showNotification("Activity updated successfully", false);
        return updatedActivity;
    } else {
        console.error('Failed to update activity');
        showNotification("Failed to update activity", true);
    }
}

export async function fetchLetters(relationshipId) {
    const response = await fetch(`/api/letters/relationship/${relationshipId}`);
    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Failed to fetch letters for relationship ${relationshipId}`);
        showNotification("Failed to fetch letters", true);
        return [];
    }
}

export async function fetchLetter(relationship, letterId) {
    const response = await fetch(`/api/letters/relationship/${relationship._id}/${letterId}`);
    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Failed to fetch letter with id ${letterId}`);
        showNotification("Failed to fetch letter", true);
        return null;
    }
}

export async function saveLetter(letterData){
    const response = await fetch(`/api/letters/relationship/${letterData.relationshipId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(letterData)
    });
    if (response.ok) {
        const newLetter = await response.json();
        showNotification("Letter sent successfully", false);
        return newLetter;
    } else {
        console.error('Failed to send letter');
        showNotification("Failed to send letter", true);
    }
}

export async function updateLetter(letter){
    const response = await fetch(`/api/letters/relationship/${letter.relationshipId}/${letter._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(letter)
    });
    if (response.ok) {
        const updatedLetter = await response.json();
        showNotification("Letter updated successfully", false);
        return updatedLetter;
    } else {
        console.error('Failed to update letter');
        showNotification("Failed to update letter", true);
    }
}

export async function deleteLetter(letter) {
    const response = await fetch(`/api/letters/relationship/${letter.relationshipId}/${letter._id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        showNotification("Letter deleted successfully", false);
    } else {
        console.error('Failed to delete letter');
        showNotification("Failed to delete letter", true);
    }
}