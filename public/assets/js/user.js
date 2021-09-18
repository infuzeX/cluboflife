const username = document.querySelector('.username');
const getMe = async () => {
  try {
    const res = await fetch('/api/v1/users/me');
    const user = await res.json();
    if (user.status === 'fail' || user.status === 'error') {
      throw new Error(user?.message);
    }
    if (username) {
      username.textContent = user?.data?.user?.name;
      username.style.textTransform = 'capitalize';
    }

    return user?.data?.user;
  } catch (error) {
    tempAlert(error?.message || 'Something went wrong', 5000, true);
    return false;
  }
};

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
