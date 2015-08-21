$(document).ready(function () {

    // Change btn styling and send AJAX GET '/trackid' on clicking "Track"
    $(function trackClick() {
        $('.card-container').on("click", function() {
            $(this).find('.track').css('background-color', '#34CF7A');
            $(this).find('.track').html('<div class="fa fa-check"></div> Tracking');

            var trackId = $(this).find('.id').html();
            var trackUserName = $(this).find('.name').html();

            $.ajax({
                url: '/trackid',
                type: 'GET',
                data: {
                    twitterId: trackId,
                    name: trackUserName
                },
                ContentType: 'json',
                success: function (data, status) { console.log('Data: ' + data + '\nStatus: ' + status); },
                error: function (err) { console.error('GET /trackid failed due to ' + err); }
            });

        });
    });

    // Pass userhandle to getVerifiedFriends() on GET '/filter-verified'
    $(function filterVerified() {
        var userhandle = $('.userhandle').html();

        $('.filter-verified').on('click', function () {
            console.log(userhandle);
            $.ajax({
                url: '/filter-verified',
                type: 'GET',
                data: { userhandle: userhandle },
                ContentType: 'json',
                success: function (data, status) { console.log('Data: ' + data + '\nStatus: ' + status); },
                error: function (err) { console.error('GET /filter-verified failed due to: ' + err); }
            });

        });
    });

});
