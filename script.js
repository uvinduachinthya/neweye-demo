// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavLinks = document.querySelector('.mobile-nav-links');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a'); // Select links from both navs
    const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('.material-symbols-outlined') : null;

    if (mobileMenuBtn && mobileNavLinks && menuIcon) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavLinks.classList.toggle('active');
            const isActive = mobileNavLinks.classList.contains('active');
            // Toggle burger icon to 'X' (close)
            menuIcon.textContent = isActive ? 'close' : 'menu';
            mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        // Close mobile menu when a link is clicked
        mobileNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavLinks.classList.remove('active');
                menuIcon.textContent = 'menu'; // Reset icon
                 mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth scrolling for anchor links & Active Nav Link Highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    updateActiveNavLink(href); // Update active link immediately
                }
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLinkOnScroll() {
        let currentSectionId = '';
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const scrollThreshold = window.pageYOffset + headerHeight + window.innerHeight * 0.4; // Active when 40% from top

        sections.forEach(section => {
            if (section.offsetTop <= scrollThreshold) {
                 currentSectionId = '#' + section.getAttribute('id');
            }
        });

         // Check if bottom of the page is reached, force last section active
         if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) {
             currentSectionId = '#' + sections[sections.length - 1].id;
         }

        updateActiveNavLink(currentSectionId);
    }

    function updateActiveNavLink(activeHref) {
         navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
             // Use includes check for mobile nav links potentially closing the menu
            if (linkHref === activeHref) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateActiveNavLinkOnScroll(); // Initial check
    window.addEventListener('scroll', updateActiveNavLinkOnScroll);


    // Testimonial Slider
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const track = slider.querySelector('.testimonial-track');
        const slides = Array.from(track?.children || []);
        const nextButton = slider.querySelector('.next');
        const prevButton = slider.querySelector('.prev');
        let slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
        let currentSlideIndex = 0;
        let autoPlayInterval = null;

        function updateSlideWidth() {
            if (slides.length > 0) {
                slideWidth = slides[0].getBoundingClientRect().width;
            }
        }

        const moveToSlide = (targetIndex) => {
            if (slides.length === 0 || !track) return;

            // Ensure index wraps around
            const newIndex = (targetIndex + slides.length) % slides.length;

            track.style.transform = 'translateX(-' + slideWidth * newIndex + 'px)';
            slides.forEach((s, i) => s.classList.toggle('active', i === newIndex));
            currentSlideIndex = newIndex;
        };

        const startAutoPlay = () => {
             if (autoPlayInterval) clearInterval(autoPlayInterval); // Clear existing interval
             if (slides.length > 1) { // Only autoplay if more than one slide
                 autoPlayInterval = setInterval(() => {
                     moveToSlide(currentSlideIndex + 1);
                 }, 5000);
             }
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        };

         if (slides.length > 1 && track && nextButton && prevButton) {
            slides.forEach((s, i) => s.classList.toggle('active', i === 0)); // Set initial active slide

            nextButton.addEventListener('click', () => {
                moveToSlide(currentSlideIndex + 1);
                stopAutoPlay(); // Stop autoplay on manual interaction
                startAutoPlay(); // Restart autoplay timer
            });

            prevButton.addEventListener('click', () => {
                moveToSlide(currentSlideIndex - 1);
                 stopAutoPlay();
                 startAutoPlay();
            });

            slider.addEventListener('mouseenter', stopAutoPlay);
            slider.addEventListener('mouseleave', startAutoPlay);

            window.addEventListener('resize', () => {
                 updateSlideWidth();
                 track.style.transition = 'none'; // Disable transition during resize adjustment
                 track.style.transform = 'translateX(-' + slideWidth * currentSlideIndex + 'px)';
                 // Force reflow / repaint before re-enabling transition
                 void track.offsetWidth;
                 track.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
             });

            startAutoPlay(); // Initial start

        } else {
             if (nextButton) nextButton.style.display = 'none';
             if (prevButton) prevButton.style.display = 'none';
              slides.forEach((s, i) => s.classList.toggle('active', i === 0)); // Ensure first slide is active even if only one
        }
    }


    // Course Modal Functionality
    const courseModal = document.getElementById('course-modal');
    const courseBtns = document.querySelectorAll('.course-btn');
    const closeModalBtn = courseModal ? courseModal.querySelector('.close-modal') : null;

    // --- Placeholder Course Data (URLs updated) ---
    const courseData = {
        'data-science': {
            title: "Data Science & Analytics",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300&q=80", // Larger for modal
            duration: "6 Months",
            level: "Intermediate",
            students: "200+",
            description: `...`, // Keep description from previous step
            curriculum: [
                { title: "Module 1: Introduction to Data Science", lessons: [{ name: "What is Data Science?", duration: "10 min" }, { name: "Python Basics Refresher", duration: "45 min" }] },
                { title: "Module 2: Data Wrangling & Cleaning", lessons: [{ name: "Intro to Pandas", duration: "30 min" }, { name: "Handling Missing Data", duration: "25 min" }] },
                { title: "Module 3: Statistical Analysis", lessons: [{ name: "Descriptive Statistics", duration: "35 min" }, { name: "Inferential Statistics", duration: "40 min" }] },
            ] // Keep curriculum from previous step
        },
        'web-development': {
            title: "Full-Stack Web Development",
            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300&q=80",
            duration: "4 Months",
            level: "Beginner to Intermediate",
            students: "350+",
            description: `...`, // Keep description
             curriculum: [
                 { title: "Module 1: HTML & CSS Fundamentals", lessons: [{ name: "Semantic HTML", duration: "20 min" }, { name: "CSS Selectors & Box Model", duration: "30 min" }] },
                 { title: "Module 2: JavaScript Essentials", lessons: [{ name: "Variables & Data Types", duration: "25 min" }, { name: "DOM Manipulation", duration: "40 min" }] },
             ] // Keep curriculum
        },
         'business-management': {
             title: "Business Management & Leadership",
             image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300&q=80",
             duration: "12 Months",
             level: "All Levels",
             students: "180+",
             description: `...`, // Keep description
             curriculum: [
                  { title: "Module 1: Introduction to Management", lessons: [{ name: "Evolution of Management Thought", duration: "25 min" }, { name: "Functions of Management", duration: "30 min" }] },
                  { title: "Module 2: Marketing Essentials", lessons: [{ name: "Understanding the Market", duration: "35 min" }, { name: "The Marketing Mix (4 Ps)", duration: "40 min" }] },
             ] // Keep curriculum
         }
    };
    // Make sure to copy the full descriptions and curriculum arrays from the previous response if they were omitted here with "..."

     const openModal = (courseId) => {
         const data = courseData[courseId];
         if (!data || !courseModal) return;

         courseModal.querySelector('#modal-course-title').textContent = data.title;
         const modalImage = courseModal.querySelector('#modal-course-image');
         modalImage.src = data.image;
         modalImage.alt = data.title;

         courseModal.querySelector('#modal-course-duration span:last-child').textContent = data.duration;
         courseModal.querySelector('#modal-course-level span:last-child').textContent = data.level;
         courseModal.querySelector('#modal-course-students span:last-child').textContent = data.students;

         courseModal.querySelector('#modal-course-description').innerHTML = data.description;

         const curriculumContainer = courseModal.querySelector('#modal-course-curriculum');
         curriculumContainer.innerHTML = ''; // Clear previous
         if (data.curriculum && data.curriculum.length > 0) {
            data.curriculum.forEach(module => {
                const moduleDiv = document.createElement('div');
                moduleDiv.className = 'curriculum-module';

                const headerDiv = document.createElement('div');
                headerDiv.className = 'module-header';
                headerDiv.innerHTML = `
                    <span>${module.title}</span>
                    <span class="material-symbols-outlined expand-icon">expand_more</span>
                `;

                const contentDiv = document.createElement('div');
                contentDiv.className = 'module-content';
                if (module.lessons && module.lessons.length > 0) {
                    module.lessons.forEach(lesson => {
                        contentDiv.innerHTML += `
                            <div class="lesson">
                                <span class="lesson-title"><span class="material-symbols-outlined">play_circle</span> ${lesson.name}</span>
                                <span class="lesson-duration">${lesson.duration}</span>
                            </div>`;
                    });
                } else { contentDiv.innerHTML = '<p>No lessons listed.</p>'; }

                moduleDiv.appendChild(headerDiv);
                moduleDiv.appendChild(contentDiv);
                curriculumContainer.appendChild(moduleDiv);

                // Add accordion toggle listener
                headerDiv.addEventListener('click', () => {
                    const isActive = headerDiv.classList.toggle('active');
                    contentDiv.classList.toggle('active');
                     if (isActive) {
                         contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
                         headerDiv.querySelector('.expand-icon').textContent = 'expand_less'; // Change icon
                     } else {
                         contentDiv.style.maxHeight = '0';
                          headerDiv.querySelector('.expand-icon').textContent = 'expand_more'; // Change icon back
                     }
                });
            });
         } else { curriculumContainer.innerHTML = '<p>Curriculum details not available.</p>'; }

         courseModal.classList.add('active');
         document.body.style.overflow = 'hidden';
     };

     const closeModal = () => {
         if (courseModal) {
             courseModal.classList.remove('active');
             document.body.style.overflow = '';
         }
     };

    courseBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const courseCard = button.closest('.course-card');
            if (courseCard) {
                const courseId = courseCard.getAttribute('data-course');
                 openModal(courseId);
            }
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (courseModal) courseModal.addEventListener('click', (e) => { if (e.target === courseModal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && courseModal?.classList.contains('active')) closeModal(); });


     // Set current year in footer
     const yearSpan = document.getElementById('current-year');
     if (yearSpan) yearSpan.textContent = new Date().getFullYear();

}); // End DOMContentLoaded