function tempAlert(msg, duration) {
  var el = document.createElement('div');
  el.setAttribute(
    'style',
    'position:absolute;top:15%;right:5%;background-color:#04AA6D;color:white;z-index:10000000;padding:10px;font-family:inherit;border-radius:7px;'
  );
  el.innerHTML = msg;
  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}
