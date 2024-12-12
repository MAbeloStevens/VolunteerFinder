// make the 'interested button' send a PATCH request to /api/organization/:o_id (should use window.location.href) 
(function ($) {

    let interestBtn = $('#interestBtn');

    interestBtn.on('click', function (event) {
        event.preventDefault();

        const currentUrl = new URL(window.location.href);
        let requestConfig = {
            method: 'POST',
            url: '/api' + currentUrl.pathname,
            data: {}
        };

        // // switch from whatever it was
        // interestBtn.toggleClass("interested");

        // if (interestBtn.classList.contains("interested")) {
        //     // user clicked the button to make them interested


        // } else {
        //     // user clicked the button to make them notInterested

        // }
    });
})(window.jQuery);
