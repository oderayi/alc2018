/**
 * alert.js
 * 
 * Alerts/notification helper
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import '../vendor/noty/jquery.noty';
import '../vendor/noty/layouts/top';
import '../vendor/noty/themes/default';

const Alert = {};

Alert.error = (msg, timeout, onCloseCallback) => {
  if(!msg.length) return;
  timeout = timeout || 4000;
  onCloseCallback = onCloseCallback || null;
  new noty({
    text: msg,
    type: 'error',
    timeout: timeout,
    onClose() {
      if(typeof onCloseCallback == 'function') onCloseCallback();
    }
  }).show();
};

Alert.success = (msg, timeout, onCloseCallback) => {
  if(!msg.length) return;
  timeout = timeout || 3000;
  onCloseCallback = onCloseCallback || null;
  new noty({
    text: msg,
    type: 'success',
    timeout: timeout,
    onClose() {
      if(typeof onCloseCallback == 'function') onCloseCallback();
    }
  }).show();
};

module.exports = Alert;