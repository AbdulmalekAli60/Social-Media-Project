setupUI()
getUser()
getPosts()

function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}


function getUser() {
    const id = getCurrentUserId()
    axios.get(`${baseURL}/users/${id}`)
        .then(function (response) {
            const user = response.data.data
            document.getElementById("main-info-email").innerHTML = user.email
            document.getElementById("main-info-name").innerHTML = user.name
            document.getElementById("main-info-username").innerHTML = user.username
            document.getElementById("main-info-image").src = user.profile_image
            document.getElementById("name-posts").innerHTML = `${user.username}'s `
            document.getElementById("nav-username").innerHTML = user.username
            document.getElementById("nav-user-image").src = user.profile_image

            //posts and comments count
            document.getElementById("posts-count").innerHTML = user.posts_count
            document.getElementById("comments-count").innerHTML = user.comments_count
            //posts and comments count

        })
}

function getPosts() {
    const id = getCurrentUserId()

    axios.get(`${baseURL}/users/${id}/posts`)
        .then(function (response) {

            const posts = response.data.data
            document.getElementById("user-posts").innerHTML = ""
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
                    <img class="rounded-circle border border-2 " src="${author.profile_image}" alt=""
                        style="width: 40px; height: 40px;">
                    <b>${author.username}</b>

                        ${editButtonContent}
                </div>
                <div class="card-body" onClick="postClicked(${post.id})" style="cursor: pointer;">
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
                document.getElementById("user-posts").innerHTML += content

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
