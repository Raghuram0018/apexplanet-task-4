// Data for certifications
const certifications = [
  {
    title: "AWS Cloud Foundations .",
    issuer: " AWS Academy ",
    date: "April 2025",
    link: "https://i.postimg.cc/1z46GBZ1/IMG-20250807-WA0012-1.jpg",
  },
  {
    title: "Generative AI Foundations",
    issuer: "AWS Academy",
    date: "June 2025",
    link: "https://i.postimg.cc/1z46GBZ1/IMG-20250807-WA0012-1.jpg",
  },
  {
    title: "Full-Stack Web Development Bootcamp",
    issuer: "GeeksforGeeks",
    date: "June 2025",
    link: "https://i.postimg.cc/1z46GBZ1/IMG-20250807-WA0012-1.jpg",
  },
  {
    title: "Cybersecurity-Job Simulation",
    issuer: "Deloitte",
    date: "July 2025",
    link: "https://i.postimg.cc/1z46GBZ1/IMG-20250807-WA0012-1.jpg",
  },
  {
    title: "Data Analytics-Job Simulation",
    issuer: "Deloitte",
    date: "July 2025",
    link: "#",
  },
  {
    title: "GenAI Powered Data Analytics- Job simulaton",
    issuer: "Tata",
    date: "July 2025",
    link: "https://i.postimg.cc/1z46GBZ1/IMG-20250807-WA0012-1.jpg",
  },
  
  {
    title: "Front-End Software Engineering- Job simulation",
    issuer: "Skyscanner",
    date: "July 2025",
    link: "https://i.postimg.cc/1z46GBZ1/IMG-20250807-WA0012-1.jpg",
  },
];

// Function to render certifications
function renderCertifications() {
  const container = document.getElementById("certifications-container");
  if (!container) return;

  container.innerHTML = certifications
    .map(
      (cert) => `
    <div class="p-6 rounded-xl bg-gray-900 shadow-xl shadow-fuchsia-950 transform transition-transform duration-500 hover:scale-105 hover:shadow-cyan-500/30">
      <h3 class="text-xl font-bold text-fuchsia-400 mb-2">${cert.title}</h3>
      <p class="text-sm text-gray-400 mb-1">${cert.issuer}</p>
      <p class="text-xs text-gray-500 mb-4">${cert.date}</p>
      <a href="${cert.link}" target="_blank" rel="noopener noreferrer" class="inline-block px-4 py-2 text-sm font-semibold text-gray-900 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full transition-all duration-300">
        View Credential
      </a>
    </div>
  `
    )
    .join("");
}

