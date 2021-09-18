getMe();

const template = document.querySelector('template');
const courseContainer = document.querySelector('.allCourses-flex-parent');
const noCourse = document.querySelector('.noCourse');

const createProductNode = (product) => {
  const clone = template.content.cloneNode(true);
  if (!product?.course) return;
  clone.querySelector('.course').addEventListener('click', () => {
    console.log('hi');
    window.location = `/courses/${product?.course?.courseCode}?courseId=${product?.course?._id}`;
  });
  clone.querySelector(
    'h3'
  ).innerText = `${product?.course?.name} with ${product.course?.instructor}`;

  courseContainer.append(clone);
};

const showProducts = (products) => {
  if (!products || !products?.length) {
    noCourse.setAttribute('style', 'display: flex;justify-content:center;');
    noCourse.textContent = 'No courses available';
    return;
  }

  products.map((product) => createProductNode(product));
  if (!courseContainer.innerHTML) {
    noCourse.setAttribute('style', 'display: flex;justify-content:center;');
    noCourse.textContent = 'No courses available';
  }
};

const getOrder = async () => {
  try {
    const res = await fetch('/api/v1/users/orders?active=true');
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
