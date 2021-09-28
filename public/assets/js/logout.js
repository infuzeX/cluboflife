document.querySelector('.logout')?.addEventListener('click', () => {
    fetch('/api/v1/auth/logout')
      .then((res) => {
        if (res.redirected) {
          window.location = res.url;
        }
        console.log(res);
      })
      .catch((e) => console.log(e));
  });
  