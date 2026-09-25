const USERS_KEY = "disasterShieldUsers";
const CURRENT_USER_KEY = "disasterShieldCurrentUser";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}


/* =========================
   REGISTER USER
========================= */

export async function registerUser({
  role,
  name,
  identifier,
  password,
  location = "",
  phone = "",
  organizationName = "",
}) {
  const users = getUsers();

  const normalizedIdentifier = identifier
    .trim()
    .toLowerCase();

  const existingUser = users.find(
    (user) =>
      user.identifier === normalizedIdentifier &&
      user.role === role
  );

  if (existingUser) {
    return {
      success: false,
      message: "An account with these details already exists.",
    };
  }

  const passwordHash = await hashPassword(password);

  const user = {
    id: `${role}-${Date.now()}`,
    role,
    name: name.trim(),
    identifier: normalizedIdentifier,
    passwordHash,
    location: location.trim(),
    phone: phone.trim(),
    organizationName: organizationName.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  return {
    success: true,
    user,
  };
}


/* =========================
   LOGIN USER
========================= */

export async function loginUser({
  role,
  identifier,
  password,
}) {
  const users = getUsers();

  const normalizedIdentifier = identifier
    .trim()
    .toLowerCase();

  const passwordHash = await hashPassword(password);

  const user = users.find(
    (item) =>
      item.role === role &&
      item.identifier === normalizedIdentifier &&
      item.passwordHash === passwordHash
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email/phone or password.",
    };
  }

  /*
   * Do not keep the password hash in the active session.
   */
  const sessionUser = {
    id: user.id,
    role: user.role,
    name: user.name,
    identifier: user.identifier,
    location: user.location,
    phone: user.phone,
    organizationName: user.organizationName || "",
    createdAt: user.createdAt,
  };

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(sessionUser)
  );

  return {
    success: true,
    user: sessionUser,
  };
}


/* =========================
   GET CURRENT USER
========================= */

export function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem(
      CURRENT_USER_KEY
    );

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}


/* =========================
   UPDATE CURRENT USER
========================= */

export function updateCurrentUser(updates = {}) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const updatedUser = {
    ...currentUser,
    ...updates,
  };

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(updatedUser)
  );

  /*
   * Also update the registered account.
   */
  const users = getUsers();

  const userIndex = users.findIndex(
    (user) => user.id === currentUser.id
  );

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
    };

    saveUsers(users);
  }

  return updatedUser;
}


/* =========================
   LOGOUT
========================= */

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}


/* =========================
   CLEAR ALL AUTH DATA
   Useful only for development
========================= */

export function clearAuthData() {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}