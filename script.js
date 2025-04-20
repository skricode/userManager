
const table_content = document.querySelector('#userTable tbody');
const pagination = document.getElementById("pagination");


let users = [];
let curPage = 1;
let rowsPerPage = 10;

fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
    .then(res => res.json())
    .then(data => {
        users = data;
        // console.log(users);
        renderTable(users);
        renderPagination(users.length);
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
                <button class="editBtn">Edit</button>
                <button class="deleteBtn" data-email="${user.email}">Delete</button>
            </td>`;
        table_content.appendChild(row);
    });
}


function renderPagination(totalUsers){
    pagination.innerHTML = "";
    const totalPages = Math.ceil(totalUsers / rowsPerPage);

    for(let i=1; i<=totalPages; i++){
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.toggle("active", i === curPage);

        btn.addEventListener("click", () => {
            curPage = i;
            renderTable(users);
            renderPagination(users.length);
        });
        pagination.appendChild(btn);
    }
}