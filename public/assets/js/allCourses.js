getMe();

const template = document.querySelector('template');
const courseContainer = document.querySelector('.allCourses-flex-parent');

const createProductNode = (product) => {
  const clone = template.content.cloneNode(true);
  clone.querySelector(
    'h3'
  ).innerText = `${product?.course?.name} with ${product.course?.instructor}`;
  courseContainer.append(clone);
};

const showProducts = (products) => {
  if (!products || !products?.length) return;

  products.map((product) => createProductNode(product));
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
