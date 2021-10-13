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

  error.forEach((err) => (err.style.color = 'red'));

  const getProfile = async () => {
    const user = await getMe();
    console.log(user);
    if (!user) return;
    name.value = user?.name;
    email.value = user?.email;
    createdAt.value = user?.createdAt ? user?.createdAt?.split('T')[0] : '';
    __GLOBAL_PROFILE.user = user;
  };

  getProfile();

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
      element['password'].value = '';
      element['newPassword'].value = '';
    } catch (err) {
      error[1].textContent = err.message;
    }
  });

  //Order History
  const template = document.querySelector('template');
  const courseContainer = document.querySelector('.studentDetail');
  const genDate = (date) => {
    return date ? date?.split('T')[0] : '';
  };
  const createProductNode = (product, i) => {
    const clone = template.content.cloneNode(true);
    if (!product?.course) {
      clone.querySelector('.detailHeader').style.backgroundColor = "#eee";
      clone.querySelector('.detailHeader').style.opacity = 0.5;
    }
    clone.querySelector('.index').textContent = i + 1;
    clone.querySelector('.course').textContent = product?.course?.name || "Not Available";
    clone.querySelector('.course').style.color = product?.course ? "black" : "grey";
    clone.querySelector('.boughtAt').textContent = genDate(product?.boughtAt);
    clone.querySelector('.expiresAt').textContent = !product.expiresAt ? "Never" : genDate(product?.expiresAt);
    clone.querySelector('.paid').textContent = product?.paid;
    clone.querySelector('.active').textContent = product?.active;

    courseContainer.append(clone);
  };

  const showProducts = (products) => {
    if (!products || !products?.length) return;

    products.map((product, i) => createProductNode(product, i));
  };

  const getOrder = async () => {
    try {
      const res = await fetch('/api/v1/users/orders');
      const data = await res.json();
      if (res.status === 'fail' || res.status === 'error') {
        throw new Error(res?.message);
      }
      showProducts(data?.data?.subscriptions);
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 3000, true);
    }
  };

  getOrder();

  //Notifications
  const notificationsEl = document.querySelector('.notifications');
  const showNotifications = (notifications) => {
    let lists = "";
    notifications.forEach(data => {
      lists += `<div id="n_${data._id}" class="notification">
       <div class="content">
         <p>${data.message}</p>
         <div class="detail">
           <span class="user"><i class="fas fa-user"></i>&nbsp;${data.sender}</span>
           &nbsp;&nbsp;
           <span class="time"><i class="fas fa-clock"></i>&nbsp;${new Date(data.createdAt).toLocaleTimeString()}</span>
         </div>
       </div>
     </div>`
    })
    notificationsEl.innerHTML = lists;
  }
  const getNotifications = async () => {
    try {
      const res = await fetch('/api/v1/notifications?sort=-createdAt');
      const data = await res.json();
      if (res.status === 'fail' || res.status === 'error') {
        throw new Error(res?.message);
      }
      showNotifications(data?.data?.notifications);
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 3000, true);
    }
  };

  getNotifications()
})();

const tabs = document.querySelectorAll('.tabs');
const menus = document.querySelectorAll('.menu');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const data = tab?.dataset?.section;
    menus.forEach((menu) => {
      if (menu.classList.contains(data)) {
        menu.classList.add('flex');
        menu.classList.remove('none');
      } else {
        menu.classList.add('none');
      }
    });
  });
});
