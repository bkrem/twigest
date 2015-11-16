/*jshint laxcomma:true*/
$(document).ready(function () {

    var userhandle = $('.userhandle').html();

    // Change btn styling and send AJAX GET '/trackid' on clicking "Track"
    $(function trackClick() {
        $('.card-container').on("click", function() {
            // Styling
            $(this).find('.track').css('background-color', '#34CF7A');
            $(this).find('.track').html('<div class="fa fa-check"></div> Tracking');

            // Tracking AJAX
            var trackId = $(this).find('.id').html()
            ,   trackUserName = $(this).find('.name').html()
            ,   trackDescription = $(this).find('.desc-detail').html()
            ,   trackHandle = $(this).find('.handle').html()
            ,   isVerified = $(this).find('.icon-verified').length !== 0 ? true : false
            ,   statuses_count = $(this).find('.statuses_count').html()
            ,   followers_count = $(this).find('.followers_count').html()
            ,   friends_count = $(this).find('.friends_count').html();

            $.ajax({
                url: '/trackid',
                type: 'GET',
                data: {
                    userhandle: userhandle,
                    twitterId: trackId,
                    name: trackUserName,
                    handle: trackHandle,
                    description: trackDescription,
                    verified: isVerified,
                    statuses_count: statuses_count,
                    followers_count: followers_count,
                    friends_count: friends_count
                },
                ContentType: 'json',
                success: function (data, status) { console.log('Data: ' + data + '\nStatus: ' + status); },
                error: function (err) { console.error('GET /trackid failed due to ' + err); }
            });

        });
    });


    /**
     * FILTER AJAX
     */

    // Pass userhandle to getVerifiedFriends() on GET '/show-verified'
    $(function filterVerified() {
        $('.show-verified').on('click', function () {
            $.ajax({
                url: '/show-verified',
                type: 'GET',
                data: { handle: userhandle },
                ContentType: 'json',
                success: function (data, status) { console.log('Data: ' + data + '\nStatus: ' + status); },
                error: function (err) { console.error('GET /show-verified failed due to: ' + err); }
            });

        });
    });

    $(function filterTech() {
        $('.show-tech').on('click', function () {
            $.ajax({
                url: '/show-tech',
                type: 'GET',
                ContentType: 'json',
                data: { handle: userhandle },
                success: function (data, status) { console.log('show-tech data: ' + data + '\nStatus: ' + status); },
                error: function (err) { console.error('GET /show-tech failed due to: ' + err); }
            });
        });
    });

    $(function filterSports() {
        $('.show-sports').on('click', function () {
            $.ajax({
                url: '/show-sports',
                type: 'GET',
                ContentType: 'json',
                data: { handle: userhandle },
                success: function (data, status) { console.log('show-sports data: ' + data + '\nStatus: ' + status); },
                error: function (err) { console.error('GET /show-sports failed due to: ' + err); }
            });
        });
    });

});
