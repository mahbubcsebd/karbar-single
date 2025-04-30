const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerUser(userData) {
    const res = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: userData,
    });

    const data = await res.json();
    return Response.json(data);
}


export async function loginUser(loginData) {
    const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: loginData,
    });

      if (!res.ok) {
          const errorData = await res.json();  console.log(errorData);// Parse error details
          throw new Error(errorData.message || 'Login failed');
      }

      return await res.json();
}

export async function getUserDetails(token) {
    const res = await fetch(`${baseUrl}/user/details`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch User Details');
    }

    return res.json();
}

export async function updateUser(updatedData, token) {
    const res = await fetch(`${baseUrl}/user/profile-update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: updatedData,
        token,
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData); // Parse error details
        throw new Error(errorData.message || 'Update user failed');
    }

    return await res.json();
}

export async function updateUserProfilePicture(profileImgData, token) {
    const res = await fetch(`${baseUrl}/user/profile-avatar-upload`, {
        method: 'POST', // Use POST for file upload
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: profileImgData, // Send FormData directly as the body
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData); // Log error details
        throw new Error(errorData.message || 'Update Profile Picture failed');
    }

    return await res.json(); // Return response with the updated image URL
}

export async function logOut(token) {
    const res = await fetch(`${baseUrl}/user/logout`, {
        cache: 'no-store',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to logout');
    }

    return res.json();
}