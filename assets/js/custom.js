/*
 * Author: Alex P
 * URL: www.itsokayitsofficial.io
 *
 * Project Name: ItsOkayItsOfficial Landing Page
 * Version: 1.0
 * Date: 04-15-2015
 * URL: www.itsokayitsofficial.io
 */


//== Nav Animation ==//
$(window).scroll(function () {
	let scroll = $(window).scrollTop();

	if (scroll > .5) {
		$('.navbar').addClass('nav-top');
		$('.nav-logo-bg').addClass('nav-logo-sm');
		$('#loader').css('opacity', '0');
	} else {
		$('.navbar').removeClass('nav-top');
		$('.nav-logo-bg').removeClass('nav-logo-sm');
		$('#loader').css('opacity', '1');
	}
});


//== Scroll Animation ==//
$('.nav-link, .nav-logo').on('click', function (event) {
	event.preventDefault()

	$('html, body').animate(
		{scrollTop: $(this.hash).offset().top},
		{duration: 1000, easing: 'swing'}
	);
});


//== On Click Hide ==//
$('.ops').on('click', function(event) {
	event.preventDefault()

	var icoID = $(this.hash);
	$('#icons').children().not(icoID).toggle();
});


//== On Mouseover ==//
$('.icon').on({
    mouseenter: function() {
        $(this).siblings('.tooltip').animate({opacity: '1'},500)
    },
    mouseleave: function() {
		$(this).siblings('.tooltip').animate({opacity: '0'},250)
    }
});

//== Random Icon Positions & Floating ==//
$('.random').each(function (index, obj) {
	var posx = (Math.random() * ($('#icons').width() - 10)).toFixed();
	var posy = (Math.random() * ($('#skills').height() - 200)).toFixed();
	var begin = (Math.random() * (9 - 0)).toFixed();

	$(this).css({
		'position': 'relative',
		'left': posx + 'px',
		'top': posy + 'px',
	})

	$(this).children('img', 'span').css({
		'position': 'absolute',
		'animation-delay': '-.' + begin + 's',
	})
});


//== Hal Type ==//

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


//== Exit Button ==//

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


//== Change Coder Style ==//

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