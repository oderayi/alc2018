
/**
 * app.js
 * 
 * The brain of the app.
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import '../../vendor/validation/jquery.validate.min';
import '../../vendor/validation/additional-methods.min';
import '../../vendor/bootstrap/js/bootstrap.min';
import '../../vendor/bootstrap/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'simple-line-icons/css/simple-line-icons.css';
import 'material-design-icons/iconfont/material-icons.css';
import '../../vendor/bmd/css/material-icons.min.css';
import '../../vendor/bmd/js/material.min';
import '../../vendor/bmd/js/ripples.min';
import '../../vendor/bmd/css/bootstrap-material-design.min.css';
import '../../vendor/bmd/css/ripples.min.css';
import '../stylesheets/common.css';
import '../stylesheets/full-screen.css';
import '../stylesheets/utils.css';
import '../stylesheets/app/fonts.css';
import '../stylesheets/app/style.css';

import Utils from '../utils';
import Alert from '../alert';

var components = {};
components.Component = require('../component');
components.SidebarComponent = require('./components/sidebar.component');
components.NavbarComponent = require('./components/navbar.component');
components.HomeComponent = require('./components/home.component');
components.AboutComponent = require('./components/about.component');
components.HistoryComponent = require('./components/history.component');

function App(params) {
  let p = params || {};
  this.api_root = p.api_root || "/no-api";
  this.root_url = p.root_url || "/";
  this.sidebar = p.sidebar || {};
  this.navbar = p.navbar || {};
}

App.prototype.api_root = "/no-api";
App.prototype.root_url = "/";
App.prototype.sidebar = null;
App.prototype.navbar = null;

App.prototype.prototype = Object.create(Object.prototype);
App.prototype.prototype.constructor = App;

App.prototype.currentScreen = null;

App.prototype.getRootURL = function () {
  return "/";
};

App.prototype.getAPIRoot = function () {
  return this.api_root;
};

App.prototype.setClientToken = function (token) {
  sessionStorage.setItem("client_token", token);
};

App.prototype.getClientToken = function () {
  return sessionStorage.getItem("client_token");
};

App.prototype.setProfile = function (profile) {
  if (typeof profile == "object") {
    sessionStorage.setItem("user_profile", btoa(JSON.stringify(profile)));
    return;
  }
  console.log("App::setProfile: Invalid object");
};

App.prototype.getProfile = function () {
  let profile = sessionStorage.getItem("user_profile");
  if (profile) {
    return JSON.parse(atob(sessionStorage.getItem("user_profile")));
  }
  return null;
};

App.prototype.clearSession = function () {
  return sessionStorage.clear();
};

App.prototype.hideComponent = function (selector) {
  $(selector).fadeOut("fast");
};

App.prototype.showComponent = function (selector) {
  $(selector).fadeIn();
};

App.prototype.getComponent = function (target) {
  if (!target.length) return null;
  let componentName = `${Utils.capitalize(target)}Component`;

  if (typeof components[componentName] != 'undefined') {
    return new components[componentName]();
  }
  console.log(`Component ${componentName} unrecognized.`);
  return null;
};

App.prototype.userIsAuthenticated = function () {
  const token = this.getClientToken();
  if (token && token.length > 0) {
    return true;
  }
  return false;
};

App.prototype.hideSecureLinks = function () {
  $(".require-login").hide();
};

App.prototype.showSecureLinks = function () {
  $(".require-login")
    .removeClass("hide")
    .show();
};

App.prototype.hideInsecureLinks = function () {
  $(".require-logut").hide();
};

App.prototype.showInsecureLinks = function () {
  $(".require-logout")
    .removeClass("hide")
    .show();
};

App.prototype.initGuest = function () {
  const homeComponent = new components.HomeComponent();
  homeComponent.init();
  homeComponent.render($("#container"));

  const sidebarComponent = new components.SidebarComponent();
  sidebarComponent.init({ root_url: this.root_url });
  this.sidebar = sidebarComponent;
  this.sidebar.render($("#sidebar_container"));

  const navbarComponent = new components.NavbarComponent();
  navbarComponent.init();
  this.navbar = navbarComponent;
  this.navbar.render($("#navbar_container"));
};

App.prototype.logout = function () {
  this.clearSession();
  window.location.href = "/";
};

App.prototype.initOnce = function () {
  var self = this;

  $("body")
    .addClass("animated fadeIn")
    .removeClass("hide");

  $.extend($.validator.defaults, {
    invalidHandler: (c, a) => {
      const d = a.numberOfInvalids();
      if (d) {
        const b =
          d == 1
            ? "You missed 1 field. It has been highlighted."
            : `You missed ${d} fields. They have been highlighted.`;
        Alert.error(b);
      }
    }
  });

  /**
   * HashBang navigation
   */
  window.onhashchange = function () {
    self.navigateHash(window.location.hash);
  };

  if (window.location.hash) {
    this.navigateHash(window.location.hash);
  }
};

App.prototype.navigateHash = function (hash, container) {
  const cont = container || null;
  const componentID = hash.substr(2);
  if (!componentID.length) return;
  const component = this.getComponent(componentID);
  if (component) {
    this.currentScreen = component;
    component.init().render(cont);
    window.scrollTo(0, 0);
  }
};

App.prototype.load = function () {
  this.initGuest();
  $("form").each((idx, f) => {
    $(f).validate();
  });
};

App.prototype.init = function () {
  this.load();
  this.initOnce();
};

module.exports = App;
