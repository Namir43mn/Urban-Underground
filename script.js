/*========================================
        UNDERGROUND CHAT
========================================*/

window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    const overlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const loginClose = document.getElementById('loginClose');
    const exploreBtn = document.getElementById('exploreBtn');
    const usernameInput = document.getElementById('username');

    function showLogin(){
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => usernameInput && usernameInput.focus(), 150);
    }

    function hideLogin(){
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
    }

    // Show on first load
    showLogin();

    // Close handlers
    loginClose && loginClose.addEventListener('click', hideLogin);
    exploreBtn && exploreBtn.addEventListener('click', hideLogin);

    // Header links to open login
    document.querySelectorAll('.login, .join').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    });

    // Hero primary that should enter tunnel (open login)
    document.querySelectorAll('.hero .primary-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showLogin();
        });
    });

    // Form submit - simple demo behaviour
    loginForm && loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // simulate login; in a real app you'd validate / call API
        hideLogin();
    });

});

/*========================================
        NAVBAR
========================================*/

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    
    if (window.scrollY > 40) {
        
        header.style.background = "rgba(5,5,5,.85)";
        header.style.borderBottom = "1px solid rgba(255,255,255,.08)";
        
    } else {
        
        header.style.background = "rgba(5,5,5,.35)";
        header.style.borderBottom = "1px solid rgba(255,255,255,.04)";
        
    }
    
});

/*========================================
        HERO PARALLAX
========================================*/

const hero = document.querySelector(".hero");

document.addEventListener("mousemove", (e) => {
    
    const x = (window.innerWidth / 2 - e.clientX) / 35;
    const y = (window.innerHeight / 2 - e.clientY) / 35;
    
    hero.style.transform = `translate(${x}px,${y}px)`;
    
});

/*========================================
        FLOATING TAGS
========================================*/

document.querySelectorAll(".floating-tag").forEach((tag, index) => {
    
    window.addEventListener("mousemove", (e) => {
        
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        tag.style.transform = `
translate(${x*20*(index+1)}px,
${y*20*(index+1)}px)
rotate(${index*6-8}deg)
`;
        
    });
    
});

/*========================================
        BUTTON EFFECT
========================================*/

document.querySelectorAll(".primary-btn,.secondary-btn").forEach(btn => {
    
    btn.addEventListener("mouseenter", () => {
        
        btn.style.transform = "translateY(-5px) scale(1.05)";
        
    });
    
    btn.addEventListener("mouseleave", () => {
        
        btn.style.transform = "";
        
    });
    
});

/*========================================
        REVEAL ON SCROLL
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
    ".feature-card,.wall-section,.community,.cta,.stats div"
).forEach(el => {
    
    el.style.opacity = "0";
    el.style.transform = "translateY(60px)";
    el.style.transition = ".8s ease";
    
    observer.observe(el);
    
});