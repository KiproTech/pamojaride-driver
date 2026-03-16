// PROFILE PICTURE UPLOAD
export const updateProfilePicture = async (file) => {
  if (!file) throw new Error("No file provided");

  const token = getToken();
  const formData = new FormData();
  formData.append("profile_picture", file);

  const res = await fetch(`${BASE_URL}/users/profile-picture`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type! Let the browser handle FormData
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    notify(data.message || "Image upload failed", "error");
    throw new Error(data.message || "Image upload failed");
  }

  // Convert relative path to full URL before returning
  const fullUrl = data.profile_picture
    ? getImageUrl(data.profile_picture)
    : null;

  notify("Profile picture updated!");
  return { ...data, profile_picture_url: fullUrl };
};
