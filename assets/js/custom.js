/*
 * Author: Alex P
 * URL: www.itsokayitsofficial.io
 *
 * Project Name: ItsOkayItsOfficial Landing Page
 * Version: 1.0
 * Date: 04-15-2015
 * URL: www.itsokayitsofficial.io
 */


// Nav Animation
$(window).scroll(function () {
	if ($(window).scrollTop() > 200) {
		$('.site-nav').addClass('show');
		$('.logo').addClass('nav-logo');
	} else {
		$('.site-nav').removeClass('show');
		$('.logo').removeClass('nav-logo');
	};
});

// Scroll Animation
$('.scroll').on('click', function (event) {
	event.preventDefault()

	$('html, body').animate({
		scrollTop: $(this.hash).offset().top
	}, 1500);
});



// Hal Type

// Variable - Hal words
var words = ['Hello.', 'This a code hotwash for node.js.', 'Scroll down to see in full.'];
var type = '<a><p class="hal-type">';
var hal = '<h3>Hal:&nbsp</h3>';

// Function - Hal talk
var halTalk = function (i) {
	$(this).delay(100 * i).css({
		display: 'inline',
		opacity: 0
	}).animate({
		opacity: 1
	}, 100);
};

// Function - Run hal
var halRun = function (i) {
	var spans = hal + '<span>' + this.split('').join('</span><span>') + '</span>';
	$('.hal').append(type);
	$(spans).delay(5000 * i).hide().appendTo('.hal-type').each(halTalk);
}

$(words).each(halRun);


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
		async: false});
	});