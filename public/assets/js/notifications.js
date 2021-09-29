const notificationForm = document.querySelector('.notification-form');
const pageState = {
    dom: {
        notifications: document.querySelector('.notifications')
    },
    getElement: function (element) {
        return this.dom[element];
    },
    notifications: [],
    buildNotification: (data) => {
        return `  <div id="n_${data._id}" class="notification">
        <div class="content">
            <p>${data.message}</p>
            <div class="detail">
            <span class="user"><i class="fas fa-user"></i>&nbsp;${data.sender}</span>
            &nbsp;&nbsp;
            <span class="time"><i class="fas fa-clock"></i>&nbsp;${new Date(data.createdAt).toLocaleTimeString()}</span>
        </div>  
        </div>
        <span id="${data._id}" onclick="deleteMessage(event)"><i class="fas fa-trash"></i></span>
    </div>`
    },
    setNotification: function (notification) {
        this.notifications = [...notification, ...this.notifications];
        let lists = '';
        this.notifications.forEach(notification => {
            lists += this.buildNotification(notification);
        });
        this.dom.notifications.innerHTML = lists
    },
    setDate: function (date) {

    },
    query: {}
}

const deleteMessage = async (e) => {
    try {
        const id = e.path[1].id;
        if (!id) return;
        const ok = confirm("Do you want to delete Notification?");
        if (!ok) return
        const resp = await fetch(`/api/v1/notifications/${id}`, {
            method: "DELETE"
        })
        const res = await resp.json()
        if (res.status === "success") {
            const el = pageState.getElement('notifications')
            el.removeChild(el.querySelector(`#n_${id}`));
        } else {
            console.log(res);
            alert(res.message);
        }
    } catch (err) {
        alert(err.message);
    }
}


fetch('/api/v1/notifications?sort=-createdAt', {
    method: 'GET'
}).then(res => res.json())
    .then(res => {
        if (res.status === "success") {
            pageState.setNotification(res.data.notifications);
        } else {
            alert(err.message)
        }
    })
    .catch(err => {
        alert(err.message);
    });


notificationForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = e.target.elements.notification;
    const notification = input.value;
    if (!notification) return;
    const res = await fetch('/api/v1/notifications', {
        method: "POST",
        headers: {
            "content-type": 'application/json'
        },
        body: JSON.stringify({ message: notification })
    })
    const data = await res.json();
    if (data.status === "success") {
        pageState.setNotification([data.data.notification]);
        input.value = "";
        input.focus();
        pageState.dom.notifications.scrollIntoView(false);
        return;
    }
    alert(data.message);
})