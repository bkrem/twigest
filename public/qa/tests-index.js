suite('Index Page Tests', function () {
    test('page should contain link to homepage', function () {
        assert($('a[href="/home"]').length);
    });
});