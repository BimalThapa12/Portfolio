// Bimal Thapa Portfolio - Interaction Controller
document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    initCustomCursor();
    initMagneticEffect();
    initHeroMarquee();
    initProjectPreview();
    initNavigationMenu();
    initRevealAnimations();
    initGalleryMarquee();
    initFooterScrollAnimation();

    // Light-theme page: frosted glass nav on scroll (hamburger handles the rest)
    if (document.body.classList.contains("light-theme")) {
        const nav = document.querySelector(".nav-container");
        window.addEventListener("scroll", () => {
            nav.classList.toggle("scrolled", window.scrollY > 60);
        });
    }
});

/* -----------------------------------------
   1. Custom Cursor Follower
----------------------------------------- */
function initCustomCursor() {
    return; // Custom cursor removed by request
    const cursor = document.getElementById("custom-cursor");
    const cursorLabel = document.getElementById("custom-cursor-label");

    if (!cursor) return;

    // Position updates using GSAP quickTo for smooth performance
    const cursorX = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });
    const labelX = gsap.quickTo(cursorLabel, "x", { duration: 0.15, ease: "power3.out" });
    const labelY = gsap.quickTo(cursorLabel, "y", { duration: 0.15, ease: "power3.out" });

    window.addEventListener("mousemove", (e) => {
        cursorX(e.clientX);
        cursorY(e.clientY);
        labelX(e.clientX);
        labelY(e.clientY);
    });

    // Handle normal links/interactive elements hover
    const links = document.querySelectorAll("a, button, .menu-toggle-btn, .project-row");
    links.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            if (!link.classList.contains("project-row")) {
                document.body.classList.add("cursor-link-hover");
            }
        });
        link.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-link-hover");
        });
    });
}

/* -----------------------------------------
   2. Magnetic Buttons Effect
----------------------------------------- */
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll(".magnetic");

    magneticElements.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            // Get coordinates relative to element center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = parseFloat(el.getAttribute("data-strength")) || 20;

            // Pull element toward cursor
            gsap.to(el, {
                x: x * (strength / 100),
                y: y * (strength / 100),
                duration: 0.4,
                ease: "power2.out"
            });

            // If it's a wrapper, also pull inner elements slightly for layering
            const innerText = el.querySelector(".btn-text, .nav-logo-link, .nav-link, .circle-btn-text, .social-link, .contact-link");
            if (innerText) {
                gsap.to(innerText, {
                    x: x * (strength / 180),
                    y: y * (strength / 180),
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });

        el.addEventListener("mouseleave", () => {
            // Elastic snap-back
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });

            const innerText = el.querySelector(".btn-text, .nav-logo-link, .nav-link, .circle-btn-text, .social-link, .contact-link");
            if (innerText) {
                gsap.to(innerText, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });
}

/* -----------------------------------------
   3. Hero Infinite Marquee
----------------------------------------- */
function initHeroMarquee() {
    const marqueeTrack = document.querySelector(".marquee-track");
    if (!marqueeTrack) return;

    // Duplicate text for seamless scrolling
    const textNode = marqueeTrack.querySelector(".marquee-text");
    const clone = textNode.cloneNode(true);
    marqueeTrack.appendChild(clone);

    // Link horizontal movement directly to page scroll
    gsap.to(".marquee-text", {
        xPercent: -4,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });
}

