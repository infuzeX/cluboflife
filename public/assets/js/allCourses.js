getMe();

const template = document.querySelector('template');
const courseContainer = document.querySelector('.allCourses-flex-parent');
const noCourse = document.querySelector('.noCourse');

const createProductNode = (product) => {
  const clone = template.content.cloneNode(true);
  if (!product?.course) return;
  const courseRoute = `/courses/${product?.course?.courseCode}?courseId=${product?.course?._id}`;
  clone.querySelector('.course').addEventListener('click', () => {
    window.location = courseRoute;
  });
  clone.querySelector('h3').textContent = product?.course?.name;
  clone.querySelector('#subtitle').textContent = product?.course?.description;
  clone.querySelector('#inst-content').children[1].textContent = product?.course?.instructor;
  clone.querySelector('#courseRoute').setAttribute('href', courseRoute);

  courseContainer.append(clone);
};

const showProducts = (products) => {
  console.log(products);
  if (!products || !products?.length) {
    noCourse.setAttribute('style', 'display: flex;justify-content:center;color:grey;');
    noCourse.textContent = 'No courses available';
    return;
  }
  products.map((product) => createProductNode(product));
  if (!courseContainer.innerHTML) {
    noCourse.setAttribute('style', 'display: flex;justify-content:center;color:grey;');
    noCourse.textContent = 'No courses available';
  }
};

const getOrder = async () => {
  try {
    const res = await fetch('/api/v1/users/orders?active=true&fields=course,expiresAt');
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
