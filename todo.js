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
    console.log(newTodo.task)
}

const todoItems = document.querySelectorAll('.todo-item');
const todoHeaders = document.querySelectorAll('.todo-header');
const todoInputs = document.querySelectorAll('.todo-item input');

const addButton = document.querySelector('button');

todoItems.forEach(todo => {
    todo.draggable = "true"
    todo.addEventListener('dragstart', onDragStart);
    todo.addEventListener('drop', onDrop);
    todo.addEventListener('dragenter', dragEnter);
    todo.addEventListener('dragleave', dragLeave);
    todo.addEventListener('dragover', allowDrop);
    todo.addEventListener('dragend', dragEnd);
    //todo.addEventListener('dblclick', todoItemDblClick);
})

todoHeaders.forEach(todoHeader => {
    todoHeader.addEventListener('drop', onDropHeader);
    todoHeader.addEventListener('dragenter', dragEnter);
    todoHeader.addEventListener('dragleave', dragLeave);
    todoHeader.addEventListener('dragover', allowDrop);
    todoHeader.addEventListener('dragend', dragEnd);
})

todoInputs.forEach(todoInput => {
    todoInput.addEventListener('dblclick', todoItemDblClick);
})

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