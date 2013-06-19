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

        NOTIFIER_OPTIONS.access_token = window.localStorage.access_token;
        API = API.init(NOTIFIER_OPTIONS);
        var authorize = $('.js-authorize');
        var running = $('.js-running');
        var last_mention_time = 0;

        var swap_panels = function () {
            authorize.addClass('hide');
            running.removeClass('hide');
        };

        API.users().done(function (data) {
            running.find('.authorized-user').css({
                'background-image': 'url(' + data.data.cover_image.url + ')'
            });
            running.find('.js-username').text(data.data.username);
            running.find('.js-user-bio').html(data.data.description.html);
            swap_panels();
        });

        if (!window.webkitNotifications) {
          alert("Notifications are not supported for this Browser/OS version yet.");
          return;
        }

        if (window.webkitNotifications.checkPermission() !== 0) {
            $('.js-ask-permission').addClass('show').on('click', '.js-request-notifications', function () {
                window.webkitNotifications.requestPermission(function () {
                    init_notifications();
                    return false;
                });
            });

            return false;
        }

        var poll_for_new_mentions = function (callback) {
            API.mentions().done(function (data) {
                callback(data);
            });
        };

        poll_for_new_mentions(function (data) {
            $.each(data.data, function (i, el) {
                date = 0 + Date.parse(el.created_at);
                if (date > last_mention_time) {
                    last_mention_time = date;
                }
            });
        });

        var announce = function (mention) {
            
            console.log('new mention', mention);
            var notification = window.webkitNotifications.createNotification(
                mention.user.avatar_image.url,
                mention.user.username + ' mentioned you on App.net',
                mention.text
            );

            notification.onshow  = notification.ondisplay = function() { setTimeout(function() { notification.cancel(); }, 4000); };

            notification.onclick = function () {
                window.open('https://alpha.app.net/' + mention.user.username + '/post/' + mention.id, '_blank');
            };

            notification.show();
        };

        setInterval(function () {
            poll_for_new_mentions(function (data) {
                $.each(data.data, function (i, el) {
                    date = 0 + Date.parse(el.created_at);
                    if (date > last_mention_time) {
                        last_mention_time = date;
                        announce(el);
                    }
                });
            });
        }, 15000);


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