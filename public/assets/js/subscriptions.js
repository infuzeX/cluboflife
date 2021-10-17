(() => {
  const __GLOBAL_PURCHASE = {
    courses: [], //list of courses
    users: [], //list of users
    purchases: [], //list of all subscriptionss
    edit: '',
    invalidSubscriptions: [], //list of deleteed user or course subscription
    subscriptions: [], //list of subscriptions
    query: { sort: '' },
    table: 'subscriptions',
    datalist: {}
  };

  const addSubscriptionForm = document.querySelector('.addStudent');
  //form select fields dropdown
  const userDropdown = document.querySelectorAll('.userDropdown');
  const courseDropdown = document.querySelectorAll('.courseDropdown');
  //form input fields
  //const userInput = document.querySelector('#nameList');
  //const courseInput = document.querySelector('#courseList');
  const boughtInput = document.querySelector('.boughtAtAdd');
  const expiresInput = document.querySelector('.expireAtAdd');
  //from input fields
  const user = document.querySelector('#userList');
  const course = document.querySelector('#course');
  const paidInput = document.querySelector('.paid');
  const activeInput = document.querySelector('#active');
  const activeContainer = document.querySelector('.activeContainer');
  const template = document.querySelector('template');
  const studentDetail = document.querySelector('.studentDetail');
  const addSubscriptionModal = document.querySelector('.addModal');
  const exportCSV = document.querySelector('.export');
  const downloadCSV = document.querySelector('.download');
  [...document.querySelectorAll('.sort')].forEach(sort => {
    sort.onclick = function (e) {
      if (!e.target.id) return;
      var isUp = false, id = e.target.id;
      if (id.startsWith('_') || !id.startsWith('-')) {
        id = `-${id.startsWith('_') ? id.slice(1) : id}`;
        isUp = true;
      } else {
        id = id.slice(1);
        isUp = false;
      }
      __GLOBAL_PURCHASE.query.sort = id;
      e.target.id = id;
      e.target.children[0].className = `fas fa-arrow-${isUp ? 'down' : 'up'}`;
      emptyUpNode();
      fetchSubscriptions();
    }
  });
  //NEW TABLE
  const tabledata = document.querySelector('.tabledata');
  const buildTableRow = (data) => {
    const tr = document.createElement('tr');
    tr.classList.add('content');
    for (let key in data) {
      let id = null;
      const td = document.createElement('td');
      if (key === "_id") {
        id = data[key];
        continue;
      } else if (["expiresAt", "boughtAt"].includes(key)) {
        td.textContent = new Date(data[key]).toLocaleDateString();
      } else if (["createdAt"].includes(key)) {
        continue;
      } else if ("user" === key) {
        const td1 = document.createElement('td');
        td1.textContent = data[key].name;
        tr.appendChild(td1);
        td.textContent = data[key].email;
      } else if ("course" === key) {
        td.textContent = data[key].name;
      } else {
        td.textContent = data[key];
      }
      tr.appendChild(td);
    }
    tabledata.appendChild(tr);
  }
  //SETTINGS
  const settings = [...document.querySelectorAll('.setting')];

  //Search Event Handler
  async function searchData(e) {
    try {
      const parent = e.path[1];
      const searchValue = e.target.value;
      //clear previous data list
      parent.children[1].innerHTML = '';
      if (searchValue === "") {
        delete __GLOBAL_PURCHASE.query["user"];
        delete __GLOBAL_PURCHASE.query["course"];
        emptyUpNode();
        fetchSubscriptions()
        return;
      }
      //fetch data

      const buildQuery = (queryId, searchValue) => {
        var queryStr = ""
        const queries = {
          'users': ['name', 'email'],
          'courses': ['name', 'courseCode']
        }[queryId]
        queries.forEach(queryKey => {
          queryStr += `or[${queryKey}][regex]=${searchValue}&or[${queryKey}][options]=i&`;
        });
        return queryId === "users" ? queryStr + "role=student" : queryStr;
      }

      //`name[regex]=${searchValue}&name[options]=i&fields=name,email` : `name[regex]=${searchValue}&name[options]=i&fields=name,courseCode`
      console.log("Building Queries!");
      const queryString = buildQuery(e.target.id, searchValue);
      console.log(queryString);
      const response = await fetch(`/api/v1/${e.target.id}?${queryString}`);
      const res = await response.json();
      if (['error', 'fail'].includes(res.status)) {
        throw new Error(subs.message);
      }
      const data = res?.data[e.target.id] || res?.data['students'];
      parent.children[1].innerHTML = ""
      //display data
      console.log(data);
      data.forEach(data => {
        const list = document.createElement('li');
        list.id = `${e.target.id.slice(0, e.target.id.length - 1)}_${data._id}`;
        list.onclick = findByData;
        const child1 = document.createElement('span')
        child1.textContent = data.name;
        child1.id = `${e.target.id.slice(0, e.target.id.length - 1)}_${data._id}`;
        const child2 = document.createElement('span');
        child2.id = `${e.target.id.slice(0, e.target.id.length - 1)}_${data._id}`;;
        child2.textContent = data.courseCode || data.email;
        list.appendChild(child1)
        list.appendChild(child2);
        parent.children[1].appendChild(list);
      })
      __GLOBAL_PURCHASE.datalist[e.target.id.slice(0, e.target.id.length - 1)] = parent.children[1];

    } catch (error) {
      tempAlert(error?.message, 5000, true);
    }
  }

  //ATTACH EVENTS TO SEARCH FORM
  settings[0].children[0].addEventListener('input', searchData);
  settings[1].children[0].addEventListener('input', searchData);

  //FIND SUBSCRIPTION BY SELECTING DATA
  async function findByData(e) {
    const [key, id] = e.target.id.split('_');
    __GLOBAL_PURCHASE.query[key] = id;
    console.log(__GLOBAL_PURCHASE);
    emptyUpNode();
    await fetchSubscriptions();
    __GLOBAL_PURCHASE.datalist[key].innerHTML = "";
  }

  /**
 * @description handle filter
 */
  settings[2].addEventListener('change', (e) => {
    const val = Number.parseInt(e.target.value);
    if (!val) {
      delete __GLOBAL_PURCHASE.query['active'];
    } else {
      __GLOBAL_PURCHASE.query["active"] = { 0: null, 1: true, 2: false }[val];
    }
    emptyUpNode();
    fetchSubscriptions();
  });

  settings[3].addEventListener('change', (e) => {
    const val = e.target.value;
    emptyUpNode();
    __GLOBAL_PURCHASE["table"] = val;
    showSubscription(__GLOBAL_PURCHASE[val]);
  });
  /**FILTER FUNCTIONS ENDS */

  const pushToDropdown = (arr, dropdowns) => {
    if (!arr || !arr.length) return;
    arr.forEach((item) => {
      const option = document.createElement('option');
      option.value = item._id;
      option.textContent = item.name;
      dropdowns.forEach(dropdown => dropdown.appendChild(option));
    });
  };

  const emptyUpNode = () => (studentDetail.innerHTML = '');

  const genDate = (date) => {
    return date ? date?.split('T')[0] : '';
  };
  const convertInUSD = (amount) => {
    amount = Number.parseInt(amount);
    if (isNaN(amount)) return undefined;
    return (amount / 100);
  }
  const convertInCents = (amount) => {
    amount = Number.parseFloat(amount);
    if (isNaN(amount)) return undefined;
    return Math.round(amount * 100)
  }

  const copySubscription = (data) => {
    return `
Name:${data.user.name},
Email:${data.user.email},
Course:${data.course?.name || 'Not Available'},
Course Code: ${data.course?.courseCode || 'Not Available'},
Subscription:${data.expiresAt}
      `
  }

  const createSubscriptionNode = (subscription, i) => {

    /**
     * new table data
     */
    //buildTableRow({ index: i, ...subscription });
    const clone = template.content.cloneNode(true);
    clone.querySelector('.index').textContent = i + 1;
    clone.querySelector('.name').textContent =
      subscription?.user?.name || '-';
    clone.querySelector('.email').textContent =
      subscription?.user?.email || '-';
    //modifiy course column based on value [start]
    clone.querySelector('.course').textContent =
      subscription?.course?.name || '-';
    clone.querySelector('.course').style.color =
      subscription?.course ? 'black' : 'grey';
    //modifiy course column based on value [end]
    clone.querySelector('.boughtAt').textContent =
      subscription?.boughtAt && genDate(subscription?.boughtAt);
    clone.querySelector('.expiresAt').innerHTML =
      subscription.expiresAt ? genDate(subscription?.expiresAt) : "Never";
    clone.querySelector('.paid').textContent = convertInUSD(subscription?.paid);
    clone.querySelector('.active').textContent = subscription?.active;

    clone.querySelector('.copy').addEventListener('click', () => {
      window.navigator.clipboard.writeText(copySubscription(subscription));
      tempAlert('Copied', 2000);
    });

    clone
      .querySelector('.edit')
      .addEventListener('click', () => onEdit(subscription));
    clone
      .querySelector('.delete')
      .addEventListener(
        'click',
        async () => await deleteSubscription(subscription._id)
      );
    studentDetail.append(clone);
    return i + 1;
  };

  const showSubscription = (subscriptions, allowed) => {
    let i = 0;
    subscriptions.forEach((sub) => {
      i = createSubscriptionNode(sub, i, allowed)
    });
  };

  const fetchSubscriptions = async () => {
    try {
      const queryString = new URLSearchParams(__GLOBAL_PURCHASE.query).toString();
      const res = await fetch(`/api/v1/subscriptions?${queryString}`);
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      const data = subs?.data?.subscriptions;
      __GLOBAL_PURCHASE["invalidSubscriptions"] = [];
      __GLOBAL_PURCHASE["subscriptions"] = [];
      data.forEach(data => {
        const subType = (!data.user || !data.course) ? "invalidSubscriptions" : "subscriptions";
        __GLOBAL_PURCHASE[subType].push(data);
      })
      showSubscription(__GLOBAL_PURCHASE[__GLOBAL_PURCHASE.table]);
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  };

  fetchSubscriptions();

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
      pushToDropdown(course?.data?.courses, courseDropdown);
      __GLOBAL_PURCHASE.courses = [...course?.data?.courses];
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  };

  getUsers();
  getCourses();

  const deleteSubscription = async (id) => {
    const okDelete = confirm("Are you sure you want to delete this subscription!");
    if (!okDelete) return;

    try {
      const res = await fetch(`/api/v1/subscriptions/${id}`, {
        method: 'DELETE',
      });
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      const subscriptions = __GLOBAL_PURCHASE[__GLOBAL_PURCHASE.table].filter(
        (sub) => sub._id !== id
      );
      __GLOBAL_PURCHASE[[__GLOBAL_PURCHASE.table]] = subscriptions;
      emptyUpNode();
      showSubscription(subscriptions);
      tempAlert('Deleted', 2000);
    } catch (error) {
      tempAlert(error?.message, 4000, true);
    }
  }

  const editPurchase = async (data) => {
    const id = __GLOBAL_PURCHASE.edit;
    if (!id) return;
    try {
      const res = await fetch(`/api/v1/subscriptions/${id}`, {
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
      await fetchSubscriptions();
    } catch (error) {
      tempAlert(error?.message, 4000, true);
    }
  };

  function selectOption(dropdown, value, isSelected) {
    [...dropdown[0].children].forEach(option => {
      if (option.value === value) option.selected = isSelected;
    })
  }

  function onEdit(sub) {
    __GLOBAL_PURCHASE.edit = sub._id;
    //userInput.value = sub.user?.email || '';
    selectOption(userDropdown, sub.user._id, true)
    //courseInput.value = sub.course?.name || '';
    selectOption(courseDropdown, sub.course._id, true);
    boughtInput.value = sub.boughtAt && genDate(sub.boughtAt);
    expiresInput.value = sub.expiresAt && genDate(sub.expiresAt);
    paidInput.value = (Number.parseInt(sub.paid) / 100);
    activeContainer.style.display = 'block';
    activeInput.checked = sub.active;
    toggleModal(addSubscriptionModal);
  }

  function clear() {
    __GLOBAL_PURCHASE.edit = '';
    //userInput.value = '';
    ///courseInput.value = '';
    boughtInput.value = '';
    expiresInput.value = '';
    paidInput.value = '';
    activeContainer.style.display = 'none';
    //  activeInput.checked = sub.active;
    toggleModal(addSubscriptionModal);
  }

  addSubscriptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const elements = addSubscriptionForm.elements;
    const userId = elements["user"].value; /*user?.options
      ?.namedItem(userInput?.value)
      ?.getAttribute('data-id');*/
    const courseId = elements["course"].value/*course?.options
      ?.namedItem(courseInput?.value)
      ?.getAttribute('data-id');*/
    const boughtAt = elements['boughtAt'].value;
    const expiresAt = elements['expiresAt'].value;
    const paid = convertInCents(elements['paid'].value);
    const active = elements['active'].checked;
    console.log(active);
    if (!userId || !courseId || !boughtAt || !paid) {
      return tempAlert('Please fill all fields', 4000, true);
    }

    if (__GLOBAL_PURCHASE.edit)
      return editPurchase({
        user: userId,
        course: courseId,
        boughtAt: new Date(boughtAt).getTime(),
        expiresAt: new Date(expiresAt).getTime(),
        paid: paid,
        active,
      });

    try {
      const res = await fetch('/api/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId,
          boughtAt,
          expiresAt,
          paid: paid,
        }),
      });
      const subs = await res.json();
      if (subs.status === 'error' || subs.status === 'fail') {
        throw new Error(subs.message);
      }
      const data = {
        _id: subs?.data?.subscription?._id,
        course: {
          _id: subs?.data?.subscription?.course?._id,
          name: subs?.data?.subscription?.course?.name
        },
        user: {
          _id: subs?.data?.subscription?.user?._id,
          name: subs?.data?.subscription?.user?.name,
          email: subs.data?.subscription?.user?.email
        },
        boughtAt,
        expiresAt,
        active: true,
        paid: subs?.data?.subscription?.paid,
      };

      console.log(data);

      __GLOBAL_PURCHASE[__GLOBAL_PURCHASE.table] = [data, ...__GLOBAL_PURCHASE[__GLOBAL_PURCHASE.table]];
      emptyUpNode();
      showSubscription(__GLOBAL_PURCHASE[__GLOBAL_PURCHASE.table]);
      toggleModal(addSubscriptionModal);
      tempAlert('Added Subscription', 2000);
      //userInput.value = '';
      //courseInput.value = '';
      boughtInput.value = '';
      expiresInput.value = '';
      paidInput.value = '';
    } catch (error) {
      console.log(error);
      tempAlert(error?.message, 5000, true);
    }
  });



  /**
   * @description export subscriptions data
   */
  exportCSV.addEventListener('click', () => exportUser());
  function exportUser() {
    console.log('hi');
    fetch('/api/v1/subscriptions/export/')
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