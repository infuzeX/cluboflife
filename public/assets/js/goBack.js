const goBack = () => {
  const mainDiv = document.createElement('div');
  mainDiv.setAttribute(
    'style',
    'position:fixed;bottom:2%;right:2%;min-height:50px;min-width:50px;background-color:#212529;z-index:100000;color:white;display:flex;align-items:center;justify-content:center;border-radius:50%;box-shadow: 0 3px 10px rgb(0 0 0 / 0.9);cursor:pointer;'
  );

  mainDiv?.addEventListener('click', () => history.back());
  const icon = document.createElement('span');
  // icon.innerHTML = '&#8617;';
  // icon.innerHTML = '&#8592;';
  icon.innerHTML = '&larr;';
  icon.setAttribute('style', 'font-size:28px;font-weight:bolder;');
  mainDiv.appendChild(icon);
  document.body.appendChild(mainDiv);
};

goBack();
