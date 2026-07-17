
const STORAGE_KEYS = {
  USERS: "exam_users",
  EXAMS: "exam_exams",
  RESULTS: "exam_results",
  SESSION: "exam_session",
};


// generate Id 
function generateId(prefix) {
  const counterKey = `counter_${prefix}`;                          
  const current = Number(localStorage.getItem(counterKey)) || 0;   
  const next = current + 1;                                        
  localStorage.setItem(counterKey, next);                         
  return `${prefix}_${next}`;                                     
}

// 
function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (err) {
    console.error("storage.js: failed to parse JSON, using fallback", err);
    return fallback;
  }
}

//users general
function getUsers(){
    return safeParse(localStorage.getItem(STORAGE_KEYS.USERS),[]);
}
function saveUsers(users){
    localStorage.setItem(STORAGE_KEYS.USERS,JSON.stringify(users))
}

function addUser(user){
    const users=getUsers();
    const newUser={id:generateId("u"),...user}
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

function getUserByUsername(username) {
  return getUsers().find((u) => u.username === username) || null;
}

function getUserById(id){
  return getUsers().find((u)=>u.id===id)||null;
}



//student
function getStudents(){
  return getUsers().filter((u)=>u.role==="Student")
}

function addStudent(user){
return addUser({...user,role:"Student"})
}
function getStudentById(id) {
  const user = getUserById(id);
  return user && user.role === "Student" ? user : null;
}



//teacher
function getTeacher(){
  return getUsers().filter((u)=>u.role==="Teacher")
}


//exams
function getExams() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.EXAMS), []);
}
function saveExams(exams) {
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
}
function getExamById(id) {
  return getExams().find((e) => e.id === id) || null;
}

function addExam(examData) {
  const exams = getExams();
  const newExam = {
    id: generateId("e"),
    status: "Inactive",
    questions: [],
    ...examData,
  };
  exams.push(newExam);
  saveExams(exams);
  return newExam;
}
function getActiveExams() {
  return getExams().filter((e) => e.status === "Active");
}






//result
function getResults() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.RESULTS), []);
}

function saveResults(results) {
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
}

function getResultsByStudent(studentId) {
  return getResults().filter((r) => r.studentId === studentId);
}

function getResultByStudentAndExam(studentId, examId) {
  return (
    getResults().find(
      (r) => r.studentId === studentId && r.examId === examId
    ) || null
  );
}



// who is logged in
function setSession(user) {
  const session = { id: user.id, role: user.role };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
}

function getSession() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.SESSION), null);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

function isLoggedIn() {
  return getSession() !== null;
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUserById(session.id);
}