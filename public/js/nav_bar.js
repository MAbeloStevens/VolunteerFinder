import { getCookie } from '../../helpers/helpers.js';

let nav_bar = document.getElementById('nav_bar');

const currentUrl = window.location.href;

for (const child of nav_bar.children) {
    // if on nav_bar element page
    if (child.href === currentUrl) {
        // add nav_active styling to current nav element
        child.classList.add("nav_active");
    }
}

/* if logged in, change account name and dropdown buttons */

let accountNameNav = document.getElementById('accountNameNav');
let drop_opt1 = document.getElementById('drop_opt1');
let drop_opt2 = document.getElementById('drop_opt2');

let curr_user = getCookie('user');
if(curr_user){
    let user_firstName = getCookie('firstName');
    let user_lastName = getCookie('lastName');

    accountNameNav.innerHTML = user_firstName + ' ' + user_lastName;
    drop_opt1.innerHTML = 'Log out';
    drop_opt1.href = "/logout";
    drop_opt2.innerHTML = 'Delete Account';
    drop_opt2.href = "/deleteAccount";
}

