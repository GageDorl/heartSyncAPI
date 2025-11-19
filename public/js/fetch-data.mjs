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