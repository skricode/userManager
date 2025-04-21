
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
            renderTable(searchResult);
            renderPagination(searchResult.length);
        });
        pagination.appendChild(btn);
    }
}

searchBox.addEventListener("input", handleSearch);

function handleSearch(){
    const searchData = searchBox.value.trim().toLowerCase();

    searchResult = users.filter(user => 
        user.name.toLowerCase().includes(searchData) || 
        user.email.toLowerCase().includes(searchData) || 
        user.role.toLowerCase().includes(searchData)
    );
    curPage=1;
    renderTable(searchResult);
    renderPagination(searchResult.length);
}