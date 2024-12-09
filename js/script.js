document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  // Toggle dropdown menu on click
  dropdownToggle.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  // Close the dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("show");
    }
  });
});



// Back to top button functionality
// document.getElementById("back-to-top").addEventListener("click", () => {
// window.scrollTo({
//   top: 0,
//   behavior: "smooth"
// });
// });

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navbar1 = document.getElementById("navbar1");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    navbar1.classList.toggle("navbarcolor");

    
  });
});





