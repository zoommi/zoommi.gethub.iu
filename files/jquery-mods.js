var $jq = jQuery.noConflict();

/* jQuery selectbox related plugins */

jQuery.fn.containsOption = function(query) {
    var found = false;
    this.each(
        function() {
            if (this.nodeName.toLowerCase() == 'select') {
                for (var i = 0; i < this.options.length; i++) {
                    if (query.value) {
                        found = (query.value.constructor == RegExp) ?
                            this.options[i].value.match(query.value) :
                            this.options[i].value == query.value;
                    } else if (query.text) {
                        found = (query.text.constructor == RegExp) ?
                            this.options[i].text.match(query.text) :
                            this.options[i].text == query.text;
                    }

                    if (found) {
                        break;
                    }
                }
            } else {
                return this;
            }
        }
    );
    return found;
};

jQuery.fn.addOption = function(o) {
    var opt = o;
    
    this.each(
        function()
        {
            if (this.nodeName.toLowerCase() == 'select') {
                var option = document.createElement('OPTION');
                option.value = opt.value;
                option.text = opt.text;
                
                if (opt.selected) {
                    option.selected = opt.selected;
                }
                this.options[this.options.length] = option;
            }
            else return this;
        }
    );
    
    return this;
};

jQuery.fn.clearOptions = function() {
    this.each(
        function () {
            if (this.nodeName.toLowerCase() == 'select') {
                this.options.length = 0;
            }
        }
    );
};

jQuery.fn.removeOption = function(val) {
    this.each(
        function() {
            if (this.nodeName.toLowerCase() == 'select') {
                for (var i = 0; i < this.options.length; i++) {
                    if (this.options[i].value == val) {
                        this.options[i] = null;
                    }
                }
            } else {
                return this;
            }
        }
    );
    
    return this;
};

jQuery.fn.selectOptionByValue = function(val) {
    this.each(
        function() {
            if (this.nodeName.toLowerCase() == 'select') {
                for (var i = 0; i < this.options.length; i++) {
                    if (this.options[i].value == val) {
                        this.options[i].selected = true;
                    }
                    else {
                        this.options[i].selected = false;
                    }
                }
            } else {
                return this;
            }
        }
    );
    
    return this;
};

jQuery.fn.radioSelectByValue = function(val) {
    this.each(
        function() {
            if (this.nodeName.toLowerCase() == 'input' && jQuery(this).attr('type').toLowerCase() == 'radio') {
                if (jQuery(this).val() == val) {
                    this.checked = true;
                } else {
                    this.checked = false;
                }
            } else {
                return this;
            }
        }
    );
    
    return this;
};

jQuery.fn.radioSelectedValue = function() {
    var val = null;
    
    this.each(
        function() {
            if (val == null) {
                if (this.nodeName.toLowerCase() == 'input' && jQuery(this).attr('type').toLowerCase() == 'radio') {
                    if (this.checked) {
                        val = jQuery(this).val();
                    }
                }
            }
        }
    );
    
    return val;
};

jQuery.createCookie = function (name, value, days, isArray) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    
    if (arguments.length > 3 && isArray) {
        value = jQuery.serializeKeyValues(value);
    }
    
    document.cookie = name+"="+value+expires+"; path=/";
};

jQuery.createCookiewithDomain = function (name, value, domain, days, isArray) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }

    if (arguments.length > 3 && isArray) {
        value = jQuery.serializeKeyValues(value);
    }

    document.cookie = name + "=" + value + expires + "; path=/; domain=" + domain;
};


jQuery.readCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            var val = c.substring(nameEQ.length, c.length);
            if (val.indexOf('&') >= 0) {
                return jQuery.parseKeyValueString(val);
            } else {
                return val;
            }
        }
    }
    return null;
};

jQuery.eraseCookie = function(name) {
    jQuery.createCookie(name,"",-1);
};


jQuery.parseKeyValueString = function(val) {
    var hash = [];
    var pieces = val.split('&');
    
    for (var i = 0; i < pieces.length; i++) {
        var pair = pieces[i].split('=');
        hash[pair[0]] = pair[1];
    }
    
    return hash;
};