// Data for projects (for filtering)
// All projects are now categorized as "Front-End"
const projects = [
  {
    category: "Front-End",
    html: `
      <div class="project-card group relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/50 transform-gpu transition-all duration-500 hover:scale-105" data-category="Front-End">
        <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="https://placehold.co/600x400/1e293b/d1d5db?text=Project+1" alt=" Quizy Game " class="w-full h-56 object-cover rounded-t-2xl transform transition-transform duration-500 group-hover:scale-110" />
        <div class="p-6 relative z-10">
          <h3 class="text-2xl font-bold mb-2 text-fuchsia-400">Quizy Game. </h3>
          <p class="text-gray-400 mb-4 text-sm">A fun and engaging web-based game built with JavaScript and HTML5 and Css. Features include score tracking, various levels,Avatars,Sound,Dark&Light them toggle and responsive design for mobile play.</p>
          <div class="flex space-x-4 mt-6">
            <a href="https://raghuram0018.github.io/apexplanet-task-3-quiz-image-carousel-weather-api-/" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-gray-900 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full shadow-md shadow-fuchsia-500/30 hover:shadow-cyan-500/30 transition-all duration-300">Live Demo</a>
            <a href="https://github.com/Raghuram0018/apexplanet-task-3-quiz-image-carousel-weather-api-" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-fuchsia-400 border border-fuchsia-400 rounded-full hover:bg-fuchsia-400 hover:text-gray-900 transition-colors duration-300">GitHub</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    category: "Front-End",
    html: `
      <div class="project-card group relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/50 transform-gpu transition-all duration-500 hover:scale-105" data-category="Front-End">
        <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="https://placehold.co/600x400/1e293b/d1d5db?text=Project+2" alt="Portfolio Website" class="w-full h-56 object-cover rounded-t-2xl transform transition-transform duration-500 group-hover:scale-110" />
        <div class="p-6 relative z-10">
          <h3 class="text-2xl font-bold mb-2 text-fuchsia-400">Portfolio website</h3>
          <p class="text-gray-400 mb-4 text-sm">A modern portfolio website showcasing my projects and skills and only dark themed display with eye-catching design. Built with JavaScript and Tailwind CSS, it features smooth animations and a responsive layout.</p>
          <div class="flex space-x-4 mt-6">
            <a href="https://raghuram0018.github.io/portfolio-website/" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-gray-900 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full shadow-md shadow-fuchsia-500/30 hover:shadow-cyan-500/30 transition-all duration-300">Live Demo</a>
            <a href="https://github.com/Raghuram0018/portfolio-website" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-fuchsia-400 border border-fuchsia-400 rounded-full hover:bg-fuchsia-400 hover:text-gray-900 transition-colors duration-300">GitHub</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    category: "Front-End",
    html: `
      <div class="project-card group relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/50 transform-gpu transition-all duration-500 hover:scale-105" data-category="Front-End">
        <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="https://placehold.co/600x400/1e293b/d1d5db?text=Project+3" alt="E-commerce Website" class="w-full h-56 object-cover rounded-t-2xl transform transition-transform duration-500 group-hover:scale-110" />
        <div class="p-6 relative z-10">
          <h3 class="text-2xl font-bold mb-2 text-fuchsia-400">TO-DO-LIST</h3>
          <p class="text-gray-400 mb-4 text-sm">A simple and intuitive To-Do List application built with HTML, CSS, and JavaScript. It allows users to create, edit,track history using local storage,Undo&Redo functionality and delete tasks with ease and also can import and export Jsons files.</p>
          <div class="flex space-x-4 mt-6">
            <a href="https://raghuram0018.github.io/to-do-list-/" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-gray-900 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full shadow-md shadow-fuchsia-500/30 hover:shadow-cyan-500/30 transition-all duration-300">Live Demo</a>
            <a href="https://github.com/Raghuram0018/to-do-list-" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-fuchsia-400 border border-fuchsia-400 rounded-full hover:bg-fuchsia-400 hover:text-gray-900 transition-colors duration-300">GitHub</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    category: "Front-End",
    html: `
      <div class="project-card group relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/50 transform-gpu transition-all duration-500 hover:scale-105" data-category="Front-End">
        <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="https://placehold.co/600x400/1e293b/d1d5db?text=Project+4" alt="Personal Blog" class="w-full h-56 object-cover rounded-t-2xl transform transition-transform duration-500 group-hover:scale-110" />
        <div class="p-6 relative z-10">
          <h3 class="text-2xl font-bold mb-2 text-fuchsia-400">ProductListing-Filter-Sort</h3>
          <p class="text-gray-400 mb-4 text-sm">A simple and intuitive product listing page with filter and sort functionality and compare,wishlist,cart features.Built with HTML,Tailwindcss and JavaScript. It allows users to view, filter, and sort products easily.</p>
          <div class="flex space-x-4 mt-6">
            <a href="https://raghuram0018.github.io/productlisting-filter-sort/" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-gray-900 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full shadow-md shadow-fuchsia-500/30 hover:shadow-cyan-500/30 transition-all duration-300">Live Demo</a>
            <a href="https://github.com/Raghuram0018/productlisting-filter-sort" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-fuchsia-400 border border-fuchsia-400 rounded-full hover:bg-fuchsia-400 hover:text-gray-900 transition-colors duration-300">GitHub</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    category: "Front-End",
    html: `
      <div class="project-card group relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/50 transform-gpu transition-all duration-500 hover:scale-105" data-category="Front-End">
        <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="https://placehold.co/600x400/1e293b/d1d5db?text=Project+5" alt="Personal Blog" class="w-full h-56 object-cover rounded-t-2xl transform transition-transform duration-500 group-hover:scale-110" />
        <div class="p-6 relative z-10">
          <h3 class="text-2xl font-bold mb-2 text-fuchsia-400">Blog Website.</h3>
          <p class="text-gray-400 mb-4 text-sm">A simple and intuitive blog website built with HTML, CSS, and JavaScript. It allows users to create, edit, and delete blog posts with ease and also can import and export JSON files.</p>
          <div class="flex space-x-4 mt-6">
            <a href="#" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-gray-900 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full shadow-md shadow-fuchsia-500/30 hover:shadow-cyan-500/30 transition-all duration-300">Live Demo</a>
            <a href="#" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-fuchsia-400 border border-fuchsia-400 rounded-full hover:bg-fuchsia-400 hover:text-gray-900 transition-colors duration-300">GitHub</a>
          </div>
        </div>
      </div>
    `,
  },
  {
    category: "Front-End",
    html: `
      <div class="project-card group relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/50 transform-gpu transition-all duration-500 hover:scale-105" data-category="Front-End">
        <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img src="https://placehold.co/600x400/1e293b/d1d5db?text=Project+6" alt="Real-time Chat App" class="w-full h-56 object-cover rounded-t-2xl transform transition-transform duration-500 group-hover:scale-110" />
        <div class="p-6 relative z-10">
          <h3 class="text-2xl font-bold mb-2 text-fuchsia-400">Modern Image Carousel.</h3>
          <p class="text-gray-400 mb-4 text-sm">A Modern Image carousel built using Html,Css and jvascript automatically scrolls through featured project with smooth transitionsand provides an eye-catching viewing experience.</p>
          <div class="flex space-x-4 mt-6">
            <a href="https://raghuram0018.github.io/modern-image-carousel/" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-gray-900 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full shadow-md shadow-fuchsia-500/30 hover:shadow-cyan-500/30 transition-all duration-300">Live Demo</a>
            <a href="https://github.com/Raghuram0018/modern-image-carousel" target="_blank" rel="noopener noreferrer" class="px-5 py-2 text-sm font-bold text-fuchsia-400 border border-fuchsia-400 rounded-full hover:bg-fuchsia-400 hover:text-gray-900 transition-colors duration-300">GitHub</a>
          </div>
        </div>
      </div>
    `,
  },
];

