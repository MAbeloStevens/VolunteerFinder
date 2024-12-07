// gets a cookie by name by parsing through document cookies 
function getCookie(name) { /// SWITCHED TO EXPRESS-SESSION, DONT NEED THIS ANYMORE
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null; // Cookie not found
};

export { getCookie };