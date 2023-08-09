
setupUI()

let currentPage = 1
let lastPage = 1

//INFINITE SCROLL
window.addEventListener("scroll", () => {
    const endOfPage = window.scrollY + window.innerHeight + 1 >= document.documentElement.scrollHeight;
    if (endOfPage && currentPage < lastPage) {
        currentPage = currentPage + 1
        getPosts(false, currentPage)
    }
});
//INFINITE SCROLL

getPosts()

function userClicked(userId) {
    window.location = `profile.html?userid=${userId}`
}


function getPosts(reload = true, page = 1) {
    toggleLoader(true)
    axios.get(`${baseURL}/posts?limit=5&page=${page}`)
        .then(function (response) {
            toggleLoader(false)
            const posts = response.data.data

            lastPage = response.data.meta.last_page

            if (reload) { //to remove the static content from html
                document.getElementById("posts").innerHTML = ""
            }

            for (post of posts) {

                const author = post.author
                let postTitle = ""

                //show or hide edit button
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editButtonContent = ``

                if (isMyPost) {
                    editButtonContent =
                        `
                  <button class='btn btn-danger' title="Delete" style='float: right; margin-left:5px; line-height:0;' onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"><span class="material-symbols-outlined">
                  delete
                  </span></button>

                  <button class='btn btn-secondary' title="Edit" style='float: right;  line-height:0;' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"><span class="material-symbols-rounded">
                  edit
                  </span></button>
            
                  `
                }
                //show or hide edit button


                if (post.title != null) {
                    postTitle = post.title
                }

                let content = `
            <div class="card shadow">
                <div class="card-header">
                      <div style="display:inline; cursor: pointer; "  onclick="userClicked(${author.id})">
                            <img class="rounded-circle border border-2 " src="${author.profile_image}" alt=""
                                style="width: 40px; height: 40px;">
                            <b>${author.username}</b>
                        </div>
                        ${editButtonContent}
                </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
                    <img class="w-100" src="${post.image}"
                        alt="">

                    <h6 style="color: rgb(193, 193, 193);" class="mt-1">
                        ${post.created_at}
                    </h6>

                    <h5>
                        ${postTitle}
                    </h5>

                    <p>
                        ${post.body}
                    </p>

                    <hr>

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pen" viewBox="0 0 16 16">
                        <path
                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                    </svg>

                    <span>
                        (${post.comments_count}) Comments

                        <span id="post-tags-${post.id}">
                          <!--  <button class="btn btn-sm rounded-5" style="background-color:gray; color: white;">
                                Policy
                            </button> -->
                        </span>
                    </span>

                </div>
            </div>
            `
                document.getElementById("posts").innerHTML += content

                const currentPostTagsId = `post-tags-${post.id}`
                document.getElementById(currentPostTagsId).innerHTML = ""

                for (tag of post.tags) {
                    let tagsContent =
                        `
                    <button class="btn btn-sm rounded-5" style="background-color:gray; color: white;">
                         ${tag.name}
                    </button>
                `
                    document.getElementById(currentPostTagsId).innerHTML = tagsContent

                }
            }
        })
        .catch(function (error) {
            const errorMessage = error.response.data.message
            showAlert(errorMessage, "danger")
        })
}



function addBtnClicked() {

    document.getElementById("post-modal-submit-modal").innerHTML = "Create"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create a New Post"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}

function loginBtnClicked() {
    const username = document.getElementById("username_input").value
    const password = document.getElementById("password-input").value

    const params = {
        "username": username,
        "password": password
    }

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
        });
}


