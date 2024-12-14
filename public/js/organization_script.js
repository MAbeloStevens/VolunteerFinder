// make the 'interested button' send a PATCH request to /api/organization/:o_id (should use window.location.href) 
(function ($) {

    let interestBtn = $('#interestBtn');

    interestBtn.on('click', function (event) {
        event.preventDefault();

        // switch interested from whatever it was
        interestBtn.toggleClass("interested");

        const currentUrl = new URL(window.location.href);
        let requestConfig = {
            method: 'PATCH',
            url: '/api' + currentUrl.pathname,
            data: {interested: interestBtn.hasClass("interested")}
        };
        console.log(requestConfig.url);
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
        });
    });
})(window.jQuery);
