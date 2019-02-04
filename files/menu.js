var PeopleMediaMenu = (function ($) {
    "use strict";
	var pub = [];
	var homeTab, inboxTab, searchTab, matchTab, tokenTab, inboxSubTab, searchSubTab, matchSubTab, tokenSubTab, delayTimer;
	var subMenus, allTabs;
	var currentTab;

	var reset = function () {
		if (delayTimer != null) {
			clearTimeout(delayTimer);
		}
		delayTimer = null;
		$.each(subMenus, function (ix) {
			subMenus[ix].hide();
		});
		$.each(allTabs, function (ix) {
			allTabs[ix].find('> a').removeClass('active');
		});
		currentTab.addClass('active');

	};
    var fadeOutMenu = function(parentMenu) {
        var name = parentMenu.prop('id');
        name = name.replace('menu', '');
        var subTab = parentMenu.find('div.sub' + name);
        if (subTab.is(':visible')) {
            if (delayTimer != null) {
                clearTimeout(delayTimer);
            }
            delayTimer = setTimeout(function() {
                subTab.fadeOut('fast');
                parentMenu.find('> a').removeClass('active');
                currentTab.addClass('active');
            }, 1000);
        } else {
            parentMenu.find('> a').removeClass('active');
            currentTab.addClass('active');
        }
    };
	var showMenu = function (parentMenu) {
		var name = parentMenu.prop('id');
		name = name.replace('menu', '');
		var subTab = parentMenu.find('div.sub' + name);
		if (subTab.is(':visible')) {
			if (delayTimer != null) {
				clearTimeout(delayTimer);
			}
			delayTimer = null;
			return;
		}
		reset();
		subTab.fadeIn('fast');
		parentMenu.find(' > a').addClass('active');
	};
	pub.init = function () {
		homeTab = $('#menu-home');
		inboxTab = $('#menu-inbox');
		searchTab = $('#menu-search');
		matchTab = $('#menu-match');
	    tokenTab = $('#menu-tokens');

		inboxSubTab = inboxTab.find('div.sub-inbox');
		searchSubTab = searchTab.find('div.sub-search');
		matchSubTab = matchTab.find('div.sub-match');
	    tokenSubTab = tokenTab.find('div.sub-tokens');

		currentTab = $('.active').first();

		allTabs = [homeTab, inboxTab, searchTab, matchTab, tokenTab];
		subMenus = [inboxSubTab, searchSubTab, matchSubTab, tokenSubTab];
		$.each(subMenus, function (ix) {
			subMenus[ix].find(' > div[data-link]').click(function (event) {
				event.preventDefault();
				var go = $(this).attr('data-link');
				if (go != null && go.length > 0) {
					location.href = go;
				}
			});
		});
		$.each(allTabs, function (ix) {
			allTabs[ix].on('mouseenter', function () { showMenu(allTabs[ix]); });
			allTabs[ix].on('mouseleave', function () { fadeOutMenu(allTabs[ix]); });
			allTabs[ix].find(' > div > div').click(function (event) {
				event.preventDefault();
				event.stopPropagation();
			});
		});
	};
	return pub;
})(jQuery);
jQuery(PeopleMediaMenu.init);