/* -----------------------------------------
   4. Floating Project List Preview
----------------------------------------- */
function initProjectPreview() {
    // Hover animation disabled by request
    return;
    const previewContainer = document.getElementById("floating-preview");
    const previewSlider = document.getElementById("preview-slider");
    const projectRows = document.querySelectorAll(".project-row");

    if (!workSection || !previewContainer || !previewSlider) return;

    // Track cursor positioning for image container follow
    let quickX = gsap.quickTo(previewContainer, "x", { duration: 0.45, ease: "power3.out" });
    let quickY = gsap.quickTo(previewContainer, "y", { duration: 0.45, ease: "power3.out" });

    workSection.addEventListener("mousemove", (e) => {
        quickX(e.clientX);
        quickY(e.clientY);
    });

    projectRows.forEach((row, index) => {
        row.addEventListener("mouseenter", () => {
            // Activate view cursor state
            document.body.classList.add("cursor-hover-active");

            // Show preview container
            previewContainer.classList.add("active");

            // Translate the vertical slider container to show current project slide
            // Slides represent 0%, -25%, -50%, -75% of slider height
            gsap.to(previewSlider, {
                yPercent: -25 * index,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        row.addEventListener("mouseleave", () => {
            // Remove states
            document.body.classList.remove("cursor-hover-active");
            previewContainer.classList.remove("active");
        });
    });

    // Safety net: force-hide preview when cursor leaves the work section entirely
    workSection.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover-active");
        previewContainer.classList.remove("active");
    });
}

/* -----------------------------------------
   5. Floating Sticky Header & Navigation Menu
----------------------------------------- */
function initNavigationMenu() {
    const menuToggle = document.getElementById("menu-toggle-btn");
    const menuOverlay = document.getElementById("menu-overlay");
    const menuLinks = document.querySelectorAll(".menu-nav-link");

    if (!menuToggle || !menuOverlay) return;

    const mainNavLinks = document.querySelector(".nav-links");
    const navLogo = document.querySelector(".nav-logo");

    const isLightTheme = document.body.classList.contains("light-theme");

    // Show/hide menu button based on scroll position
    function updateMenuButtonVisibility() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        if (scrollY > 120) {
            menuToggle.classList.add("visible");
            // On dark hero pages only: fade out the main nav links to avoid overlap
            if (!isLightTheme) {
                if (mainNavLinks) mainNavLinks.style.opacity = "0";
                if (mainNavLinks) mainNavLinks.style.pointerEvents = "none";
                if (navLogo) navLogo.style.opacity = "0";
                if (navLogo) navLogo.style.pointerEvents = "none";
            }
        } else {
            // Only hide if menu is closed
            if (!menuOverlay.classList.contains("open")) {
                menuToggle.classList.remove("visible");
                // CRITICAL: Kill GSAP magnetic tweens and reset inline transform
                // so CSS `transform: scale(0)` is not overridden by GSAP's residual x/y
                gsap.killTweensOf(menuToggle);
                gsap.set(menuToggle, { x: 0, y: 0, clearProps: "transform" });
                // Restore nav links (only relevant for dark-theme pages)
                if (!isLightTheme) {
                    if (mainNavLinks) mainNavLinks.style.opacity = "1";
                    if (mainNavLinks) mainNavLinks.style.pointerEvents = "auto";
                    if (navLogo) navLogo.style.opacity = "1";
                    if (navLogo) navLogo.style.pointerEvents = "auto";
                }
            }
        }
    }

    window.addEventListener("scroll", updateMenuButtonVisibility);

    // Toggle menu click
    menuToggle.addEventListener("click", () => {
        toggleMenu();
    });

    // Close menu when clicking background overlay
    const overlayBg = menuOverlay.querySelector(".menu-overlay-bg");
    if (overlayBg) {
        overlayBg.addEventListener("click", () => {
            toggleMenu(false);
        });
    }

    // Close menu when clicking link
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            toggleMenu(false);
        });
    });

    function toggleMenu(forceState) {
        const isOpen = forceState !== undefined ? !forceState : menuOverlay.classList.contains("open");

        if (!isOpen) {
            // Open Menu
            menuOverlay.classList.add("open");
            menuToggle.classList.add("active");
            menuToggle.classList.add("visible");

            // Slide in overlay links sequentially
            gsap.fromTo(".menu-nav-link",
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.2 }
            );
        } else {
            // Close Menu
            menuOverlay.classList.remove("open");
            menuToggle.classList.remove("active");

            // Re-evaluate visibility based on current scroll position
            updateMenuButtonVisibility();
        }
    }
}

