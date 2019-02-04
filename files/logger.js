jQuery.namespace('PeopleMedia');

PeopleMedia.Logger = {

    AppName: "CommunitySite Client",
    UnknownAppName: "CommunitySite Client Unknown",

    LogException: function (exception) {
        try {
            PeopleMedia.Logger.LogExceptionWithDetail(exception, null);
        }
        catch (ex) {
        }
    },

    LogExceptionWithDetail: function (exception, detail) {
        try {
            var stacktrace = "";
            var message = "";
            var exceptionTypeName = "";
            var url = "";
            var lineNumber = 0;
            if (typeof (exception) !== 'undefined' && exception != null) {
                message = exception.message ? exception.message : ((typeof (exception) === 'string') ? exception : "");
                exceptionTypeName = exception.name ? exception.name : "";
                url = exception.fileName ? exception.fileName : "";
                lineNumber = exception.lineNumber ? exception.lineNumber : 0;
                stacktrace = PeopleMedia.Logger.getStackTrace(exception);
            }
            PeopleMedia.Logger._LogException(PeopleMedia.Logger.AppName, message, exceptionTypeName, url, lineNumber, stacktrace, detail, null);
        }
        catch (ex) {
        }
    },

    LogError: function (message, url, lineNumber) {
        try {
            PeopleMedia.Logger._LogException(PeopleMedia.Logger.UnknownAppName, message, "", url, lineNumber, null, null, null);
        }
        catch (ex) {
        }
    },

    LogMessage: function (message, detail, completeFunction) {
        try {
            var url = window.location.href;
            var detailString = PeopleMedia.Logger.getDetailString(detail);
            PeopleMedia.CP.Services.invoke({
                method: 'LogMessage',
                dataType: 'json',
                data: {
                    "message": PeopleMedia.Logger.formatErrorMessage(message),
                    "url": url,
                    "additionalInfo": PeopleMedia.Logger.formatDetailString(detailString),
                    "SkipCSSVerif": "HTMLEditor"
                },
                success: function (result) {
                    try {
                        if (result && result.redirect) {
                            location.href = result.redirect;
                        }
                    }
                    catch (ex) {
                    }
                },
                async: true,
                complete: completeFunction
            });
        }
        catch (ex) {
        }
    },

    LogExceptionDetails: function (message, exceptionTypeName, url, lineNumber, stacktrace) {
        PeopleMedia.Logger._LogException(PeopleMedia.Logger.AppName, message, exceptionTypeName, url, lineNumber, stacktrace, null, null);
    },

    LogAjaxError: function (message, url, exception, exceptionTypeName, detail, completeFunction) {
        try {
            // don't try to log for these urls
            if (url.indexOf('/v3/lps/api/Log') < 0 && url.indexOf('/v3/log/logexception') < 0 && url.indexOf('/v3/ajax/RefreshSession') < 0) {
                try {
                    // update detail
                    if (typeof (detail) === 'undefined' || detail == null) {
                        detail = {};
                    }
                }
                catch (ex) {
                }
                PeopleMedia.Logger._LogException(PeopleMedia.Logger.AppName, message, exceptionTypeName, url, 0, null, detail, completeFunction);
            }
        }
        catch (ex) {
        }
    },

    LogAjaxErrorXHR: function (message, url, detail, jqXHR, textStatus, errorThrown, completeFunction) {
        try {
            // don't try to log for these urls
            if (url.indexOf('/v3/lps/api/Log') < 0 && url.indexOf('/v3/log/logexception') < 0 && url.indexOf('/v3/ajax/RefreshSession') < 0) {
                try {
                    // update detail
                    if (typeof (detail) === 'undefined' || detail == null) {
                        detail = {};
                    }
                    if (textStatus) {
                        detail.textStatus = textStatus;
                    }
                    if (errorThrown) {
                        detail.errorThrown = errorThrown;
                    }
                    if (jqXHR) {
                        if (jqXHR.readyState) {
                            detail.readystate = jqXHR.readyState;
                        }
                        if (jqXHR.status) {
                            detail.jqXHRStatus = jqXHR.status;
                        }
                        if (jqXHR.statusText) {
                            detail.jqXHRStatusText = jqXHR.statusText;
                        }
                        if (jqXHR.responseText) {
                            detail.jqXHRResponseText = jqXHR.responseText.substr(0, 1000);
                        }
                    }
                    if (!detail.href) {
                        detail.href = window.location.href;
                    }
                }
                catch (ex) {
                }
                PeopleMedia.Logger._LogException(PeopleMedia.Logger.AppName, message, "", url, 0, null, detail, completeFunction);
            }
        }
        catch (ex) {
        }
    },

    _LogException: function (appName, message, exceptionTypeName, url, lineNumber, stacktrace, detail, completeFunction) {
        try {
            var detailString = PeopleMedia.Logger.getDetailString(detail);
            if (stacktrace == null) {
                stacktrace = [];
            }
            url = url == "" ? window.location.href : url;
            lineNumber = lineNumber != undefined && lineNumber != null ? lineNumber : 0;
            for (var i = 0; i < stacktrace.length; ++i) {
                stacktrace[i] = 'at ' + stacktrace[i];
            }
            jQuery.ajax({
                type: "POST",
                url: "/v3/log/logexception",
                data: {
                    "appName": appName,
                    "message": PeopleMedia.Logger.formatErrorMessage(message),
                    "exceptionTypeName": exceptionTypeName,
                    "url": url,
                    "lineNumber": lineNumber,
                    "stacktrace": PeopleMedia.Logger.formatStackTrace(stacktrace),
                    "additionalInfo": PeopleMedia.Logger.formatDetailString(detailString)
                },
                dataType: "json",
                success: function (result) {
                    try {
                        if (result && result.redirect) {
                            location.href = result.redirect;
                        }
                    }
                    catch (ex) {
                    }
                },
                async: true,
                cache: false,
                timeout: 15000,
                complete: completeFunction
            });
        }
        catch (ex) {
        }
    },

    getStackTrace: function (exception) {
        try {
            if (typeof (exception) !== 'undefined' && exception != null && typeof (printStackTrace) !== 'undefined') {
                return printStackTrace({ e: exception, guess: true });
            }
        }
        catch (ex) {
        }
        return "";
    },

    getDetailString: function (detail) {
        var result;
        try {
            if (typeof(detail) === 'undefined' || detail === null) {
                result = "";
            } else if (typeof(JSON) !== 'undefined') {
                result = JSON.stringify(detail);
            } else {
                result = detail;
            }
        }
        catch (ex) {
            result = "";
        }
        return result;
    },
    
    formatErrorMessage: function (message) {
        try {
            if (typeof(message) !== 'undefined' && message != null) {
                return message.substr(0, 200);
            }
        }
        catch (ex) {
        }
        return "";
    },
    
    formatStackTrace: function (stacktrace) {
        try {
            if (typeof (stacktrace) !== 'undefined' && stacktrace != null) {
                return encodeURI(stacktrace.join('\n')).substr(0, 1000);
            }
        }
        catch (ex) {
        }
        return "";
    },
    
    formatDetailString: function (detailString) {
        try {
            if (typeof (detailString) !== 'undefined' && detailString != null) {
                return encodeURI(detailString);
            }
        }
        catch (ex) {
        }
        return "";
    }
};