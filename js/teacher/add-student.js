document
  .getElementById("logoutLink")
  .addEventListener("click", function (e) {
    e.preventDefault();
    logout();
  });

const teacher = requireRole("Teacher");

const params = new URLSearchParams(window.location.search);
const editingId = params.get("studentId");
const existingStudent = editingId ? getStudentById(editingId) : null;

const fullNameInput = document.getElementById("fullName");
const genderInput = document.getElementById("gender");
const nationalIdInput = document.getElementById("nationalId");
const phoneInput = document.getElementById("phone");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const formError = document.getElementById("formError");
const saveBtn = document.getElementById("saveStudentBtn");

if (existingStudent) {
  // ---- EDIT MODE: relabel the page and pre-fill the form ----
  document.getElementById("pageTitle").textContent = "Edit Student";
  document.getElementById("pageSubtitle").textContent = "Update this student's information.";
  document.getElementById("cardTitle").textContent = "Student Information";
  saveBtn.textContent = "Save Changes";

  fullNameInput.value = existingStudent.name || "";
  genderInput.value = existingStudent.gender || "Female";
  nationalIdInput.value = existingStudent.nationalId || "";
  phoneInput.value = existingStudent.phone || "";
  usernameInput.value = existingStudent.username || "";
  passwordInput.value = existingStudent.password || "";
} else if (editingId) {
  // A studentId was given but doesn't match any real student
  formError.textContent = "That student could not be found. Redirecting back to the list...";
  formError.style.display = "block";
  saveBtn.disabled = true;
  setTimeout(() => { window.location.href = "students.html"; }, 1500);
}

saveBtn.addEventListener("click", function () {
  const fullName = fullNameInput.value.trim();
  const gender = genderInput.value;
  const nationalId = nationalIdInput.value.trim();
  const phone = phoneInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  formError.style.display = "none";

  if (!fullName || !nationalId || !phone || !username || !password) {
    formError.textContent = "Please fill in all fields.";
    formError.style.display = "block";
    return;
  }

  // Username must be unique — but when editing, it's fine if it
  // matches the SAME student's own current username.
  const usernameOwner = getUserByUsername(username);
  const usernameTaken = usernameOwner && usernameOwner.id !== editingId;
  if (usernameTaken) {
    formError.textContent = "This username is already taken. Please choose another.";
    formError.style.display = "block";
    return;
  }

  const studentData = { name: fullName, gender, nationalId, phone, username, password };

  if (existingStudent) {
    updateStudent(existingStudent.id, studentData);
  } else {
    addStudent(studentData);
  }

  window.location.href = "students.html";
});