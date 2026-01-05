// ===== main.js =====

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzZrtZGr-0bo23rVvGv89hOWvYHP_sS2w",
  authDomain: "remex-cyber.firebaseapp.com",
  projectId: "remex-cyber",
  storageBucket: "remex-cyber.firebasestorage.app",
  messagingSenderId: "375974698968",
  appId: "1:375974698968:web:1385ab741061cb23ac1cad",
  measurementId: "G-DW1GBDCW3T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ===== AUTH FUNCTIONS =====
function signup() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  if(!email || !password) return alert("Email and password required!");
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Account created successfully!"))
    .catch(err => alert(err.message));
}

function login() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  if(!email || !password) return alert("Email and password required!");
  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("Logged in successfully!"))
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut().then(() => alert("Logged out successfully!"));
}

// ===== DARK/LIGHT MODE =====
function toggleMode() {
  document.body.classList.toggle("dark-mode");
}

// ===== NAVBAR =====
function renderNavbar() {
  const nav = document.querySelector("nav");
  if(nav) nav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="courses.html">Courses</a>
    <a href="dashboard.html">Dashboard</a>
    <a href="sandbox.html">Sandbox</a>
    <a href="ai.html">AI Tutor</a>
    <a href="quiz.html">Quizzes</a>
    <a href="achievements.html">Achievements</a>
    <a href="contact.html">Contact</a>
  `;
}

// Render navbar on page load
document.addEventListener("DOMContentLoaded", renderNavbar);