jQuery.serializeKeyValues = function(hash) {
    if (hash != null) {
        var pairs = [];
        
        for (var key in hash) {
            pairs.push(key + '=' + hash[key]);
        }
        
        return pairs.join('&');
    }
    
    return null;
};

jQuery.namespace = function(namespace) {
    var parts = namespace.split('.');
    
    var current = window;
    
    for (var i = 0; i < parts.length; i++) {
        if (!current[parts[i]]) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
    
    return current;
};

jQuery.queryString = function () {
    var _keyVals = [];
    var _loaded = false;

    var load = function () {
        loadValues(window.location.search);
    };

    var loadValues = function (queryString) {
        if (!_loaded) {
            _keyVals = splitQS(queryString);
            _loaded = true;
        }
    };

    var splitQS = function (queryString) {
        var keyVals = [];
        var raw = (queryString.length > 0) ? queryString.substring(1) : '';
        var pairs = raw.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var key = "";
            var val = "";
            var equalPos = pairs[i].indexOf("=");

            if (equalPos < 0) {
                key = pairs[i];
                val = "";
            } else {
                if (equalPos >= 1) {
                    key = pairs[i].substring(0, equalPos);
                }
                if (equalPos < pairs[i].length - 1) {
                    val = pairs[i].substring(equalPos + 1, pairs[i].length);
                }
            }
            if (key.length > 0) {
                keyVals[key] = val;
            }
        }
        return keyVals;
    };

    return {
        _reset: function () {
            _loaded = false;
            _keyVals = [];
        },
        _loadValues: function (queryString) {
            this._reset();
            loadValues(queryString);
        },
        split: function (queryString) {
            return splitQS(queryString);
        },
        get: function (key) {
            if (!_loaded) {
                load();
            }
            for (var currentKey in _keyVals) {
                if (_keyVals.hasOwnProperty(currentKey)) {
                    if (currentKey.toLowerCase() == key.toLowerCase()) {
                        return _keyVals[currentKey];
                    }
                }
            }

            return null;
        },
        all: function () {
            if (!_loaded) {
                load();
            }
            return _keyVals;
        },
        valueWithout: function (exceptions) {
            if (exceptions == undefined || exceptions == null || exceptions.length <= 0) {
                return "";
            }
            var newQS = "";
            var strExceptions = "," + exceptions.toString().toLowerCase() + ",";
            var allValues = this.all();
            for (var currentKey in allValues) {
                if (allValues.hasOwnProperty(currentKey)) {
                    if (strExceptions.indexOf("," + currentKey.toLowerCase() + ",", 0) < 0) {
                        if (newQS.length > 0) {
                            newQS += "&";
                        }
                        newQS += currentKey + "=" + allValues[currentKey];
                    }
                }
            }
            if (newQS.length > 0) {
                newQS = "?" + newQS;
            }
            return newQS;
        },
        addParameter: function (url, name, val) {
            if (url == undefined || url == null || url.length <= 0) {
                return "?" + name + "=" + val;
            } else if (url.indexOf("?") < 0) {
                return url + "?" + name + "=" + val;
            } else {
                return url + "&" + name + "=" + val;
            }
        }
    };
} ();

jQuery.fn.addBehavior = function(behaviorName, instance) {
    this.each(
        function () {
            if (!this.behaviors) {
                this.behaviors = [];
            }
            this.behaviors[behaviorName] = instance;
        }
    );
    
    return this;
};

jQuery.initBehavior = function(container, behaviorName, meta) {
    try {
        var ctl = eval('new ' + behaviorName + '()');
        ctl.init({
            "container" : container,
            "meta" : meta
        });
        
        jQuery(container).addBehavior(behaviorName, ctl);
        
        return ctl;
    }
    catch (e) { }
    
    return null;
};

jQuery.fn.parseBehavior = function() {
    this.each(function() {
        try {
            var type = $jq(this).attr('behavior');
            
            if (type != null && type != '') {
                var metaData = null;
                
                try {
                    metaData = jQuery(this).metadata({ type : 'attr', name : 'meta'});
                }
                catch (e) { }
                
                jQuery.initBehavior(this, type, metaData);
            }
        }
        catch (e) { }
    });
    
    return this;
};

