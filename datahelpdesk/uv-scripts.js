// Stop cross-frame script
if(top.frames.length > 0) top.location.href=self.location;

// Include: http://www.worldbank.org/style/hp.js (search box implementation)
function utf8(wide) {
	var c, s;
	var enc = "";
	var i = 0;
	while(i<wide.length) {
		c= wide.charCodeAt(i++);
		if (c>=0xDC00 && c<0xE000) continue;
		if (c>=0xD800 && c<0xDC00) {
			if (i>=wide.length) continue;
			s= wide.charCodeAt(i++);
			if (s<0xDC00 || c>=0xDE00) continue;
			c= ((c-0xD800)<<10)+(s-0xDC00)+0x10000;
		}
		if (c<0x80) enc += String.fromCharCode(c);
		else if (c<0x800) enc += String.fromCharCode(0xC0+(c>>6),0x80+(c&0x3F));
		else if (c<0x10000) enc += String.fromCharCode(0xE0+(c>>12),0x80+(c>>6&0x3F),0x80+(c&0x3F));
		else enc += String.fromCharCode(0xF0+(c>>18),0x80+(c>>12&0x3F),0x80+(c>>6&0x3F),0x80+(c&0x3F));
	}
	return enc;
}
var hexchars = "0123456789ABCDEF";
function toHex(n) {
	return hexchars.charAt(n>>4)+hexchars.charAt(n & 0xF);
}
var okURIchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
function encodeURIComponentNew(s) {
	var s = utf8(s);
	var c;
	var enc = "";
	for (var i= 0; i<s.length; i++) {
		if (okURIchars.indexOf(s.charAt(i))==-1)
		enc += "%"+toHex(s.charCodeAt(i));
		else
		enc += s.charAt(i);
	}
	return enc;
}
function doExternalSearch(strActionURL)	
{
	var sQueryText = document.forms[0].query.value;
	if (sQueryText == null || sQueryText.length == 0) 
	{ 
		alert('Please enter something to search for.')
		return;
	}

	if(strActionURL !='^^') 
	{
		var urlArray=strActionURL.split('^^');
		var currentIndex = document.forms[0].chooseSite.selectedIndex;
		var currentURL = urlArray[currentIndex];
		var newURL = currentURL.substring(0,currentURL.indexOf('@@'));

		newURL = newURL + encodeURIComponentNew(sQueryText);
		newURL = newURL + currentURL.substring(eval(currentURL.indexOf('@@')+2),currentURL.length);
		window.location.href=newURL;
	}
}



// Trigger jQuery. UV stores jQuery in UV.jQuery
UV.jQuery(document).ready(function() {
	var $ = UV.jQuery;
	var uvIdent = 'ZY89krPchloLAi8VLMg';

	// Dynamically change the copyright date
    var time=new Date();
    var year=time.getYear();
    if (year < 2000) year = year + 1900;

    var t = $('#wbcopyright').html();
	t = t.replace(/20\d\d\b/, year);
	$('#wbcopyright').html(t);

	// Add UserVoice script for buttons, along with other UserVoice workarounds
	if( $('#custom-buttons').length > 0 ) {
	  // Load UV script
	  $.getScript( ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/' + uvIdent + '.js');

	  // Add navigation icons, which can't be specified in UV
	  $('#custom-buttons').html(
		'<a class="browse" href="#knowledgebase">Browse Knowledge Base</a>' +
		'<a class="feedback" href="#givefeedback">Give Feedback</a>' +
		'<a class="ask" href="javascript:UserVoice.showPopupWidget()">Ask a Question</a>'
	  );

	  $('body.uv-home-page div.uvModule-featuredForum h2.uvModuleTitle').attr('id', 'givefeedback');
	  $('body.uv-home-page div.uvModule-knowledgebase h2.uvModuleTitle').attr('id', 'knowledgebase');
	}
	
	// The UV editor insists on changing the target attribute for all <a> tags, so we must workaround
	$('a.fixme').each(function() {
	  $(this).removeAttr('rel');
	  $(this).removeAttr('target');
	});

	// Install widgets
	$('#wbservices-trigger').click(function() {
	  // open/close the WB services popup in the footer
	  $(this).toggleClass('open');
	  $('#wbservices').toggleClass('open');
	});
});



// functions to generate Omniture identifiers specifically for UserVoice, based on the DOM

function wbUVGetPageNameAttribute(limit) {
  if( typeof(limit) === 'undefined' ) limit = 100;
  var $ = UV.jQuery;
  var title = wbUVGetPageTitle();
  var pg = 'Data Help Desk';

  var $bc = $('div.uvBreadcrumbs a:first');
  var bcTitle = $bc.text();
  var bcPath = $bc.attr('href');

  bcTitle = bcTitle ? bcTitle : '';
  bcPath = bcPath ? bcPath : '';
  if( bcTitle ) bcTitle = bcTitle.substr(2);

  if( $('body').hasClass('uv-forum') ) {
	pg += ' > Feedback';
	
    // In a forum. Test if we are looking at a forum or a specific submission
	if( bcPath.match(/^\/forums\//) )
	  pg += ' > ' + bcTitle;

    pg += ' > ' + title;
  }
  else if( $('body').hasClass('uv-topic') ) {
    pg += ' > Knowledge Base';
	if( bcPath.match(/^\/knowledgebase\/topics\//) )
	  pg += ' > ' + bcTitle;

    pg += ' > ' + title;
  }
  else if( bcPath ) {
	/* if there's a breadcrumb then we're on the interior of the site somewhere, so add the title
	 * Otherwise, we're on the home page
	*/
    pg += ' > ' + title;
  }

  if( limit ) pg = pg.substr(0, limit);
  return pg;
}

function wbUVGetPageTitle() {
  var $ = UV.jQuery;

  var t = $('h1.uvIdeaTitle:first').text();
  if( ! t ) t = $('h1.uvPageTitle:first').text();

  return t;
}

// test
/*
UV.jQuery(document).ready(function() {
  var $ = UV.jQuery;
  var $pgAttr = $('</p>').text(wbUVGetPageNameAttribute());

  $('div.footer-left').append($pgAttr);
});
*/
