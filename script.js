 //var
 let todoList = document.querySelector('#todo_list');
 let todoInput = document.querySelector('#in_todoName');
 let addButton = document.querySelector('#b_addTodo');

 let text = todoInput.value;

 //Event Listener
 addButton.addEventListener('click', addTodo);

//Event Listener delete function 
todoList.addEventListener('click', function(e) {
    if (e.target.classList.contains('b_delete')) {
        e.target.parentElement.remove();
    }

    //change function
    if (e.target.classList.contains('b_change')) {
        text=prompt("Ok, change it!");
        if (text.trim() !== ''){
        e.target.parentElement.innerHTML = `
    <span>${text}</span>
    <button class="b_delete">delete</button>
    <button class="b_change">change</button>`;
        }
    }
});

 //Function
 //Add to do
 function addTodo() {
    text = todoInput.value;
    if (text.trim() !== '') { //No empty todo allowed, trimed string
        generateHTML();
        todoInput.value = '';
    }
 }

 //Generate HTML
 function generateHTML() {
    todoList.innerHTML += `<li>
    <span>${text}</span>
    <button class="b_delete">delete</button>
    <button class="b_change">change</button>
</li>`
 }

