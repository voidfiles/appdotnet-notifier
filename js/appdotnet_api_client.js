window.APPDOTNET = (function () {

    var default_options = {
        api_host: 'api.app.net',
        auth_host: 'alpha.app.net',
        url_base: '/stream/0/'
    };

    var API = {

        /* Before init you need to get an access token */

        get_authorization_url: function (scopes) {

        },

        init: function (options) {
            this.options = $.extend({}, default_options, options);
            this.options.root_url = 'https://' + this.options.api_host + this.options.url_base;

            if (!this.options.access_token) {
                throw 'You must initialize the API with an access_token or it wont work';
            }

            if (this.options.no_globals) {
                delete window.APPDOTNET;
            }

            return this;
        },

        request: function (location, ajax_options) {

            ajax_options.url = this.options.root_url + location;

            return $.ajax(ajax_options);
        },

        post: function (text, reply_to) {
            var options = {
                type: 'POST',
                data: {
                    text: text
                }
            };

            if (reply_to) {
                options.data.reply_to = reply_to;
            }

            return this.request('posts', options);
        },

        follow: function (user_id, new_state) {
            var options = {
                data: {
                    user_id: user_id
                }
            };
            if (new_state === 1) {
                // performing a follow
                options.type = 'POST';
            } else if (new_state === 0) {
                // performing an unfollow
                options.type = 'DELETE';
            } else {
                throw "Invalid follow state.";
            }
            return this.request('users/' + user_id + '/follow', options);
        },
        delete_post: function (post_id) {
            var options = {
                type: 'DELETE'
            };

            var url = 'posts/' + post_id;

            return this.request(url, options);
        }
    };

    return API;

}());