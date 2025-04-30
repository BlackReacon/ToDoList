//var
let todoList = document.querySelector("#todo_list");
let todoArchive = document.querySelector("#todo_archive");
let todoInput = document.querySelector("#in_todoName");
let addButton = document.querySelector("#b_addTodo");
let btn_logout = document.querySelector("#b_logout");
let currenTaskId = null;
let oldParentid = null;
let autologin = true;

//css beer var
let h_navbar = document.querySelector(".h_navbar");
let snackbar = document.querySelector("#notyBar");

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

btn_logout.addEventListener("click", logout);

//Function
function init() {
  if (localStorage.getItem("token")) {
    bearerToken = localStorage.getItem("token");
    getTaskList();
  }
}

function logout() {
  localStorage.setItem("token", "");
  notify("successfully logged out", "info");
  todoList.innerHTML = "";
}

//--------------------------------

function register(event) {
  todoList.innerHTML = "";
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
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw err;
        });
      }
      return response.json();
    })
    .then((data) => notification(data))
    .catch((err) => notify(err.message, "critical"));
  l_email.value = r_email.value;
  l_userpassword.value = r_userpassword.value;
  notify("successfully sign in", "info");
}
/* --------------------------------- */

function login(event) {
  if (event) {
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
  } else {
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
}
/* --------------------------------- */

function notification(msg) {
  // alert("Message from God:" + JSON.stringify(msg.nachricht));
  hidden_sidebar("#regist");
  hidden_sidebar("#reg_dialog");
  autologin = false;
  login();
}

function safetoken(token) {
  bearerToken = token.token;
  localStorage.setItem("token", bearerToken);

  if (autologin) {
    hidden_sidebar("#signin");
    hidden_sidebar("#log_dialog");
  }
  autologin = true;
  notify("successfully logged in", "info");
  getTaskList();
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
      .then((data) => getTaskList(data));

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
/* --------------------------------- */

function deleteTask(tasknr) {
  fetch("http://192.168.178.43:8000/api/todos/" + tasknr, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + bearerToken,
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));

  getTaskList();
}
/* --------------------------------- */

function generateTaskList(tasks) {
  todoList.innerHTML = "";
  todoArchive.innerHTML = "";
  console.log(tasks);

  tasks.data.forEach((task) => {
    console.log(task.prio);
    if (task.prio == 1 && task.archiviert == 0) {
      todoList.innerHTML += `
      <article class="item border" draggable="true" id="li${task.id}">
          <div class="field">
            <input id="editInput${task.id}" type="text" value="${task.titel}" class="large" style="font-size: 2rem !important"></input>
          </div>
        <label class="checkbox icon">
          <input type="checkbox" name="prioCheck${task.id}" id="prioCheck${task.id}" onClick="togglePrio(${task.id})" checked>
            <span>
              <i>trending_up</i>
              <i>trending_down</i>
            </span>
        </label>
          <button onclick="deleteTask(${task.id})" class="b_delete"><i>delete</i></button>
          <button onclick="editTask(${task.id})" class="b_change"><i>edit</i></button>
          <button onclick="archive(${task.id})" class="b_archive"><i>archive</i></button>
      </article>`;
    } else if (task.prio == 0 && task.archiviert == 0) {
      todoList.innerHTML += `
      <article class="item border" draggable="true" id="li${task.id}">
          <div class="field">
            <input id="editInput${task.id}" type="text" value="${task.titel}" style="font-size: 2rem !important"></input>
          </div>
        <label class="checkbox icon">  
          <input type="checkbox" name="prioCheck${task.id}" onClick="togglePrio(${task.id})" id="prioCheck${task.id}">
            <span>
              <i>trending_up</i>
              <i>trending_down</i>
            </span>
        </label>
          <button onclick="deleteTask(${task.id})" class="b_delete"><i>delete</i></button>
          <button onclick="editTask(${task.id})" class="b_change"><i>edit</i></button>
          <button onclick="archive(${task.id})" class="b_archive"><i>archive</i></button>
      </article>`;
    } else {
      todoArchive.innerHTML += `
      <article class="item border" draggable="true" id="li${task.id}">
          <div class="field">
            <input id="editInput${task.id}" type="text" value="${task.titel}" style="font-size: 2rem !important"></input>
          </div>
          <button onclick="deleteTask(${task.id})" class="b_delete"><i>delete</i></button>
          <button onclick="editTask(${task.id})" class="b_change"><i>edit</i></button>
          <button onclick="archive(${task.id})" class="b_archive"><i>archive</i></button>
      </article>`;
    }
  });
  tasks.data.forEach((aufgabe) => {
    generateEventlistener(aufgabe.id);
  });
}
/* --------------------------------- */

function generateEventlistener(taskId) {
  document
    .querySelector("#li" + taskId)
    .addEventListener("dragstart", (event) => {
      document.getElementById("li" + taskId).classList.add("wobble");
      startDrag(taskId);
      console.log("Ich bin die TaskId" + taskId);

      oldParentid = document.getElementById("li" + taskId).parentElement.id;
      console.log("old parent:" + oldParentid);
    });
}

function startDrag(taskId) {
  console.log("Start Drag" + taskId);
  currenTaskId = taskId;
}

todoArchive.addEventListener("dragover", function (event) {
  event.preventDefault();
  console.log("wir ziehen grad die id" + currenTaskId + "Über Archive");
});

todoList.addEventListener("dragover", function (event) {
  event.preventDefault();
  console.log("wir ziehen gerade über Todo bzw now mit der id " + currenTaskId);
});

todoArchive.addEventListener("drop", function (event) {
  event.preventDefault();
  if (currenTaskId !== null) {
    console.log("neuer old parent" + oldParentid);
    if (oldParentid == "todo_archive") {
      console.log("NÖ!!");
      document.getElementById("li" + currenTaskId).classList.remove("wobble");
    } else {
      archive(currenTaskId);
      console.log(event.currentTarget.id);
      console.log("Archiviert mit der id nummer" + currenTaskId);
      document.getElementById("li" + currenTaskId).classList.remove("wobble");
    }
  } else {
    console.log("die Taskid ist aktuell null");
    document.getElementById("li" + currenTaskId).classList.remove("wobble");
  }
});

todoList.addEventListener("drop", function (event) {
  event.preventDefault();
  if (currenTaskId !== null) {
    if (oldParentid == "todo_list") {
      console.log("NÖ!!");
      document.getElementById("li" + currenTaskId).classList.remove("wobble");
    } else {
      archive(currenTaskId);
      console.log(event.currentTarget.id);
      console.log("Task wiederhergestellt mit der id " + currenTaskId);
      document.getElementById("li" + currenTaskId).classList.remove("wobble");
    }
  } else {
    console.log("Taskid ist nicht gleich null");
    document.getElementById("li" + currenTaskId).classList.remove("wobble");
  }
});
/* ---------------------------------------------------------------- */

function editTask(tasknr) {
  fetch("http://192.168.178.43:8000/api/todos/" + tasknr, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + bearerToken,
    },
    body: JSON.stringify({
      titel: document.querySelector("#editInput" + tasknr).value,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));

  getTaskList();
}
/* --------------------------------- */

function togglePrio(tasknr) {
  fetch(`http://192.168.178.43:8000/api/todos/${tasknr}/toggle`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + bearerToken,
    },
    body: JSON.stringify({
      prio: document.querySelector("#prioCheck" + tasknr).checked,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  console.log("prio check");

  getTaskList();
}
/* --------------------------------- */

function archive(tasknr) {
  fetch(`http://192.168.178.43:8000/api/todos/${tasknr}/archive`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + bearerToken,
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  console.log("archiviert" + tasknr);
  tasknr = 0;
  getTaskList();
}
/* --------------------------------- */

function notify(msg, state) {
  console.log(msg);

  if (state == "warn") {
    snackbar.innerHTML = "";
    snackbar.innerHTML = `warning: ${msg}`;
    snackbar.classList.add("tertiary", "active");
    hideTimer("#notyBar", "3000", "tertiary,active");
  } else if (state == "critical") {
    snackbar.innerHTML = "";
    snackbar.innerHTML = `error: ${msg}`;
    snackbar.classList.add("error", "active");
    hideTimer("#notyBar", "3000", "error,active");
  } else if (state == "info") {
    snackbar.innerHTML = "";
    snackbar.innerHTML = `information: ${msg}`;
    snackbar.classList.add("active");
    hideTimer("#notyBar", "3000", "active");
  }
}
/* --------------------------------- */
//CSS
function hidden_sidebar(id) {
  document.querySelector(id).classList.toggle("active");
}

function hideTimer(id, timeInMs, removeClasses) {
  let classes = removeClasses.split(",");
  console.log(classes);
  setTimeout(() => {
    for (let index = 0; index <= classes.length; index++) {
      document.querySelector(id).classList.remove(classes[index]);
    }
  }, timeInMs);
}
