(function () {
    var API = window.APPDOTNET;

    var init_authorize = function () {
        console.log('initializing authorize');
        $('.js-authorize-click').on('click', function () {
            // If the user isn't authorized wait for them to click on the authorize links
            // then send them through the app.net api
            var url = API.get_authorization_url(NOTIFIER_OPTIONS);
            window.location.href = url;
        });
    };

    var init_notifications = function () {
        console.log('initializing notifications');
        NOTIFIER_OPTIONS.access_token = window.localStorage.access_token;
        API = API.init(NOTIFIER_OPTIONS);
        var authorize = $('.js-authorize');
        var running = $('.js-running');

        var swap_panels = function () {
            authorize.addClass('hide');
            running.removeClass('hide');
        };

        API.users().done(function (data) {
            running.find('.authorized-user').css({
                'background-image': 'url(' + data.cover_image.url + ')'
            });
            running.find('.js-username').text(data.username);
            running.find('.js-user-bio').html(data.description.html);
            swap_panels();
        });


    };

    if (window.location.hash !== '' && !window.localStorage.access_token) {
        var keys = URI('?' + window.location.hash.slice(1)).query(true);
        if (keys && keys.access_token) {
            window.localStorage.access_token = keys.access_token;
        }
    }

    if (window.localStorage.access_token) {
        init_notifications();
    } else {
        init_authorize();
    }
}());