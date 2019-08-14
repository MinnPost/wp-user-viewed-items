"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;

(function (factory) {
  var registeredInModuleLoader;

  if (typeof define === 'function' && define.amd) {
    define(factory);
    registeredInModuleLoader = true;
  }

  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
    registeredInModuleLoader = true;
  }

  if (!registeredInModuleLoader) {
    var OldCookies = window.Cookies;
    var api = window.Cookies = factory();

    api.noConflict = function () {
      window.Cookies = OldCookies;
      return api;
    };
  }
})(function () {
  function extend() {
    var i = 0;
    var result = {};

    for (; i < arguments.length; i++) {
      var attributes = arguments[i];

      for (var key in attributes) {
        result[key] = attributes[key];
      }
    }

    return result;
  }

  function decode(s) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }

  function init(converter) {
    function api() {}

    function set(key, value, attributes) {
      if (typeof document === 'undefined') {
        return;
      }

      attributes = extend({
        path: '/'
      }, api.defaults, attributes);

      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
      } // We're using "expires" because "max-age" is not supported by IE


      attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

      try {
        var result = JSON.stringify(value);

        if (/^[\{\[]/.test(result)) {
          value = result;
        }
      } catch (e) {}

      value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
      key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
      var stringifiedAttributes = '';

      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }

        stringifiedAttributes += '; ' + attributeName;

        if (attributes[attributeName] === true) {
          continue;
        } // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...


        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }

      return document.cookie = key + '=' + value + stringifiedAttributes;
    }

    function get(key, json) {
      if (typeof document === 'undefined') {
        return;
      }

      var jar = {}; // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.

      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var i = 0;

      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var cookie = parts.slice(1).join('=');

        if (!json && cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1);
        }

        try {
          var name = decode(parts[0]);
          cookie = (converter.read || converter)(cookie, name) || decode(cookie);

          if (json) {
            try {
              cookie = JSON.parse(cookie);
            } catch (e) {}
          }

          jar[name] = cookie;

          if (key === name) {
            break;
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar;
    }

    api.set = set;

    api.get = function (key) {
      return get(key, false
      /* read as raw */
      );
    };

    api.getJSON = function (key) {
      return get(key, true
      /* read as json */
      );
    };

    api.remove = function (key, attributes) {
      set(key, '', extend(attributes, {
        expires: -1
      }));
    };

    api.defaults = {};
    api.withConverter = init;
    return api;
  }

  return init(function () {});
});
"use strict";

var previously_viewed_urls = Cookies.getJSON('viewed_urls');
var viewed_urls = [];
var current_url = window.location.pathname; // make a list of previously viewed urls

if ('undefined' !== typeof previously_viewed_urls) {
  viewed_urls = previously_viewed_urls;
} // and add the current url to it if it's not the same


if (viewed_urls.indexOf(current_url) == -1) {
  viewed_urls.push(window.location.pathname);
} // get settings from the plugin


