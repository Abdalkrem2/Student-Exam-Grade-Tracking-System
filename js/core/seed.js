 
(function seed() {
  if (getUsers().length > 0) return;
 
  // --- Teacher account ---
  addUser({
    role: "Teacher",
    name: "khaled ahmad",
    username: "teacher",
    password: "teacher123",
  });
 
  // ---  student for test ---
  const student1 = addStudent({
    name: "abd alkrem",
    gender: "Male",
    nationalId: "2000666272",
    phone: "0789889203",
    username: "abd",
    password: "student123",
  });
})();