(() => {
  const __GLOBAL_PROFILE = {
    user: {},
  };

  const name = document.querySelector('.name');
  const email = document.querySelector('.email');
  const createdAt = document.querySelector('.createdAt');
  const error = document.querySelectorAll('.error');
  const form = document.querySelector('.editProfile');
  const changePasswordForm = document.querySelector('.changePassword');
  console.log(changePasswordForm);
  error.forEach((err) => (err.style.color = 'red'));

  const getMe = async () => {
    try {
      const res = await fetch('/api/v1/users/me');
      const user = await res.json();
      if (user.status === 'fail' || user.status === 'error') {
        throw new Error(user?.message);
      }

      name.value = user?.data?.user?.name;
      email.value = user?.data?.user?.email;
      createdAt.value = user?.data?.user?.createdAt
        ? user?.data?.user?.createdAt?.split('T')[0]
        : '';
      __GLOBAL_PROFILE.user = user?.data?.user;
    } catch (error) {
      console.log(error);
    }
  };

  getMe();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameVal = name.value;
    const emailVal = email.value;
    const createdAtVal = createdAt.value;

    if (!nameVal || !emailVal || !createdAtVal)
      return (error[0].textContent = 'Please fill all fields');

    const data = { name: nameVal, email: emailVal, createdAt: createdAtVal };

    try {
      const res = await fetch(`/api/v1/users/${__GLOBAL_PROFILE.user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const user = await res.json();
      if (user.status === 'error' || user.status === 'fail') {
        throw new Error(user.message);
      }
      tempAlert('Profile Edited', 3000);
    } catch (err) {
      return (error[0].textContent = err.message);
    }
  });

  changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    error[1].textContent = '';
    const element = changePasswordForm.elements;
    const password = element['password'].value;
    const newPassword = element['newPassword'].value;

    if (!password || !newPassword)
      return (error[1].textContent = 'Please fill all fields');

    if (password === newPassword)
      return (error[1].textContent = 'Passwords are same');

    try {
      const res = await fetch('/api/v1/auth/changepassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, newPassword }),
      });
      const user = await res.json();
      if (user.status === 'error' || user.status === 'fail') {
        throw new Error(user.message);
      }
      tempAlert('Password changed', 3000);
    } catch (err) {
      error[1].textContent = err.message;
    }
  });
})();
const form = document.querySelector('.editProfile');
const changePasswordForm = document.querySelector('.changePassword');
function toggleTab() {
  form.classList.toggle('none');
  changePasswordForm.classList.toggle('flex');
}
