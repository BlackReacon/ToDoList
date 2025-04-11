//var
let todoList = document.querySelector("#todo_list");
let todoInput = document.querySelector("#in_todoName");
let addButton = document.querySelector("#b_addTodo");

let arrTask = [];

//Event Listener
document.addEventListener("DOMContentLoaded", init);

addButton.addEventListener("click", () => {
  addTodo(event);
});

//Function

function init() {
  if (localStorage.getItem("tasks")) {
    arrTask = JSON.parse(localStorage.getItem("tasks"));
    generateTaskList();
  }
}

//Add to do
function addTodo(event) {
  event.preventDefault();
  if (todoInput.value) {
    arrTask.push(todoInput.value);
    // console.log(arrTask);
    generateTaskList();
    todoInput.value = "";
  }
}

//Generate HTML
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
}

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

//Local storage set
function saveTask() {
  let stringifiedTasks = JSON.stringify(arrTask);
  localStorage.setItem("tasks", "");
  localStorage.setItem("tasks", stringifiedTasks);
}

//--------------------------------
// Get the modal
var modal_registration = document.getElementById("registrat");
var modal_login = document.getElementById("signin");

// Get the button that opens the modal
var btn_registration = document.getElementById("b_registration");
var btn_login = document.getElementById("b_login");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn_registration.onclick = function() {
    modal_registration.style.display = "block";
}
btn_login.onclick = function() {
    modal_login.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
 span.onclick = function() {
    modal_registration.style.display = "none";
    modal_login.style.display = "none";
 }

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
   if (event.target == modal_registration || event.target == modal_login) {
    modal_registration.style.display = "none";
    modal_login.style.display = "none";
   }
 }