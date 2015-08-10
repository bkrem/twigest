$(document).ready(
    function followClick() {
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
                success: function (data, status) {
                    console.log('Data: ' + data + '\nStatus: ' + status);
                },
                error: function (err) {
                    console.error('GET failed due to ' + err);
                }
            });

        });
    }
);
