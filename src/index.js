/**
 * index.js
 * 
 * Bootstraps the app.
 *  
 * @author Steven Oderayi <oderayi@gmail.com>
 */
import App from "./app/app";

window.addEventListener("load", () => {
  let root = '';//"http://localhost:8080";
  let root_url = root;
  let backend_api_root = '';
  var app = new App({ root_url: root_url, api_root: backend_api_root });
  window.context = app;
  app.init();
});
