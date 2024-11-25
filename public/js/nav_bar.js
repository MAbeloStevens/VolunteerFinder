let nav_bar = document.getElementById('nav_bar');

const currentUrl = window.location.href;

for (const child of nav_bar.children) {
    // if on nav_bar element page
    if (child.href === currentUrl) {
        // add nav_active styling to current nav element
        child.classList.add("nav_active");
    }
}