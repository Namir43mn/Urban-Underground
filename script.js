/*========================================
    UNDERGROUND CHAT - CORE ENGINE & FIREBASE
========================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyARFZiBsFAtgKAtWtMnyka52PORQFolijI",
    authDomain: "urbannoir-13ce8.firebaseapp.com",
    projectId: "urbannoir-13ce8",
    storageBucket: "urbannoir-13ce8.firebasestorage.app",
    messagingSenderId: "1059246827383",
    appId: "1:1059246827383:web:caa91c40c408d46e3b6372",
    measurementId: "G-CEPWKZXQVF"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    const overlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const loginClose = document.getElementById('loginClose');
    const exploreBtn = document.getElementById('exploreBtn');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
    const authToggle = document.getElementById('authToggle');

    let isRegisterMode = false;

    // Modal Display Controls
    function showLogin() {
        if (!overlay) return;
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => usernameInput && usernameInput.focus(), 150);
    }

    function hideLogin() {
        if (!overlay) return;
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Monitor Firebase Auth State
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            localStorage.setItem('ug_current_user_id', user.uid);
            // Fetch User Tag profile details if available
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                localStorage.setItem('ug_username', data.fullName || user.email.split('@')[0]);
                localStorage.setItem('ug_versity_id', data.versityId || '0000');
            }
        } else {
            // Unauthenticated state fallback check
            if (!localStorage.getItem('ug_current_user_id')) {
                showLogin();
            }
        }
    });

    // Close Modal Handlers
    loginClose && loginClose.addEventListener('click', hideLogin);
    exploreBtn && exploreBtn.addEventListener('click', hideLogin);

    // Header Trigger Links
    document.querySelectorAll('.login, .join').forEach(link => {
        link.addEventListener('click', (e) => {
            const uid = localStorage.getItem('ug_current_user_id');
            if (!uid) {
                e.preventDefault();
                showLogin();
            }
        });
    });

    // Hero Action Triggers
    document.querySelectorAll('.hero .primary-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const uid = localStorage.getItem('ug_current_user_id');
            if (!uid) {
                e.preventDefault();
                showLogin();
            }
        });
    });

    // Register / Login Mode Switcher
    if (authToggle) {
        authToggle.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;
            
            if (submitBtn) {
                submitBtn.textContent = isRegisterMode ? "REGISTER TAG" : "ENTER TUNNEL";
            }
            authToggle.textContent = isRegisterMode 
                ? "Already have a signal? Log In" 
                : "Need a new tag? Register";
        });
    }

    // Auth Form Submission
    loginForm && loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value.trim() : "";
        const username = usernameInput ? usernameInput.value.trim() : "Anonymous Tagger";

        if (!email || !password) {
            alert("Please enter both email and key passcode.");
            return;
        }

        try {
            if (isRegisterMode) {
                // Register User
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Create initial profile in Firestore
                const tagId = Math.floor(1000 + Math.random() * 9000).toString();
                await setDoc(doc(db, "users", user.uid), {
                    fullName: username,
                    email: email,
                    versityId: tagId,
                    createdAt: serverTimestamp(),
                    photo: ""
                });

                localStorage.setItem('ug_current_user_id', user.uid);
                localStorage.setItem('ug_username', username);
                localStorage.setItem('ug_versity_id', tagId);
            } else {
                // Sign In User
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                localStorage.setItem('ug_current_user_id', user.uid);
            }

            hideLogin();
        } catch (error) {
            console.error("Authentication Error:", error.message);
            alert("Signal transmission failed: " + error.message);
        }
    });
});

/*========================================
        NAVBAR STYLING ON SCROLL
========================================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.scrollY > 40) {
        header.style.background = "rgba(5,5,5,.85)";
        header.style.borderBottom = "1px solid rgba(255,255,255,.08)";
    } else {
        header.style.background = "rgba(5,5,5,.35)";
        header.style.borderBottom = "1px solid rgba(255,255,255,.04)";
    }
});

/*========================================
        HERO PARALLAX EFFECT
========================================*/

const hero = document.querySelector(".hero");

if (hero) {
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 35;
        const y = (window.innerHeight / 2 - e.clientY) / 35;
        hero.style.transform = `translate(${x}px,${y}px)`;
    });
}

/*========================================
        FLOATING TAGS ANIMATION
========================================*/

document.querySelectorAll(".floating-tag").forEach((tag, index) => {
    window.addEventListener("mousemove", (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        tag.style.transform = `
            translate(${x * 20 * (index + 1)}px, ${y * 20 * (index + 1)}px)
            rotate(${index * 6 - 8}deg)
        `;
    });
});

/*========================================
        BUTTON HOVER EFFECTS
========================================*/

document.querySelectorAll(".primary-btn, .secondary-btn").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        btn.style.transform = "translateY(-5px) scale(1.05)";
    });
    
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
    });
});

/*========================================
        REVEAL ELEMENTS ON SCROLL
========================================*/

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: .15 });

document.querySelectorAll(
    ".feature-card, .wall-section, .community, .cta, .stats div"
).forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(60px)";
    el.style.transition = ".8s ease";
    
    observer.observe(el);
});
