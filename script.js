
const table_content = document.querySelector('#userTable tbody');
const pagination = document.getElementById("pagination");
const searchBox = document.getElementById("search-box");
let searchResult = [];

let users = [];
let curPage = 1;
let rowsPerPage = 10;

fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
    .then(res => res.json())
    .then(data => {
        users = data;
        searchResult = users;
        // console.log(users);
        renderTable(searchResult);
        renderPagination(searchResult.length);
    }).catch(err => {
        console.log("Data not Fetched: ", err);
    });

function renderTable(data) {
    table_content.innerHTML = "";

    const startPage = (curPage - 1) * rowsPerPage;
    const paginationUsers = data.slice(startPage, startPage + rowsPerPage);

    paginationUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="select-user" data-email="${user.email}"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <a href="" class="editIcon"><img src="assets/user_edit.png" alt="edit" width="30px"></a>
                <a href="" class="deleteIcon" data-email="${user.email}"><img src="assets/delete.png" alt="delete" width="30px"></a>
            </td>`;
        table_content.appendChild(row);
    });

    // delete after click individually
    const deleteUser = table_content.querySelectorAll(".deleteIcon");

    deleteUser.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const email = btn.dataset.email;

            users = users.filter(user => user.email !== email);
            searchResult = users;
            renderTable(searchResult);
            renderPagination(searchResult.length);
        })
    });
    // update after click individually
    const editUser = table_content.querySelectorAll(".editIcon");

    editUser.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const row = btn.closest("tr");
            // data-email is available on deleteIcon so
            const email = row.querySelector(".deleteIcon").dataset.email;
            const user = users.find(u => u.email === email);

            // Replace cells with input fields..
            row.innerHTML = `
            <td><input type="checkbox" class="select-user" data-email="${email}" disabled></td>
            <td><input type="text" value="${user.name}" class="edit-name"></td>
            <td><input type="text" value="${user.email}" class="edit-email"></td>
            <td><input type="text" value="${user.role}" class="edit-role"></td>
            <td>
                <button class="saveBtn">Save</button>
                <button class="cancelBtn">Cancel</button>
            </td>`;

            //save n update
            row.querySelector(".saveBtn").addEventListener("click", () => {
                user.name = row.querySelector(".edit-name").value;
                user.email = row.querySelector(".edit-email").value;
                user.role = row.querySelector(".edit-role").value;

                searchResult = users;
                renderTable(searchResult);
                renderPagination(searchResult.length);
            });

            //cancel edit
            row.querySelector(".cancelBtn").addEventListener("click", () => {
                renderTable(searchResult);
                renderPagination(searchResult.length);
            });
        });
    });
    hookSelectCheckboxes();
}

//delete checked users
const deleteSelected = document.getElementById("deleteSelectedUsers");

deleteSelected.addEventListener("click", () => {
    const selectedUsers = [...document.querySelectorAll(".select-user:checked")]
        .map(cb => cb.dataset.email);

    //delete from lists of users
    users = users.filter(user => !selectedUsers.includes(user.email));
    searchResult = users;

    renderTable(searchResult);
    renderPagination(searchResult.length);

});

function hookSelectCheckboxes() {
    const selectAll = document.getElementById("selectAllUsers");
    const checkboxes = document.querySelectorAll(".select-user");

    //restting bcz of reload to new 
    selectAll.checked = false;

    // select / deselct all users
    selectAll.addEventListener("change", () => {
        checkboxes.forEach(cb => cb.checked = selectAll.checked);
    });

    //selectAll users when individual checkboxes chnage
    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const allChecked = [...checkboxes].every(c => c.checked);
            selectAll.checked = allChecked;
        });
    });
}

function renderPagination(totalUsers) {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalUsers / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle("active", i === curPage);

        btn.addEventListener("click", () => {
            curPage = i;
            renderTable(searchResult);
            renderPagination(searchResult.length);
        });
        pagination.appendChild(btn);
    }

    document.getElementById("prevPage").disabled = curPage === 1;
    document.getElementById("nextPage").disabled = curPage === totalPages;
    document.getElementById("firstPage").disabled = curPage === 1;
    document.getElementById("lastPage").disabled = curPage === totalPages;

}
// pagination direct button jumps
function firstPage() {
    curPage = 1;
    renderTable(searchResult);
    renderPagination(searchResult.length);
}
function prevPage() {
    if (curPage > 1) {
        curPage--;
        renderTable(searchResult);
        renderPagination(searchResult.length);
    }
}
function nextPage() {
    const totalPages = Math.ceil(searchResult.length / rowsPerPage);
    if (curPage < totalPages) {
        curPage++;
        renderTable(searchResult);
        renderPagination(searchResult.length);
    }
}
function lastPage() {
    curPage = Math.ceil(searchResult.length / rowsPerPage);
    renderTable(searchResult);
    renderPagination(searchResult.length);
}
searchBox.addEventListener("input", handleSearch);

function handleSearch() {
    const searchData = searchBox.value.trim().toLowerCase();

    searchResult = users.filter(user =>
        user.name.toLowerCase().includes(searchData) ||
        user.email.toLowerCase().includes(searchData) ||
        user.role.toLowerCase().includes(searchData)
    );
    curPage = 1;
    renderTable(searchResult);
    renderPagination(searchResult.length);
}