jQuery.getBehavior = function(container, behaviorName) {
    if (container.behaviors) {
        return container.behaviors[behaviorName];
    }
};

jQuery.fn.behavior = function(behaviorName, eachFunc) {
    this.each(
        function () {
            var behavior = jQuery.getBehavior(this, behaviorName);
            if (behavior != null) {
                eachFunc(behavior);
            }
        }
    );
    
    return this;
};

jQuery.bookmark = function (bookmarkUrl, bookmarkTitle) {
    if (window.sidebar) { // FF
        window.sidebar.addPanel(bookmarkTitle, bookmarkUrl, "");
        return;
    }
    else if (document.all) { // IE
        try {
            window.external.AddFavorite(bookmarkUrl, bookmarkTitle);
        }
        catch(Error) {
            alert('Please press CTRL-D to bookmark this page');
        }
        return;
    }
    else if (window.opera && window.print) {
        alert('Please press CTRL-D to bookmark this page');
        return;
    }
    else {
        var chr = 'CTRL-D';
        var agt = navigator.userAgent.toLowerCase();
        if (agt.indexOf("opera") != -1) {
            chr = 'CTRL-T';
        }
        alert('Please press ' + chr + ' to bookmark this page');
        return;
    }
};

jQuery.getCachedScript = function(url){
    jQuery.ajax({
        type: "GET",
        url: url,
        dataType: "script",
        cache: true
    });
};

if (jQuery.validator) {
    var originalDateValidator1 = jQuery.validator.methods.date;
    var originalDateValidator2 = jQuery.validator.methods.dateISO;

    jQuery.validator.methods.date = function (value, element) {
        var isValidDate = originalDateValidator1.apply(this, arguments) || originalDateValidator2.apply(this, arguments);

        return isValidDate;
    };
}

// jQuery 1.9 has removed the '$.browser' property, but jquery.ba-bbq relies on it, so patch it here if it's missing.
// This has been copied from jQuery migrate 1.1.1.
if (!jQuery.browser) {
    var uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };

    var matched = uaMatch(navigator.userAgent);
    var browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if (browser.chrome) {
        browser.webkit = true;
    } else if (browser.webkit) {
        browser.safari = true;
    }

    jQuery.browser = browser;
}

(function ($jq) {
    $jq.fn.onImpression = function (options) {

        var settings = $jq.extend({
            offset: 0,
            callback: null,
            attribute: "",
            alwayscallback: false,
            scrollable: ""
        }, options)

        var $window = $jq(window),
            $scrollable = $jq(settings.scrollable),
            onImpressionElements = this,
            loaded;

        this.one("onImpression", function () {
            if (typeof settings.callback === "function") settings.callback.call(this, this.getAttribute(settings.attribute));
        });

        this.on("alwaysOnImpression", function () {
            if (typeof settings.callback === "function") settings.callback.call(this, this.getAttribute(settings.attribute));
        });

        function onImpression() {
            var inview = onImpressionElements.filter(function () {
                var $e = $jq(this);
                if ($e.is(":hidden")) return;
                var wt = $window.scrollTop(),
                    wb = wt + $window.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();
                var inScrollable = false;
                if ($scrollable.length) {
                    var scrollTop = $scrollable.scrollTop(),
                    scrollBottom = scrollTop + $scrollable.height();
                    inScrollable = (eb >= scrollTop - settings.offset && et <= scrollBottom + settings.offset);
                }
                return (eb >= wt - settings.offset && et <= wb + settings.offset) || inScrollable;
            });

            if (settings.alwayscallback) {
                loaded = inview.trigger("alwaysOnImpression");
            }
            else {
                loaded = inview.trigger("onImpression");
                onImpressionElements = onImpressionElements.not(loaded);
            }
        }

        // Only run  code if the callback is available, else there is no point
        if (typeof settings.callback === "function") {
            $window.on("scroll.onImpression resize.onImpression lookup.onImpression", onImpression);
            if ($scrollable.length) {
                $scrollable.on("scroll.onImpression resize.onImpression lookup.onImpression", onImpression);
            }
            onImpression();
        }

        return this;
    };

})(window.jQuery);
