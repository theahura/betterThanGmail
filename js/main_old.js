x = 0;

function inboxPopulate(message) {

	var gObj = {};

	gObj['id'] = message.id;
	gObj['Subject'] = getHeader(message.payload.headers, 'Subject');
	gObj['Date'] = getHeader(message.payload.headers, 'Date');
	gObj['From'] = getHeader(message.payload.headers, 'From');
	gObj['Body'] = getBody(message.payload);

	$("#inbox-table").append($('<tr>')
		.append($('<td>')
		.addClass('inbox-message')
		.attr('id', gObj['id'])
		.text(gObj['Subject'])));

	inboxMessages[gObj['id']] = gObj;

	var $ballObj = $('#' + gObj['id'] +'-ball');
	var $tdObj = $('#' + gObj['id']);

	if (gObj['From'].toLowerCase().search('avgousti') != -1) {
		$('<div id=' + gObj['id'] +'-ball class="ball"></div> ').appendTo('#cat-1');
		$tdObj.addClass('cat-1-td');
	}
	else if (gObj['From'].toLowerCase().search('pollack') != -1) {
		$('<div id=' + gObj['id'] +'-ball class="ball"></div> ').appendTo('#cat-2');
		$tdObj.addClass('cat-2-td');
	}
	else if (gObj['From'].toLowerCase().search('morton') != -1) {
		$('<div id=' + gObj['id'] +'-ball class="ball"></div> ').appendTo('#cat-3');
		$tdObj.addClass('cat-3-td');
	}
	else if (gObj['From'].toLowerCase().search('columbia') != -1) {
		$('<div id=' + gObj['id'] +'-ball class="ball"></div> ').appendTo('#cat-4');
		$tdObj.addClass('cat-4-td');
	}
	else {
		$('<div id=' + gObj['id'] +'-ball class="ball"></div> ').appendTo('#cat-5');
		$tdObj.addClass('cat-5-td');
	}
	console.log(x++);
	$ballObj.hover( function() {
		$ballObj.toggleClass('tdHover');
		$tdObj.toggleClass('ballHover');
	});

	$tdObj.hover( function() {
		$tdObj.toggleClass('ballHover');
		$ballObj.toggleClass('tdHover');
	});

}

$( document ).on('click', '.inbox-message', function() {
	$('.selected-email').removeClass('selected-email');
	$(this).addClass('selected-email');
	$('.slider-iframe').contents().find('html').html(inboxMessages[this.id]['Body']);
	$('.slider').show();
	$('.left-bar, .GUI-space').css('opacity', '0.5');
	$('.left-bar, .GUI-space').click( function() {
		$('.selected-email').removeClass('selected-email');
		$('.slider').hide();
		$('.left-bar, .GUI-space').css('opacity', '1');
	});
});



function messageCategorizer() {
	for (var msg in inboxMessages) {
		if (inboxMessages[msg]['From'].toLowerCase().search('SEAS') != -1) {
			$('<div id=' + inboxMessages[msg]['id'] +'-ball class="ball"></div> ').appendTo('#cat-1');
		}
		else if (inboxMessages[msg]['From'].toLowerCase().search('seamless') != -1) {
			$('<div id=' + inboxMessages[msg]['id'] +'-ball class="ball"></div> ').appendTo('#cat-2');
		}
		else if (inboxMessages[msg]['Subject'].toLowerCase().search('free') != -1) {
			$('<div id=' + inboxMessages[msg]['id'] +'-ball class="ball"></div> ').appendTo('#cat-3');
		}
		else if (inboxMessages[msg]['From'].toLowerCase().search('columbia') != -1) {
			$('<div id=' + inboxMessages[msg]['id'] +'-ball class="ball"></div> ').appendTo('#cat-4');
		}
		else {
			$('<div id=' + inboxMessages[msg]['id'] +'-ball class="ball"></div> ').appendTo('#cat-5');
		}
	}
	$('.ball').each( function() {
		var ballElement = $(this);
		var tdElement = $('#' + this.id.slice(0,-5));

		ballElement.hover( function() {
			tdElement.toggleClass('ballHover');
		});

		tdElement.hover( function() {
			ballElement.toggleClass('tdHover');
		});
	})
}