if ('undefined' !== typeof wp_user_viewed_items_settings) {
  // we require a cookie domain to make a cookie
  if ('undefined' !== typeof wp_user_viewed_items_settings.cookie_domain) {
    var cookie_args = {
      domain: wp_user_viewed_items_settings.cookie_domain
    }; // secure is optional

    if ('undefined' !== typeof wp_user_viewed_items_settings.cookie_secure) {
      cookie_args.secure = wp_user_viewed_items_settings.cookie_secure;
    } else {
      cookie_args.secure = false;
    } // if the cookie has an expiration, use it. otherwise, use 30.


    if ('undefined' !== typeof wp_user_viewed_items_settings.cookie_expires) {
      cookie_args.expires = parseInt(wp_user_viewed_items_settings.cookie_expires, 10);
    } else {
      cookie_args.expires = 30;
    }

    Cookies.set('viewed_urls', viewed_urls, cookie_args);
  } // how many items does a user need to have visited?


  if ('undefined' !== typeof wp_user_viewed_items_settings.items_read_number) {
    var items_read_number = wp_user_viewed_items_settings.items_read_number;
  } // what action gets performed if they have done those visits?


  if ('undefined' !== typeof wp_user_viewed_items_settings.action_to_perform) {
    var action_to_perform = wp_user_viewed_items_settings.action_to_perform;
  } // if it's a popup, what popup is supposed to load?


  if ('undefined' !== typeof wp_user_viewed_items_settings.popup_to_load) {
    var popup_to_load = wp_user_viewed_items_settings.popup_to_load;
  } // if all those criteria match, load the popup


  if (items_read_number < viewed_urls.length && 'popup' === action_to_perform && 'undefined' !== typeof popup_to_load) {
    jQuery(document).on('pumInit', '#popmake-' + popup_to_load, function () {
      PUM.open(popup_to_load);
    });
  }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlbmRvci9qcy5jb29raWUuanMiLCJzcmMvdmlzaXRlZC5qcyJdLCJuYW1lcyI6WyJmYWN0b3J5IiwicmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyIiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsIk9sZENvb2tpZXMiLCJ3aW5kb3ciLCJDb29raWVzIiwiYXBpIiwibm9Db25mbGljdCIsImV4dGVuZCIsImkiLCJyZXN1bHQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJhdHRyaWJ1dGVzIiwia2V5IiwiZGVjb2RlIiwicyIsInJlcGxhY2UiLCJkZWNvZGVVUklDb21wb25lbnQiLCJpbml0IiwiY29udmVydGVyIiwic2V0IiwidmFsdWUiLCJkb2N1bWVudCIsInBhdGgiLCJkZWZhdWx0cyIsImV4cGlyZXMiLCJEYXRlIiwidG9VVENTdHJpbmciLCJKU09OIiwic3RyaW5naWZ5IiwidGVzdCIsImUiLCJ3cml0ZSIsImVuY29kZVVSSUNvbXBvbmVudCIsIlN0cmluZyIsImVzY2FwZSIsInN0cmluZ2lmaWVkQXR0cmlidXRlcyIsImF0dHJpYnV0ZU5hbWUiLCJzcGxpdCIsImNvb2tpZSIsImdldCIsImpzb24iLCJqYXIiLCJjb29raWVzIiwicGFydHMiLCJzbGljZSIsImpvaW4iLCJjaGFyQXQiLCJuYW1lIiwicmVhZCIsInBhcnNlIiwiZ2V0SlNPTiIsInJlbW92ZSIsIndpdGhDb252ZXJ0ZXIiLCJwcmV2aW91c2x5X3ZpZXdlZF91cmxzIiwidmlld2VkX3VybHMiLCJjdXJyZW50X3VybCIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJpbmRleE9mIiwicHVzaCIsIndwX3VzZXJfdmlld2VkX2l0ZW1zX3NldHRpbmdzIiwiY29va2llX2RvbWFpbiIsImNvb2tpZV9hcmdzIiwiZG9tYWluIiwiY29va2llX3NlY3VyZSIsInNlY3VyZSIsImNvb2tpZV9leHBpcmVzIiwicGFyc2VJbnQiLCJpdGVtc19yZWFkX251bWJlciIsImFjdGlvbl90b19wZXJmb3Jt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QWdCLE9BQU9GLDZCQUE2QixDQUFDUSxpQkFBMUQsRUFBOEU7QUFDN0UsUUFBSUEsaUJBQWlCLEdBQUdSLDZCQUE2QixDQUFDUSxpQkFBdEQ7QUFDQSxHQTNCMEQsQ0E0QjNEOzs7QUFDQSxNQUFLLGdCQUFnQixPQUFPUiw2QkFBNkIsQ0FBQ1MsaUJBQTFELEVBQThFO0FBQzdFLFFBQUlBLGlCQUFpQixHQUFHVCw2QkFBNkIsQ0FBQ1MsaUJBQXREO0FBQ0EsR0EvQjBELENBZ0MzRDs7O0FBQ0EsTUFBSyxnQkFBZ0IsT0FBT1QsNkJBQTZCLENBQUNVLGFBQTFELEVBQTBFO0FBQ3pFLFFBQUlBLGFBQWEsR0FBR1YsNkJBQTZCLENBQUNVLGFBQWxEO0FBQ0EsR0FuQzBELENBb0MzRDs7O0FBQ0EsTUFBS0YsaUJBQWlCLEdBQUdkLFdBQVcsQ0FBQzVDLE1BQWhDLElBQTBDLFlBQVkyRCxpQkFBdEQsSUFBMkUsZ0JBQWdCLE9BQU9DLGFBQXZHLEVBQXVIO0FBQ3RIQyxJQUFBQSxNQUFNLENBQUVsRCxRQUFGLENBQU4sQ0FBbUJtRCxFQUFuQixDQUF1QixTQUF2QixFQUFrQyxjQUFjRixhQUFoRCxFQUErRCxZQUFZO0FBQ3ZFRyxNQUFBQSxHQUFHLENBQUNDLElBQUosQ0FBVUosYUFBVjtBQUNILEtBRkQ7QUFHQTtBQUNEIiwiZmlsZSI6IndwLXVzZXItdmlld2VkLWl0ZW1zLWZyb250LWVuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogSmF2YVNjcmlwdCBDb29raWUgdjIuMi4xXG4gKiBodHRwczovL2dpdGh1Yi5jb20vanMtY29va2llL2pzLWNvb2tpZVxuICpcbiAqIENvcHlyaWdodCAyMDA2LCAyMDE1IEtsYXVzIEhhcnRsICYgRmFnbmVyIEJyYWNrXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR2YXIgcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyO1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRcdHJlZ2lzdGVyZWRJbk1vZHVsZUxvYWRlciA9IHRydWU7XG5cdH1cblx0aWYgKCFyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIpIHtcblx0XHR2YXIgT2xkQ29va2llcyA9IHdpbmRvdy5Db29raWVzO1xuXHRcdHZhciBhcGkgPSB3aW5kb3cuQ29va2llcyA9IGZhY3RvcnkoKTtcblx0XHRhcGkubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHdpbmRvdy5Db29raWVzID0gT2xkQ29va2llcztcblx0XHRcdHJldHVybiBhcGk7XG5cdFx0fTtcblx0fVxufShmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIGV4dGVuZCAoKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHRmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBhcmd1bWVudHNbIGkgXTtcblx0XHRcdGZvciAodmFyIGtleSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHJlc3VsdFtrZXldID0gYXR0cmlidXRlc1trZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gZGVjb2RlIChzKSB7XG5cdFx0cmV0dXJuIHMucmVwbGFjZSgvKCVbMC05QS1aXXsyfSkrL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdH1cblxuXHRmdW5jdGlvbiBpbml0IChjb252ZXJ0ZXIpIHtcblx0XHRmdW5jdGlvbiBhcGkoKSB7fVxuXG5cdFx0ZnVuY3Rpb24gc2V0IChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRwYXRoOiAnLydcblx0XHRcdH0sIGFwaS5kZWZhdWx0cywgYXR0cmlidXRlcyk7XG5cblx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpICogMSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGUrNSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdlJ3JlIHVzaW5nIFwiZXhwaXJlc1wiIGJlY2F1c2UgXCJtYXgtYWdlXCIgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0YXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzID8gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCkgOiAnJztcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcblx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdHZhbHVlID0gcmVzdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHR2YWx1ZSA9IGNvbnZlcnRlci53cml0ZSA/XG5cdFx0XHRcdGNvbnZlcnRlci53cml0ZSh2YWx1ZSwga2V5KSA6XG5cdFx0XHRcdGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcodmFsdWUpKVxuXHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXG5cdFx0XHRrZXkgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGtleSkpXG5cdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDVFfDYwfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpXG5cdFx0XHRcdC5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHR2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG5cdFx0XHRmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXHRcdFx0XHRpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ29uc2lkZXJzIFJGQyA2MjY1IHNlY3Rpb24gNS4yOlxuXHRcdFx0XHQvLyAuLi5cblx0XHRcdFx0Ly8gMy4gIElmIHRoZSByZW1haW5pbmcgdW5wYXJzZWQtYXR0cmlidXRlcyBjb250YWlucyBhICV4M0IgKFwiO1wiKVxuXHRcdFx0XHQvLyAgICAgY2hhcmFjdGVyOlxuXHRcdFx0XHQvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuXHRcdFx0XHQvLyBub3QgaW5jbHVkaW5nLCB0aGUgZmlyc3QgJXgzQiAoXCI7XCIpIGNoYXJhY3Rlci5cblx0XHRcdFx0Ly8gLi4uXG5cdFx0XHRcdHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0ga2V5ICsgJz0nICsgdmFsdWUgKyBzdHJpbmdpZmllZEF0dHJpYnV0ZXMpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldCAoa2V5LCBqc29uKSB7XG5cdFx0XHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBqYXIgPSB7fTtcblx0XHRcdC8vIFRvIHByZXZlbnQgdGhlIGZvciBsb29wIGluIHRoZSBmaXJzdCBwbGFjZSBhc3NpZ24gYW4gZW1wdHkgYXJyYXlcblx0XHRcdC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuXHRcdFx0dmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWUgPyBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsgJykgOiBbXTtcblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHZhciBwYXJ0cyA9IGNvb2tpZXNbaV0uc3BsaXQoJz0nKTtcblx0XHRcdFx0dmFyIGNvb2tpZSA9IHBhcnRzLnNsaWNlKDEpLmpvaW4oJz0nKTtcblxuXHRcdFx0XHRpZiAoIWpzb24gJiYgY29va2llLmNoYXJBdCgwKSA9PT0gJ1wiJykge1xuXHRcdFx0XHRcdGNvb2tpZSA9IGNvb2tpZS5zbGljZSgxLCAtMSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHZhciBuYW1lID0gZGVjb2RlKHBhcnRzWzBdKTtcblx0XHRcdFx0XHRjb29raWUgPSAoY29udmVydGVyLnJlYWQgfHwgY29udmVydGVyKShjb29raWUsIG5hbWUpIHx8XG5cdFx0XHRcdFx0XHRkZWNvZGUoY29va2llKTtcblxuXHRcdFx0XHRcdGlmIChqc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGphcltuYW1lXSA9IGNvb2tpZTtcblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGtleSA/IGphcltrZXldIDogamFyO1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBzZXQ7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBnZXQoa2V5LCBmYWxzZSAvKiByZWFkIGFzIHJhdyAqLyk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBnZXQoa2V5LCB0cnVlIC8qIHJlYWQgYXMganNvbiAqLyk7XG5cdFx0fTtcblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0c2V0KGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS5kZWZhdWx0cyA9IHt9O1xuXG5cdFx0YXBpLndpdGhDb252ZXJ0ZXIgPSBpbml0O1xuXG5cdFx0cmV0dXJuIGFwaTtcblx0fVxuXG5cdHJldHVybiBpbml0KGZ1bmN0aW9uICgpIHt9KTtcbn0pKTtcbiIsInZhciBwcmV2aW91c2x5X3ZpZXdlZF91cmxzID0gQ29va2llcy5nZXRKU09OKCAndmlld2VkX3VybHMnICk7XG52YXIgdmlld2VkX3VybHMgPSBbXTtcbnZhciBjdXJyZW50X3VybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbi8vIG1ha2UgYSBsaXN0IG9mIHByZXZpb3VzbHkgdmlld2VkIHVybHNcbmlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBwcmV2aW91c2x5X3ZpZXdlZF91cmxzICkge1xuXHR2aWV3ZWRfdXJscyA9IHByZXZpb3VzbHlfdmlld2VkX3VybHM7XG59XG4vLyBhbmQgYWRkIHRoZSBjdXJyZW50IHVybCB0byBpdCBpZiBpdCdzIG5vdCB0aGUgc2FtZVxuaWYgKCB2aWV3ZWRfdXJscy5pbmRleE9mKCBjdXJyZW50X3VybCApID09IC0xICkge1xuXHR2aWV3ZWRfdXJscy5wdXNoKCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKTtcbn1cblxuLy8gZ2V0IHNldHRpbmdzIGZyb20gdGhlIHBsdWdpblxuaWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdwX3VzZXJfdmlld2VkX2l0ZW1zX3NldHRpbmdzICkge1xuXHQvLyB3ZSByZXF1aXJlIGEgY29va2llIGRvbWFpbiB0byBtYWtlIGEgY29va2llXG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3cF91c2VyX3ZpZXdlZF9pdGVtc19zZXR0aW5ncy5jb29raWVfZG9tYWluICkge1xuXHRcdHZhciBjb29raWVfYXJncyA9IHtcblx0XHRcdGRvbWFpbjogd3BfdXNlcl92aWV3ZWRfaXRlbXNfc2V0dGluZ3MuY29va2llX2RvbWFpblxuXHRcdH07XG5cdFx0Ly8gc2VjdXJlIGlzIG9wdGlvbmFsXG5cdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHdwX3VzZXJfdmlld2VkX2l0ZW1zX3NldHRpbmdzLmNvb2tpZV9zZWN1cmUgKSB7XG5cdFx0XHRjb29raWVfYXJncy5zZWN1cmUgPSB3cF91c2VyX3ZpZXdlZF9pdGVtc19zZXR0aW5ncy5jb29raWVfc2VjdXJlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb29raWVfYXJncy5zZWN1cmUgPSBmYWxzZTtcblx0XHR9XG5cdFx0Ly8gaWYgdGhlIGNvb2tpZSBoYXMgYW4gZXhwaXJhdGlvbiwgdXNlIGl0LiBvdGhlcndpc2UsIHVzZSAzMC5cblx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd3BfdXNlcl92aWV3ZWRfaXRlbXNfc2V0dGluZ3MuY29va2llX2V4cGlyZXMgKSB7XG5cdFx0XHRjb29raWVfYXJncy5leHBpcmVzID0gcGFyc2VJbnQoIHdwX3VzZXJfdmlld2VkX2l0ZW1zX3NldHRpbmdzLmNvb2tpZV9leHBpcmVzLCAxMCApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb29raWVfYXJncy5leHBpcmVzID0gMzA7XG5cdFx0fVxuXHRcdENvb2tpZXMuc2V0KFxuXHRcdFx0J3ZpZXdlZF91cmxzJyxcblx0XHRcdHZpZXdlZF91cmxzLFxuXHRcdFx0Y29va2llX2FyZ3Ncblx0XHQpO1xuXHR9XG5cdC8vIGhvdyBtYW55IGl0ZW1zIGRvZXMgYSB1c2VyIG5lZWQgdG8gaGF2ZSB2aXNpdGVkP1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd3BfdXNlcl92aWV3ZWRfaXRlbXNfc2V0dGluZ3MuaXRlbXNfcmVhZF9udW1iZXIgKSB7XG5cdFx0dmFyIGl0ZW1zX3JlYWRfbnVtYmVyID0gd3BfdXNlcl92aWV3ZWRfaXRlbXNfc2V0dGluZ3MuaXRlbXNfcmVhZF9udW1iZXI7XG5cdH1cblx0Ly8gd2hhdCBhY3Rpb24gZ2V0cyBwZXJmb3JtZWQgaWYgdGhleSBoYXZlIGRvbmUgdGhvc2UgdmlzaXRzP1xuXHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygd3BfdXNlcl92aWV3ZWRfaXRlbXNfc2V0dGluZ3MuYWN0aW9uX3RvX3BlcmZvcm0gKSB7XG5cdFx0dmFyIGFjdGlvbl90b19wZXJmb3JtID0gd3BfdXNlcl92aWV3ZWRfaXRlbXNfc2V0dGluZ3MuYWN0aW9uX3RvX3BlcmZvcm07XG5cdH1cblx0Ly8gaWYgaXQncyBhIHBvcHVwLCB3aGF0IHBvcHVwIGlzIHN1cHBvc2VkIHRvIGxvYWQ/XG5cdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB3cF91c2VyX3ZpZXdlZF9pdGVtc19zZXR0aW5ncy5wb3B1cF90b19sb2FkICkge1xuXHRcdHZhciBwb3B1cF90b19sb2FkID0gd3BfdXNlcl92aWV3ZWRfaXRlbXNfc2V0dGluZ3MucG9wdXBfdG9fbG9hZDtcblx0fVxuXHQvLyBpZiBhbGwgdGhvc2UgY3JpdGVyaWEgbWF0Y2gsIGxvYWQgdGhlIHBvcHVwXG5cdGlmICggaXRlbXNfcmVhZF9udW1iZXIgPCB2aWV3ZWRfdXJscy5sZW5ndGggJiYgJ3BvcHVwJyA9PT0gYWN0aW9uX3RvX3BlcmZvcm0gJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBwb3B1cF90b19sb2FkICkge1xuXHRcdGpRdWVyeSggZG9jdW1lbnQgKS5vbiggJ3B1bUluaXQnLCAnI3BvcG1ha2UtJyArIHBvcHVwX3RvX2xvYWQsIGZ1bmN0aW9uICgpIHtcblx0XHQgICAgUFVNLm9wZW4oIHBvcHVwX3RvX2xvYWQgKTtcblx0XHR9KTtcblx0fVxufSJdfQ==
