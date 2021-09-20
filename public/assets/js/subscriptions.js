(() => {
  const __GLOBAL_PURCHASE = {
    courses: [],
    users: [],
    purchases: [],
    edit: '',
  };

  const addSubscriptionForm = document.querySelector('.addStudent');
  const userDropdown = document.querySelectorAll('.userDropdown');
  const coursDropdown = document.querySelectorAll('.courseDropdown');
  const userInput = document.querySelector('#nameList');
  const courseInput = document.querySelector('#courseList');
  const boughtInput = document.querySelector('.boughtAtAdd');
  const expiresInput = document.querySelector('.expireAtAdd');
  const user = document.querySelector('#userList');
  const course = document.querySelector('#course');
  const paidInput = document.querySelector('.paid');
  const activeInput = document.querySelector('#active');
  const activeContainer = document.querySelector('.activeContainer');
  const template = document.querySelector('template');
  const studentDetail = document.querySelector('.studentDetail');
  const addSubscriptionModal = document.querySelector('.addModal');
  const search = document.querySelector('.search');
  const exportCSV = document.querySelector('.export');
  const downloadCSV = document.querySelector('.download');

  const pushToDropdown = (arr, dropdown) => {
    if (!arr || !arr.length) return;
    arr.forEach((item) => {
      const option = document.createElement('option');
      option.setAttribute('data-id', item._id);
      option.textContent = item?.email || item.name;
      option.value = item.email || item.name;
      option.label = item.email || item.name;
      option.setAttribute('id', item?.email || item.name);
      dropdown.forEach((menu) => menu.append(option));
    });
    console.log(dropdown, arr);
  };

  const emptyUpNode = () => (studentDetail.innerHTML = '');

  const genDate = (date) => {
    return date ? date?.split('T')[0] : '';
  };

  const copySubscription = (data) => {
    return `
Name:${data.user.name},
Email:${data.user.email},
Course:${data.cousrse?.name || 'Not Available'},
Course Code: ${data.cousrse?.courseCode || 'Not Available'},
Subscription:${data.expiresAt}
      `
  }

  const createSubscriptionNode = (subscription, i) => {
    console.log(subscription)
    const clone = template.content.cloneNode(true);
    clone.querySelector('.index').textContent = i + 1;
    clone.querySelector('.email').textContent =
      subscription?.user?.email || 'No user found';
    //modifiy course column based on value [start]
    clone.querySelector('.course').textContent =
      subscription?.course?.name || 'No course found';
    clone.querySelector('.course').style.color =
      subscription?.course ? 'black' : 'grey';
    //modifiy course column based on value [end]
    clone.querySelector('.boughtAt').textContent =
      subscription?.boughtAt && genDate(subscription?.boughtAt);
    clone.querySelector('.expiresAt').textContent =
      subscription?.expiresAt && genDate(subscription?.expiresAt);
    clone.querySelector('.paid').textContent = subscription?.paid;
    clone.querySelector('.active').textContent = subscription?.active;

    clone.querySelector('.copy').addEventListener('click', () => {
      window.navigator.clipboard.writeText(copySubscription(subscription));
      tempAlert('Copied', 2000);
    });

    clone
      .querySelector('.edit')
      .addEventListener('click', () => onEdit(subscription));
    //DELETE EVENT LISTENER
      /*clone
      .querySelector('.delete')
      .addEventListener(
        'click',
        async () => await deleteSubscription(subscription._id)
      );*/

    studentDetail.append(clone);
  };

  const showSubscription = (subbscription = __GLOBAL_PURCHASE.purchases) => {
    if (!subbscription || !subbscription?.length) return;
    subbscription.forEach((sub, i) => createSubscriptionNode(sub, i));
  };

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/v1/subscription');
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      const data = subs?.data?.subscriptions;
      __GLOBAL_PURCHASE.purchases = data;
      showSubscription(data);
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  };

  fetchSubscription();
  const getUsers = async () => {
    try {
      const res = await fetch('/api/v1/users/?role=student');
      const user = await res.json();
      if (user.status === 'error' || user.status === 'fail') {
        throw new Error(user.message);
      }
      console.log(user?.data?.students);
      pushToDropdown(user?.data?.students, userDropdown);
      __GLOBAL_PURCHASE.users = [...user?.data?.students];
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  };

  const getCourses = async () => {
    try {
      const res = await fetch('/api/v1/courses');
      const course = await res.json();
      if (course.status === 'error' || course.status === 'fail') {
        throw new Error(course.message);
      }
      pushToDropdown(course?.data?.courses, coursDropdown);
      __GLOBAL_PURCHASE.courses = [...course?.data?.courses];
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  };

  getUsers();
  getCourses();

  
  async function deleteSubscription(id) {
    search.value = 0;
    try {
      const res = await fetch(`/api/v1/subscription/${id}`, {
        method: 'DELETE',
      });
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      const subscription = __GLOBAL_PURCHASE.purchases.filter(
        (sub) => sub._id !== id
      );
      __GLOBAL_PURCHASE.purchases = subscription;
      emptyUpNode();
      showSubscription();
      tempAlert('Deleted', 2000);
    } catch (error) {
      tempAlert(error?.message, 4000, true);
    }
  }

  const editPurchase = async (data) => {
    const id = __GLOBAL_PURCHASE.edit;
    if (!id) return;
    try {
      const res = await fetch(`/api/v1/subscription/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      tempAlert('Edited', 3000);
      emptyUpNode();
      clear();
      fetchSubscription();
    } catch (error) {
      tempAlert(error?.message, 4000, true);
    }
  };

  function onEdit(sub) {
    __GLOBAL_PURCHASE.edit = sub._id;
    userInput.value = sub.user?.email || '';
    courseInput.value = sub.course?.name || '';
    boughtInput.value = sub.boughtAt && genDate(sub.boughtAt);
    expiresInput.value = sub.expiresAt && genDate(sub.expiresAt);
    paidInput.value = sub.paid;
    activeContainer.style.display = 'block';
    activeInput.checked = sub.active;
    toggleModal(addSubscriptionModal);
  }

  function clear() {
    __GLOBAL_PURCHASE.edit = '';
    userInput.value = '';
    courseInput.value = '';
    boughtInput.value = '';
    expiresInput.value = '';
    paidInput.value = '';
    activeContainer.style.display = 'none';
    //  activeInput.checked = sub.active;
    toggleModal(addSubscriptionModal);
  }

  addSubscriptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    search.value = 0;
    const elements = addSubscriptionForm.elements;
    const userId = user?.options
      ?.namedItem(userInput?.value)
      ?.getAttribute('data-id');
    const courseId = course?.options
      ?.namedItem(courseInput?.value)
      ?.getAttribute('data-id');
    const boughtAt = elements['boughtAt'].value;
    const expiresAt = elements['expiresAt'].value;
    const paid = elements['paid'].value;
    const active = elements['active'].checked;
    console.log(active);
    if (!userId || !courseId || !boughtAt || !expiresAt || !paid) {
      return tempAlert('Please fill all fields', 4000, true);
    }

    if (__GLOBAL_PURCHASE.edit)
      return editPurchase({
        userId,
        courseId,
        boughtAt,
        expiresAt,
        paid: parseInt(paid),
        active,
      });

    try {
      const res = await fetch('/api/v1/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId,
          boughtAt,
          expiresAt,
          paid: parseInt(paid),
        }),
      });
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      const data = {
        _id: subs?.data?.subscription?._id,
        course: {
          _id: subs?.data?.subscription?.course,
          name: courseInput?.value,
        },
        user: { _id: subs?.data?.subscription?.user, email: userInput?.value },
        boughtAt,
        expiresAt,
        active: true,
        paid: parseInt(subs?.data?.subscription?.paid),
      };

      __GLOBAL_PURCHASE.purchases = [data, ...__GLOBAL_PURCHASE.purchases];
      emptyUpNode();
      showSubscription();
      toggleModal(addSubscriptionModal);
      tempAlert('Added Subscription', 2000);
      userInput.value = '';
      courseInput.value = '';
      boughtInput.value = '';
      expiresInput.value = '';
      paidInput.value = '';
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  });

  const fetchUserByActive = async (active) => {
    console.log(active);
    try {
      const res = await fetch(`/api/v1/subscription/?active=${active}`);
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      const data = subs?.data?.subscriptions;
      emptyUpNode();
      showSubscription(data);
    } catch (error) {
      tempAlert(error?.message, 3000, true);
    }
  };

  search.addEventListener('change', (e) => {
    const val = e.target.value;
    console.log(val);
    if (val == 1) return fetchUserByActive(true);
    if (val == 2) return fetchUserByActive(false);
    emptyUpNode();
    showSubscription();
  });
  exportCSV.addEventListener('click', () => exportUser());
  function exportUser() {
    console.log('hi');
    fetch('/api/v1/subscription/export/')
      .then((res) => res)
      .then(async (res) => {
        if (res.status === 500 || res.status === 404) {
          return tempAlert('No data found', 3000, true);
        }
        res.blob().then((blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          downloadCSV.href = downloadUrl;
          downloadCSV.setAttribute('download', 'user.xlsx');
          downloadCSV.click();
        });
      })
      .catch((e) => {
        tempAlert(e?.message || 'Something went wrong', 5000, true);
      });
  }
})();