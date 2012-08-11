(function () {
    var API = window.APPDOTNET;
    var options = NOTIFIER_OPTIONS;

    $('.js-authorize-action').on('click', function () {
        // If the user isn't authorized wait for them to click on the authorize links
        // then send them through the app.net api
        var url = API.get_authorize_url(options);
        window.location.href = url;
    });
}());