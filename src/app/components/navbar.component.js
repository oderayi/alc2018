/**
 * navbar.component.js
 * 
 * Navigation bar component
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import Component from '../../component';
import Utils from '../../utils';

function NavbarComponent() {
  Component.call();
}

NavbarComponent.prototype = Object.create(Component.prototype);

NavbarComponent.prototype.constructor = NavbarComponent;

NavbarComponent.prototype.root_url;

NavbarComponent.prototype.navbar = null;

NavbarComponent.prototype.init = function(props) {
  props = props || {};
  props.root = props.root || ".component#navbar";
  props.service = props.service || {};
  this.root_url = props.root_url || "/";
  Component.prototype.init.call(this, props);
  this.navbar = this.component.find('.navbar');
  return this;
};

NavbarComponent.prototype.getTemplate = function() {
  return `
  <header>
    <nav class="navbar container">
        <div class="nav navbar-nav animated">
          <input class="toggle-menu" id="toggle-menu" type="checkbox" name="">
          <label class="sidebar-toggle" for="toggle-menu"><span class="menu-bar"></span>
          <span class="menu-bar"></span><span class="menu-bar"></span></label>
        </div>
    </nav>
  </header>
  `;
};

NavbarComponent.prototype.fixTopBar = function(scrollTopValue) {
  if (scrollTopValue == 0) {
    this.navbar.removeClass("fixed-top navbar-inverse");
    return;
  }
  if (!Utils.isElementInViewport(this.navbar)) {
    this.navbar.addClass("fixed-top navbar-inverse");
    this.navbar
      .fadeIn()
      .promise()
      .always(() => {});
  }
}

NavbarComponent.prototype.unfixTopBar = function(scrollTopValue) {
  if (Utils.isElementInViewport(this.navbar)) {
    if (scrollTopValue == 0) {
      this.navbar.removeClass("fixed-top");
      return;
    }
    this.navbar
      .fadeOut()
      .promise()
      .always(() => {
        this.navbar.removeClass("fixed-top");
      });
  }
}


NavbarComponent.prototype.onBind = function() {
  const self = this;
  this.component.find(".sidebar-toggle").click(e => {
    window.context.sidebar.toggle($(e.currentTarget));
  });
  this.component.find("a.navbar-brand").attr("href", this.root_url);
  return self;
};

NavbarComponent.prototype.onUnbind = function() {
  this.component.find(".sidebar-toggle").unbind("click");
  return this;
};

NavbarComponent.prototype.toggle = function(el) {
  if (!this.component.hasClass("open")) {
    this.open(el);
  } else {
    this.close(el);
  }
  return this;
};

NavbarComponent.prototype.open = function(el) {
  this.component.animate({ top: 0 });
  this.component.addClass("open");
  if (el) {
    $(el).addClass("navbar-visible");
  }
  return this;
};

NavbarComponent.prototype.close = function(el) {
  height = this.component.outerHeight() + 10;
  this.component.animate({ top: -height });
  this.component.removeClass("open");
  if (el) {
    $(el).removeClass("navbar-visible");
    return this;
  }
};

NavbarComponent.prototype.setIsAuth = function() {
  this.component
    .find(".require-login")
    .removeClass("hide")
    .show();
  this.component.find(".require-logout").remove();
  return this;
};

NavbarComponent.prototype.setIsLoggedOut = function() {
  this.component.find(".require-login").remove();
  this.component
    .find(".require-logout")
    .removeClass("hide")
    .show();
  return this;
};

NavbarComponent.prototype.setInverse = function(trueFalse) {
  let nb = this.component.find(".navbar");
  if (trueFalse) {
    nb.addClass("navbar-inverse");
  } else {
    nb.removeClass("navbar-inverse");
  }
  return this;
};


NavbarComponent.prototype.setFixedTop = function(trueFalse) {
  let nb = this.component.find(".navbar");
  if (trueFalse) {
    nb.addClass("fixed-top");
  } else {
    nb.removeClass("fixed-top");
  }
  return this;
};

NavbarComponent.prototype.render = function(container) {
  if (!container) {
    return this.component;
  } else {
    Component.prototype.render.call(this, container);
  }
};

module.exports = NavbarComponent;