/* -----------------------------------------
   6. Reveal Animations on Load + Scroll
----------------------------------------- */
function initRevealAnimations() {

    // ---- Helper: wrap element content in a clip reveal structure ----
    function wrapReveal(selector, splitWords = false) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            if (splitWords) {
                // Split text into words for a wave-like pop-up effect
                const text = el.innerText.trim();
                const words = text.split(/\s+/);
                el.innerHTML = "";
                words.forEach((word) => {
                    const outer = document.createElement("span");
                    outer.classList.add("reveal-line");
                    outer.style.display = "inline-block";
                    outer.style.verticalAlign = "top";
                    // Only add margin if it's not empty
                    if (word !== "") {
                        outer.style.marginRight = "0.25em";
                    }

                    const inner = document.createElement("span");
                    inner.classList.add("line-inner");
                    inner.innerText = word;

                    outer.appendChild(inner);
                    el.appendChild(outer);
                });
            } else {
                const inner = document.createElement("span");
                inner.classList.add("line-inner");
                inner.innerHTML = el.innerHTML;
                el.innerHTML = "";
                el.classList.add("reveal-line");
                el.appendChild(inner);
            }
        });
    }

    // ---- Helper: animate a set of .line-inner elements in on scroll ----
    function scrollReveal(selector, trigger, options = {}) {
        const {
            start = "top 88%",
            stagger = 0,
            delay = 0,
            duration = 1,
            yFrom = "110%",
            ease = "power4.out"
        } = options;

        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        gsap.fromTo(
            elements,
            { y: yFrom, opacity: 1 },
            {
                y: "0%",
                opacity: 1,
                duration,
                ease,
                stagger,
                delay,
                scrollTrigger: {
                    trigger,
                    start,
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // ---- Wrap text targets in clip containers ----
    wrapReveal(".about-lead", true);
    wrapReveal(".about-body", true);
    wrapReveal(".section-title-small");
    wrapReveal(".project-title");
    wrapReveal(".project-service");
    wrapReveal(".project-year");


    // ---- Initial page load hero reveals ----
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(".nav-logo, .nav-links div", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out"
    });

    tl.from(".portrait-wrapper", {
        scale: 1.08,
        y: 60,
        opacity: 0,
        duration: 1.6,
        ease: "power4.out"
    }, "-=0.6");

    tl.from(".location-badge", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=1.0");

    tl.from(".profession-container", {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=1.0");

    tl.from(".hero-marquee", {
        y: 10,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8");

    // ---- Scroll Reveals ----

    // About lead text
    scrollReveal(".about-lead .line-inner", ".about-section", {
        start: "top 85%",
        duration: 1.1,
        stagger: 0.02
    });

    // About body
    scrollReveal(".about-body .line-inner", ".about-section", {
        start: "top 75%",
        duration: 1,
        delay: 0.15,
        stagger: 0.015
    });

    // About button
    gsap.from(".about-details .btn-wrap", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.25,
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 75%",
            toggleActions: "play none none none"
        }
    });

    // Work section label
    scrollReveal(".work-header .line-inner", ".work-section", {
        start: "top 85%",
        duration: 0.9
    });

    // Project rows — each row slides in staggered from below
    document.querySelectorAll(".project-row").forEach((row, i) => {
        gsap.from(row, {
            y: 60,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
                trigger: ".project-list",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });

    // Project title / service / year text inside rows
    scrollReveal(".project-title .line-inner", ".project-list", {
        start: "top 80%",
        stagger: 0.1,
        duration: 0.9,
        delay: 0.1,
        yFrom: "100%"
    });

    scrollReveal(".project-service .line-inner, .project-year .line-inner", ".project-list", {
        start: "top 78%",
        stagger: 0.07,
        duration: 0.8,
        delay: 0.18,
        yFrom: "100%"
    });


}

/* -----------------------------------------
   8. Gallery Marquee Scroll Animation
----------------------------------------- */
function initGalleryMarquee() {
    const marquee = document.querySelector(".work-gallery-marquee");
    if (!marquee) return;

    gsap.to(".gallery-row-1", {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: marquee,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.fromTo(".gallery-row-2",
        { xPercent: -20 },
        {
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
                trigger: marquee,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        }
    );
}

/* -----------------------------------------
   9. Footer Scroll Animation (Curved reveal)
----------------------------------------- */
function initFooterScrollAnimation() {
    const footerReveal = document.querySelector(".footer-bg-reveal");
    const footer = document.querySelector(".footer-section");
    const footerContent = document.querySelector(".footer-section .section-container");
    if (!footerReveal || !footer || !footerContent) return;

    // Initially hide the content so it only appears when the background reveals
    gsap.set(footerContent, { opacity: 0, y: 50 });

    // Timeline that links overlay height, overlay curve, and element colors to scroll position
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: footer,
            start: "top 75%", // starts as the footer enters the viewport
            once: true        // play once and never repeat or reverse
        }
    });

    // Circle rises and flattens
    tl.to(footerReveal, {
        bottom: "-5vw",
        borderRadius: "0%",
        ease: "power2.inOut",
        duration: 1.5
    }, 0); // ← all start at 0 = perfectly in sync

    // Text colours flip EXACTLY as the circle rises
    tl.to(footer, {
        "--footer-text-color": "#ffffff",
        "--footer-border-color": "rgba(255, 255, 255, 0.1)",
        "--footer-link-border": "rgba(255, 255, 255, 0.15)",
        "--footer-label-color": "#aeafb2",
        "--footer-hover-bg": "rgba(255, 255, 255, 0.05)",
        ease: "none",
        duration: 1.5  // ← same as circle = text changes as circle covers it
    }, 0);

    // Content fades in in sync with the circle
    tl.to(footerContent, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 1.5
    }, 0.4); // ← same start as circle = fully in sync
}
