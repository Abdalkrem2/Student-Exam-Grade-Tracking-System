//login
function login(username, password) {
  const trimmedUsername = username.trim();
 
  if (!trimmedUsername || !password) {
    return { success: false, message: "Please enter your username and password." };
  }
 
  const user = getUserByUsername(trimmedUsername);
 
  if (!user) {
    return { success: false, message: "Username not found." };
  }
 
  if (user.password !== password) {
    return { success: false, message: "Incorrect password." };
  }
 
  setSession(user);
 
  return { success: true, user };
}


// logout
function logout(pathToLogin = "../login.html") {
  clearSession();
  window.location.href = pathToLogin;
}


//ex if you go to login it wil return you to  dashboard
function redirectIfLoggedIn() {
  const session = getSession();
  if (!session) return;
 
  const user = getCurrentUser();
  if (user) {
    redirectToDashboard(user);
  } else {
    clearSession();
  }
}
 // هي خليتا تشيك عالرول وترجع يوزر مشان نستخدم معلومات بال html
function requireRole(expectedRole, pathToLogin = "../login.html") {
  const session = getSession();
  if (!session || session.role !== expectedRole) {
    window.location.href = pathToLogin;
    return null;
  }

  const user = getCurrentUser();
 
  if (!user) {
    clearSession();
    window.location.href = pathToLogin;
    return null;
  }
 
  return user;
}

function redirectToDashboard(user) {
  if (user.role === "Teacher") {
    window.location.href = "teacher/dashboard.html";
  } else if (user.role === "Student") {
    window.location.href = "student/dashboard.html";
  } else {
    console.error("auth.js: unknown role, cannot redirect:", user.role);
  }
}