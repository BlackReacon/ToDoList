//var
let todoList = document.querySelector("#todo_list");
let todoInput = document.querySelector("#in_todoName");
let addButton = document.querySelector("#b_addTodo");

let arrTask = [];

//Event Listener
document.addEventListener('DOMContentLoaded', init);

addButton.addEventListener("click",() => {addTodo(event)});

//Function

function init() {
    if (localStorage.getItem("tasks")){
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
  for (let index = 0 ; index < arrTask.length; index++) {
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
arrTask.splice(tasknr,1);
generateTaskList();
}

//Edit Task
function editTask(tasknr) {
    arrTask[tasknr]= document.querySelector('#editInput' + tasknr).value;
    generateTaskList();
}

//Local storage set 
function saveTask() {
    let stringifiedTasks = JSON.stringify(arrTask);
    localStorage.setItem("tasks", "");
    localStorage.setItem("tasks", stringifiedTasks);
}
