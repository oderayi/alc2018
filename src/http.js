
/**
 * Simple wrapper for jQuery ajax
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */

import Alert from './alert';

const Http = {};

Http.post = function (url, data, headers, other_options) {
  const options = other_options || {};

  let hdrs = headers || {};
  options.data = options.data || data;
  options.type = "post";

  const complete = function (xhr) {
    if (xhr.status == 401) {
      Http.handleUnauthorized();
    }
  };

  options.headers = options.headers || {};
  options.headers = Object.assign(options.headers, hdrs);

  options.complete = [options.complete] || [];
  options.complete = options.complete.concat(complete);

  return $.ajax(url, options);
};

Http.get = function (url, data, headers, other_options) {
  const options = other_options || {};

  let hdrs = headers || {};
  options.data = options.data || data;
  options.type = "get";

  const complete = function (xhr) {
    if (xhr.status == 401) {
      Http.handleUnauthorized();
    }
  };

  options.headers = options.headers || {};
  options.headers = Object.assign(options.headers, hdrs);
  options.complete = [options.complete] || [];
  options.complete = options.complete.concat(complete);

  return $.ajax(url, options);
};


Http.put = function (url, data, headers, other_options) {

  const options = other_options || {};

  hdrs = headers || {};
  options.data = options.data || data;
  options.type = "put";

  const complete = function (xhr) {
    if (xhr.status == 401) {
      Http.handleUnauthorized();
    }
  };

  options.headers = options.headers || {};
  options.headers = Object.assign(options.headers, hdrs);

  options.complete = [options.complete] || [];
  options.complete = options.complete.concat(complete);

  return $.ajax(url, options);
};


Http.delete = function (url, data, headers, other_options) {
  const options = other_options || {};

  let hdrs = headers || {};
  options.data = options.data || data;
  options.type = "delete";

  const complete = function (xhr) {
    if (xhr.status == 401) {
      Http.handleUnauthorized();
    }
  };

  options.headers = options.headers || {};
  options.headers = Object.assign(options.headers, hdrs);

  options.complete = [options.complete] || [];
  options.complete = options.complete.concat(complete);

  return $.ajax(url, options);
};


Http.handleError = function (xhr) {
  if (xhr == null) return;
  let message = (xhr.responseJSON || {}).message;
  if (typeof message !== "undefined" && message.length > 0) {
    Alert.error(xhr.responseJSON.message);
  } else if (xhr.responseText == "Unauthorized") Http.handleUnauthorized();
  else if (xhr.responseText) Alert.error(xhr.responseText);
  else {
    console.log(xhr);
    Alert.error(xhr);
  }
};

Http.handleUnauthorized = function (params) {
  let p = params || {};
  const context = p.context || window.context || {};
  Alert.error("Unathorised! Please log in again.");
  context.navigateHash("#/login");
};

module.exports = Http;