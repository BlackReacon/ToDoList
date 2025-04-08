 //var
 let todoList = document.querySelector('#todo_list');
 let todoInput = document.querySelector('#in_todoName');
 let addButton = document.querySelector('#b_addTodo');

 let text = todoInput.value;

 //Event Listener
 addButton.addEventListener('click', addTodo);

 //Function
 //Add to do
 function addTodo() {
    text = todoInput.value;
    generateHTML();
    todoInput.value = '';
 }

 //Generate HTML
 function generateHTML() {
    todoList.innerHTML += `<li>
    <span>${text}</span>
    <button class="b_delete">delete</button>
</li>`
 }