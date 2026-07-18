
(function seed() {

    if (getUsers().length > 0) {
        return;
    }


    // Teacher account

     addUser({
        role: "Teacher",
        name: "khaled ahmad",
        gender: "Male",
        nationalId: "1998456712",
        phone: "0791234567",
        email: "khaled.ahmad@examtrack.com",
        username: "teacher",
        password: "teacher123",
    });


    // Student account for testing

    addStudent({
        name: "abd alkrem",
        gender: "Male",
        nationalId: "2000666272",
        phone: "0789889203",
        username: "abd",
        password: "student123",
    });

})();