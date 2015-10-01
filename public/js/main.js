/*jshint laxcomma:true*/
$(document).ready(function () {

    // Change btn styling and send AJAX GET '/trackid' on clicking "Track"
    $(function trackClick() {
        $('.card-container').on("click", function() {
            // Styling
            $(this).find('.track').css('background-color', '#34CF7A');
            $(this).find('.track').html('<div class="fa fa-check"></div> Tracking');

            // Tracking AJAX
            var userhandle = $('.userhandle').html()
            ,   trackId = $(this).find('.id').html()
            ,   trackUserName = $(this).find('.name').html()
            ,   trackDescription = $(this).find('.desc-detail').html()
            ,   trackHandle = $(this).find('.handle').html()
            ,   isVerified = $(this).find('.icon-verified').length !== 0 ? true : false;

            $.ajax({
                url: '/trackid',
                type: 'GET',
                data: {
                    userhandle: userhandle,
                    twitterId: trackId,
                    name: trackUserName,
                    handle: trackHandle,
                    description: trackDescription,
                    verified: isVerified
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
        var userhandle = $('.userhandle').html();

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
        var userhandle = $('.userhandle').html();

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
        var userhandle = $('.userhandle').html();

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