// Function to render projects based on category
function renderProjects(category) {
  const container = document.getElementById("project-container");
  if (!container) return;

  const filteredProjects = category === "All" ? projects : projects.filter(p => p.category === category);
  container.innerHTML = filteredProjects.map(p => p.html).join("");
}

// Event listener for project filter buttons
document.querySelectorAll(".project-filter-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const category = e.target.dataset.category;
    // Update button styles
    document.querySelectorAll(".project-filter-btn").forEach(btn => {
      btn.classList.remove("bg-gradient-to-r", "from-fuchsia-500", "to-cyan-500", "text-gray-950");
      btn.classList.add("bg-gray-800", "text-gray-300", "hover:bg-fuchsia-900", "hover:text-cyan-400", "border", "border-transparent", "hover:border-fuchsia-400");
    });
    e.target.classList.add("bg-gradient-to-r", "from-fuchsia-500", "to-cyan-500", "text-gray-950");
    e.target.classList.remove("bg-gray-800", "text-gray-300", "hover:bg-fuchsia-900", "hover:text-cyan-400", "border", "border-transparent", "hover:border-fuchsia-400");
    
    renderProjects(category);
  });
});

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  sunIcon.classList.toggle("hidden", !isDark);
  moonIcon.classList.toggle("hidden", isDark);
});

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById("scroll-to-top");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollToTopBtn.classList.remove("hidden");
  } else {
    scrollToTopBtn.classList.add("hidden");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Contact form functionality

const contactForm = document.getElementById("contact-form");
const contactSuccessMessage = document.getElementById("contact-success-message");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // In a real application, you would send this form data to a server.
  // For this example, we'll just show a success message.
  contactForm.classList.add("hidden");
  contactSuccessMessage.classList.remove("hidden");
  
  // Reset form after a few seconds
  setTimeout(() => {
    contactForm.classList.remove("hidden");
    contactSuccessMessage.classList.add("hidden");
    contactForm.reset();
  }, 5000);
});

// Initialize the page by rendering certifications and projects
document.addEventListener("DOMContentLoaded", () => {
  renderCertifications();
  renderProjects("All");
});


