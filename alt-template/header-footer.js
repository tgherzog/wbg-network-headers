// mobile menu dropdown implementation
$(function() {
  $('.menu').click(function () {
	var options = $(this).next('.options');
	if (options.hasClass('show')) {
	  $('body').removeClass('menu');
	  options.removeClass('show');
	  $(this).removeClass('active');
	}
	else {
	  if ($(this).parent().parent().attr('id') == 'header') $('body').addClass('menu');
	  options.addClass('show');
	  $(this).addClass('active');
	}
	return false
  });
});

// copy footer link to mobile dropdown
$(function() {
  var links = [{'title': 'Jump to another section'}];
  $('#footer .content > .links a').each(function () {
	links.push({
	  'title': $(this).html(),
	  'url': $(this).attr('href'),
	  'type': $(this).parent().prop('tagName')
	});
  });
  
  var select = $('<select></select>');

  for (i = 0; i < links.length; i++) {
	var label = links[i].title;

	if (links[i].type == 'H2') {
	  label = label.toUpperCase();
	}
	else if (links[i].type == 'LI') {
	  label = '&nbsp;&nbsp;'+ label;
	}

	var option = $('<option value="'+ links[i].url +'">'+ label +'</option>');
	
	$(select).append(option);
  }

  select.on('change', function (e) {
	if (this.value.length > 0) {
	  window.location = this.value;
	}
  });

  var element = $('<span class="select"></span>').append(select);

  $('#footer .content > .links').before(element);
});
