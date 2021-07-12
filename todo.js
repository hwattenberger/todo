const highDiv = document.querySelector('#div-high');
const mediumDiv = document.querySelector('#div-medium');
const lowDiv = document.querySelector('#div-low');

const todoArray = [{
    task: "Walk Dog",
    priority: "high"    
}, {
    task: "Feed Nori",
    priority: "high"    
}, {
    task: "Learn all of Javascript",
    priority: "low"    
}, {
    task: "Sleep",
    priority: "high"    
}, {
    task: "Shower",
    priority: "low"    
}];

for (let newTodo of todoArray) {
    createTodo(newTodo);
}

function createTodo(newTodo) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('todo-item');
    const newInput = document.createElement('input');
    newInput.type="text";
    newInput.value=newTodo.task;
    newInput.readOnly=true;
    newDiv.appendChild(newInput);
    let updateDiv=""

    switch(newTodo.priority) {
        case 'high':
            updateDiv = highDiv;
            break;
        case 'medium':
            updateDiv = mediumDiv;
            break;
        case 'low':
            updateDiv = lowDiv;
            break;
        default:
            console.log("UH OH");
    }
    updateDiv.appendChild(newDiv);
    todoListeners(newDiv);
    todoInputListener(newInput);
}

const todoItems = document.querySelectorAll('.todo-item');
const todoHeaders = document.querySelectorAll('.todo-header');
const todoInputs = document.querySelectorAll('.todo-item input');

const addButton = document.querySelector('button');
const addInput = document.querySelector('#newTodo');

todoItems.forEach(todo => todoListeners(todo));

todoHeaders.forEach(todoHeader => todoHeaderListener(todoHeader));

todoInputs.forEach(todoInput => todoInputListener(todoInput));

function todoListeners(todo) {
    todo.draggable = "true"
    todo.addEventListener('dragstart', onDragStart);
    todo.addEventListener('drop', onDrop);
    todo.addEventListener('dragenter', dragEnter);
    todo.addEventListener('dragleave', dragLeave);
    todo.addEventListener('dragover', allowDrop);
    todo.addEventListener('dragend', dragEnd);
}

function todoHeaderListener(todoHeader) {
    todoHeader.addEventListener('drop', onDropHeader);
    todoHeader.addEventListener('dragenter', dragEnter);
    todoHeader.addEventListener('dragleave', dragLeave);
    todoHeader.addEventListener('dragover', allowDrop);
    todoHeader.addEventListener('dragend', dragEnd);
}

function todoInputListener(todoInput) {
    todoInput.addEventListener('dblclick', todoItemDblClick);
}

addButton.addEventListener('click', createNewTodo);

addInput.addEventListener('keyup', e => {
    if (e.keyCode === 13) {   //enter
        createNewTodo();
    }
})

function createNewTodo() {
    const newTodo = {
        task: addInput.value,
        priority: "high"
    }
    todoArray.push(newTodo)
    createTodo(newTodo);
    addInput.value = "";
}

document.addEventListener('click', e => {
    const editingInput = document.querySelector('.editInput')
    if (!editingInput) return; //Nothing that is currently being edited
    if (editingInput !== e.target) {
        editingInput.classList.remove('editInput');
        editingInput.readOnly = true;
    }
})

function onDragStart(e) {
    this.style.opacity = '.4';
    dragSrcEl = e.currentTarget;
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function onDrop(e) {
    let target = e.target;
    if (target.readonly=true) { //This is bad, should find a better way
        target = target.parentNode
    }
    e.preventDefault();
    if (dragSrcEl !== target) {
        dragSrcEl.parentNode.removeChild(dragSrcEl);
        target.insertAdjacentElement('beforeBegin', dragSrcEl);
    }
    target.classList.remove('drop');
}

function onDropHeader(e) {
    e.preventDefault();
    dragSrcEl.parentNode.removeChild(dragSrcEl);
    e.target.parentNode.appendChild(dragSrcEl);
    e.target.classList.remove('drop');
}


function dragEnter(e) {
    e.currentTarget.classList.add('drop');
}

function dragLeave(e) {
    e.currentTarget.classList.remove('drop');
}

function allowDrop(e) {
    e.preventDefault();
}

function dragEnd(e) {
    dragSrcEl.style.opacity = "";
}

function todoItemDblClick(e) {
    e.currentTarget.readOnly = false;
    e.currentTarget.classList.add('editInput')
}