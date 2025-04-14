//var
let todoList = document.querySelector("#todo_list");
let todoInput = document.querySelector("#in_todoName");
let addButton = document.querySelector("#b_addTodo");

// Get the modal
let modal_registration = document.getElementById("registrat");
let modal_login = document.getElementById("signin");

// Get the button that opens the modal
let btn_registration = document.getElementById("b_registration");
let btn_login = document.getElementById("b_login");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

//Modal OK button
let btn_r_ok = document.querySelector("#r_button");
let btn_l_ok = document.querySelector("#l_button");

//var register user data
let r_username = document.querySelector("#r_username");
let r_email = document.querySelector("#r_email");
let r_userpassword = document.querySelector("#r_password");

//var login user data
let l_email = document.querySelector("#l_email");
let l_userpassword = document.querySelector("#l_password");
let bearerToken = "";

let arrTask = [];

//Event Listener
document.addEventListener("DOMContentLoaded", init);

addButton.addEventListener("click", () => {
  addTodo(event);
});

//Event Listener modal ok button
btn_r_ok.addEventListener("click", () => {
  register(event);
});

btn_l_ok.addEventListener("click", () => {
  login(event);
});

//Function
function init() {
  /*   if (localStorage.getItem("tasks")) {                --------LocalStorage Task loading
    arrTask = JSON.parse(localStorage.getItem("tasks"));
    generateTaskList();
  } */
  if (localStorage.getItem("token")) {
    bearerToken = localStorage.getItem("token");
    getTaskList();
  }
}

/* LocalStorage--------------//Add to do
function addTodo(event) {
  event.preventDefault();
  if (todoInput.value) {
    arrTask.push(todoInput.value);
    generateTaskList();
    todoInput.value = "";
  }
} */

/* //Generate HTML                --------LocalStorage Task loading
function generateTaskList() {
  todoList.innerHTML = "";
  for (let index = 0; index < arrTask.length; index++) {
    todoList.innerHTML += `<li>
        <input type="checkbox" id="prioCheck${index}">
        <input id="editInput${index}" type=text value="${arrTask[index]}"></input>
        <button onclick="deleteTask(${index})" class="b_delete">delete</button>
        <button onclick="editTask(${index})" class="b_change">edit</button>
    </li>`;
  }
  saveTask();
} */

//Delete Task
function deleteTask(tasknr) {
  arrTask.splice(tasknr, 1);
  generateTaskList();
}

//Edit Task
function editTask(tasknr) {
  arrTask[tasknr] = document.querySelector("#editInput" + tasknr).value;
  generateTaskList();
}

/* //Local storage set
function saveTask() {
  let stringifiedTasks = JSON.stringify(arrTask);
  localStorage.setItem("tasks", "");
  localStorage.setItem("tasks", stringifiedTasks);
} */

//--------------------------------
// When the user clicks on the button, open the modal
btn_registration.onclick = function () {
  modal_registration.style.display = "block";
};
btn_login.onclick = function () {
  modal_login.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal_registration.style.display = "none";
  modal_login.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal_registration || event.target == modal_login) {
    modal_registration.style.display = "none";
    modal_login.style.display = "none";
  }
};
/* --------------------------------- */

function register(event) {
  event.preventDefault();
  //Api register post
  let api_register = {
    name: r_username.value,
    email: r_email.value,
    password: r_userpassword.value,
  };
  fetch("http://192.168.178.43:8000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(api_register),
  })
    .then((response) => response.json())
    .then((data) => notification(data));
}
/* --------------------------------- */

function login(event) {
  event.preventDefault();
  //API login post
  let api_login = {
    email: l_email.value,
    password: l_userpassword.value,
  };
  fetch("http://192.168.178.43:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(api_login),
  })
    .then((response) => response.json())
    .then((data) => safetoken(data));
}
/* --------------------------------- */

function notification(msg) {
  alert("Message from God:" + JSON.stringify(msg.nachricht));
  modal_registration.style.display = "none";
}

function safetoken(token) {
  bearerToken = token.token;
  alert("Loged in");
  modal_login.style.display = "none";
  console.log(bearerToken);
  localStorage.setItem("token", bearerToken);
}
/* --------------------------------- */

function addTodo(event) {
  event.preventDefault();
  console.log(bearerToken);
  if (todoInput.value) {
    fetch("http://192.168.178.43:8000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + bearerToken,
      },
      body: JSON.stringify({ titel: todoInput.value }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));

    todoInput.value = "";
  }
}
/* --------------------------------- */

function getTaskList() {
  fetch("http://192.168.178.43:8000/api/todos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + bearerToken,
    },
  })
    .then((response) => response.json())
    .then((data) => generateTaskList(data));
}

function generateTaskList(task) {
  todoList.innerHTML = "";
  console.log(task);

  task.data.forEach((element) => {
    todoList.innerHTML += `<li>
  <input type="checkbox" id="prioCheck${element.id}">
  <input id="editInput${element.id}" type=text value="${element.titel}"></input>
  <button onclick="deleteTask(${element.id})" class="b_delete">delete</button>
  <button onclick="editTask(${element.id})" class="b_change">edit</button>
</li>`;
  });
}

/* 
  function todo ebarbeiten
  function prio 
  function todo löschen
 */
