/*
 * Author: Alex P
 * Project Name: Portfolio Coder for Bootstrap
 * Version: 1
 * Date: 09/26/17
 * URL:  https://github.com/ItsOkayItsOfficial/ioio_coder
 */


// Exit Button
$(document).on('click', '.close', function () {
    var content = $(this).parent().attr('href');
    var del = $(this).closest('li');
    if ($(del).hasClass('active')) {
        if ($(del).next()[0]) {
            $(del).next().find('a').click();
        } else {
            $(del).prev().find('a').click();
        };
    }
    $(del).remove();
    $('div').find(content).remove();
});


// Change Coder Style
$(document).on('click', '.theme', function loadScript() {
    var skin = $(this).attr('name');
    console.log(skin);
    var script = "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?lang=css&amp;skin=" + skin;
    console.log(script);
    $('pre').removeClass('prettyprinted').find('span').contents().unwrap();
    $.ajax({
        url: script,
        dataType: 'script',
        async: false
    });
});