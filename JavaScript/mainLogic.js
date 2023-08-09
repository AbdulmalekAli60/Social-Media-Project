const baseURL = "https://tarmeezacademy.com/api/v1"

// Post Requests

function editPostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("post-modal-submit-modal").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}

function deletePostBtnClicked(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("delete-post-id-input").value = post.id

    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}


function confirmPostDelete() {
    const postId = document.getElementById("delete-post-id-input").value
    const token = localStorage.getItem("token")

    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }


    axios.delete(`${baseURL}/posts/${postId}`, {
        headers: headers

    })
        .then(function (response) {

            // Close the modal after login
            const modal = document.getElementById("delete-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("The Post has been Deleted Successfully", "success")
            getPosts()
            setupUI()
            // Close the modal after login

        })
        .catch(function (error) {
            const errorMessage = error.response.data.message
            showAlert(errorMessage, "danger")
        });
}

function createNewPostClicked() {
    let postId = document.getElementById("post-id-input").value
    isCreate = postId == null || postId == ""

    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")

    //Sending form data in axios
    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)
    //Sending form data in axios

    const headers = {
        "authorization": `Bearer ${token}`
    }

    let url = ``
    if (isCreate) {
        url = `${baseURL}/posts`  // for creating a new post


    } else {
        formData.append("_method", "put") // for editing a post 
        url = `${baseURL}/posts/${postId}`

    }

    toggleLoader(true)
    axios.post(url, formData, {
        // "Content-Type": "multipart/form-data",
        headers: headers
    })
        .then(function (response) {

            // Close the modal after login
            const modal = document.getElementById("create-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("Post Sent Successfully", "success")
            getPosts()
            // Close the modal after login

        })
        .catch(function (error) {
            const errorMessage = error.response.data.message
            showAlert(errorMessage, "danger")
        })
        .finally(() => {
            toggleLoader(false)
        })

}

// Post Requests

function setupUI() {
    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("signin-div")
    const logoutDiv = document.getElementById("logout-div")

    const addBtn = document.getElementById("add-btn")

    if (token == null) { // user is guest (not logged in)
        if (addBtn != null) {
            addBtn.style.setProperty("display", "none", "important")
        }
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")

    } else { // for logged in user

        if (addBtn != null) {
            addBtn.style.setProperty("display", "block", "important")
        }

        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")

        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}


function loginBtnClicked() {
    const username = document.getElementById("username_input").value
    const password = document.getElementById("password-input").value

    const params = {
        "username": username,
        "password": password
    }
    toggleLoader(true)
    axios.post(`${baseURL}/login`, params)
        .then(function (response) {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            // Close the modal after login
            const modal = document.getElementById("login-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("Logged in successfully", "success")
            setupUI()
            // Close the modal after login

        })
        .catch(function (error) {
            const errorMessage = error.response.data.message
            showAlert(errorMessage, "danger")
        })
        .finally(() => {
            toggleLoader(false)
        })
}

function registerBtnClicked() {
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const image = document.getElementById("register-image-input").files[0]

    //Sending form data in axios
    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)
    //Sending form data in axios

    const headers = {
        "Content-Type": "multipart/form-data",
    }
    toggleLoader(true)
    axios.post(`${baseURL}/register`, formData, {
        headers: headers

    })
        .then(function (response) {

            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            // Close the modal after Register
            const modal = document.getElementById("register-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("New User Registered Successfully", "success")
            setupUI()
            // Close the modal after Register

        })
        .catch(function (error) {
            const errorMessage = error.response.data.message
            showAlert(errorMessage, "danger")
        })
        .finally(() => {
            toggleLoader(false)
        })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out successfully", "success")
    getPosts()
    setupUI()
}

function showAlert(customMessage, color = "success") {
    const alertPlaceholder = document.getElementById("success-alert")
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    appendAlert(customMessage, color)

    // setTimeout(() => {
    //     const alert = bootstrap.Alert.getOrCreateInstance("#success-alert")
    //     document.getElementById("success-alert").hide()
    // }, 2000)
}

function getCurrentUser() {
    let user = null
    const storageUser = localStorage.getItem("user")

    if (storageUser != null) {
        user = JSON.parse(storageUser)
    }
    return user
}


function postClicked(postId) {
    window.location = `postDetails.html?postId=${postId}`
}

function profileClicked() {
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`
}

function toggleLoader(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = "visible"
    } else {
        document.getElementById("loader").style.visibility = "hidden"
    }
}
