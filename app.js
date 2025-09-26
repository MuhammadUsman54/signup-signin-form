 class User {
      constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = firstName + " " + lastName;
        this.email = email;
        this.password = password;
      }
    }

    // User Manager Class
    class UserManager {
      constructor() {
        this.users = JSON.parse(localStorage.getItem("users")) || [];
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || null;
      }

      saveUsers() {
        localStorage.setItem("users", JSON.stringify(this.users));
      }

      signup(firstName, lastName, email, password) {
        if (!firstName || !lastName || !email || !password) {
          Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill all fields!" });
          return;
        }

        let userExists = this.users.some(u => u.email === email);
        if (userExists) {
          Swal.fire({ icon: "error", title: "Duplicate Email", text: "User already exists with this email!" });
          return;
        }

        let newUser = new User(firstName, lastName, email, password);
        this.users.push(newUser);
        this.saveUsers();

        Swal.fire({ icon: "success", title: "Signup Successful!", text: "Now you can sign in." })
          .then(() => showSignin());
      }

      signin(email, password) {
        let validUser = this.users.find(u => u.email === email && u.password === password);

        if (validUser) {
          this.loggedInUser = validUser;
          localStorage.setItem("loggedInUser", JSON.stringify(validUser));

          Swal.fire({ icon: "success", title: "Welcome Back!", text: "Hello " + validUser.fullName })
            .then(() => showDashboard(validUser.fullName));
        } else {
          Swal.fire({ icon: "error", title: "Invalid Credentials", text: "Email or password is incorrect!" });
        }
      }

      logout() {
        this.loggedInUser = null;
        localStorage.removeItem("loggedInUser");

        Swal.fire({ icon: "info", title: "Logged Out", text: "You have been logged out successfully." })
          .then(() => showSignin());
      }
    }

    const userManager = new UserManager();

    // UI Functions
    function showSignin() {
      document.getElementById("signupForm").classList.add("hidden");
      document.getElementById("dashboard").classList.add("hidden");
      document.getElementById("signinForm").classList.remove("hidden");
    }

    function showSignup() {
      document.getElementById("signinForm").classList.add("hidden");
      document.getElementById("dashboard").classList.add("hidden");
      document.getElementById("signupForm").classList.remove("hidden");
    }

    function showDashboard(name) {
      document.getElementById("signupForm").classList.add("hidden");
      document.getElementById("signinForm").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      document.getElementById("userName").innerText = name;
    }

    // Bind with UI
    function signup() {
      let firstName = document.getElementById("signupFirstName").value;
      let lastName = document.getElementById("signupLastName").value;
      let email = document.getElementById("signupEmail").value;
      let password = document.getElementById("signupPassword").value;

      userManager.signup(firstName, lastName, email, password);
    }

    function signin() {
      let email = document.getElementById("signinEmail").value;
      let password = document.getElementById("signinPassword").value;

      userManager.signin(email, password);
    }

    function logout() {
      userManager.logout();
    }

    // Auto-load dashboard if logged in
    window.onload = function() {
      if (userManager.loggedInUser) {
        showDashboard(userManager.loggedInUser.fullName);
      }
    }