
/**
 * sidebar.component.js
 * 
 * Sidebar component
 * 
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import Component from '../../component';

function SidebarComponent() {
  Component.call();
}

SidebarComponent.prototype = Object.create(Component.prototype);

SidebarComponent.prototype.constructor = SidebarComponent;
SidebarComponent.prototype.root;
SidebarComponent.prototype.root_url;

SidebarComponent.prototype.init = function(props) {
  props = props || {};
  props.root = props.root || ".component#sidebar";
  this.root_url = props.root_url || "/";
  Component.prototype.init.call(this, props);
  return this;
};


SidebarComponent.prototype.getTemplate = function() {
  return `

<section class="sidebar component" id="sidebar">
  <div class="sidebar-content">
    <nav>
      <ul class="menu list list-unstyled">
        <li><span class="icon icon-calculator"></span><a class="full-screen-toggle" href="/" data-target="#converter">Converter</a></li>
        <li><span class="icon icon-clock"></span><a class="full-screen-toggle" href="/#/history" data-target="#history">History</a></li>
        <li><span class="icon icon-globe"></span><a class="full-screen-toggle" href="/#/about" data-target="#about">About</a></li>
      </ul>
    </nav>
  </div>
</section>
<style>
  .sidebar {
      position: fixed;
      top: 0;
      right: -315px;
      width: 300px;
      height: 100vh;
      overflow-y: auto;
      padding: 2em;
      z-index: 11;
      background-color: rgba(255, 255, 255, 0.95);
      box-shadow: -5px 0px 10px rgba(0, 0, 0, 0.2);
      
  }
  
  .sidebar-content {
      text-align: left;
      line-height: 2em;
  }
  
  .sidebar nav {
      background-color: transparent;
      margin-left: 1.5rem;
  }
  
  .sidebar nav .menu {
      padding-top: 4em;
  }
  
  .sidebar nav ul li a {
      line-height: 3em;
      color: #111;
  }
  
  .sidebar nav .icon {
    position:relative;
    top: 2px;
    padding-right: 1.5em;
      
  }
</style>
  `;
};


SidebarComponent.prototype.onBind = function () {
  const self = this;
  this.component.click(() => {
    // close sidebar when a link is clicked on me
    $('.navbar .sidebar-toggle').first().trigger('click');
  });
   /* Sidebar toggle */
   let toggles = $('.sidebar-toggle');
  toggles.click((e) => {
    self.toggle($(e.currentTarget));
  });
  return self;
};

SidebarComponent.prototype.toggle = function (el) {
  if (!this.component.hasClass('open')) {
    this.open(el);
  } else {
    this.close(el);
  }
};

SidebarComponent.prototype.open = function (el) {
  this.component.animate({ right: 0 });
  this.component.addClass('open');
  if (el) {
    $(el).addClass('sidebar-visible');
  }
};

SidebarComponent.prototype.close = function (el) {
  let width = this.component.outerWidth() + 10;
  this.component.animate({ right: -width });
  this.component.removeClass('open');
  if (el) {
    $(el).removeClass('sidebar-visible');
  }
};

SidebarComponent.prototype.setIsAuth = function () {
  this.component.find('.require-login').removeClass('hide').show();
  this.component.find('.require-logout').remove();
};

SidebarComponent.prototype.setIsLoggedOut = function () {
  this.component.find('.require-login').remove();
  this.component.find('.require-logout').removeClass('hide').show();
};

module.exports = SidebarComponent;