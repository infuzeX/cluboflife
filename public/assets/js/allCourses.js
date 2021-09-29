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
  clone.querySelector('h3').textContent = scaleText(product?.course?.name, 50);
  clone.querySelector('#subtitle').textContent = scaleText(product?.course?.description, 100);
  clone.querySelector('.foot-cont').children[0].innerHTML = `<i class="fas fa-user"></i>&nbsp;${product.course.instructor}`;
  clone.querySelector('.foot-cont').children[1].innerHTML = `<i class="fas fa-clock"></i>&nbsp;${numberOfDays(product.expiresAt)}`;;
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

const numberOfDays = (time) => {
  const timestamp = new Date(time).getTime();
  const currentData = Date.now();
  const remSec = (timestamp - currentData) / 1000;
  const remMin = remSec / 60;
  const remDays = Math.round(remMin / (24 * 60))
  const data = {
    remSec,
    remMin,
    remDays
  }
  return data.remDay < 0 ? "Expired" : `Expires In ${data.remDays} Days`
}

const scaleText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...'
}
getOrder();
