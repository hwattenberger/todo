const highDiv = document.querySelector('#div-high');
const mediumDiv = document.querySelector('#div-medium');
const lowDiv = document.querySelector('#div-low');

const todoArray = [{
    task: "Walk Dog",
    priority: "high",
    dueDate: new Date(2021, 9, 1),
    status: "new",  //new, in-progress, complete
    notes: "This should be done when it's light outside",
    id: 0
}, {
    task: "Feed Nori",
    priority: "high",
    dueDate: new Date(2021, 8, 17),
    id: 1
}, {
    task: "Learn all of Javascript",
    priority: "low",
    dueDate: new Date(2021, 12, 1),
    id: 2
}, {
    task: "Sleep",
    priority: "high",
    dueDate: new Date(2021, 8, 1),
    id: 3
}, {
    task: "Shower",
    priority: "low",
    dueDate: new Date(2021, 9, 23),
    id: 4
}];

fillList();

function fillList() {
    for (let newTodo of todoArray) {
        createTodo(newTodo);
    }
}


function createTodo(newTodo) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('todo-item');
    const newInput = document.createElement('input');
    newInput.type="text";
    newInput.value=`${newTodo.task} - ${newTodo.dueDate}`;
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
    newDiv.id = newTodo.id;
}

const todoItems = document.querySelectorAll('.todo-item');
const todoHeaders = document.querySelectorAll('.todo-header');
const todoInputs = document.querySelectorAll('.todo-item input');

const addButton = document.querySelector('button');
const addInput = document.querySelector('#newTodo');

// Add event listeners to todo div, todo input, and todo header
todoItems.forEach(todo => todoListeners(todo));

todoHeaders.forEach(todoHeader => todoHeaderListener(todoHeader));

todoInputs.forEach(todoInput => todoInputListener(todoInput));

function todoListeners(todo) {
    todo.draggable = "true"
    todo.addEventListener('dragstart', onDragStart);
    // todo.addEventListener('drop', onDrop);
    // todo.addEventListener('dragenter', dragEnter);
    // todo.addEventListener('dragleave', dragLeave);
    // todo.addEventListener('dragover', allowDrop);
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

// Add functionality to creating new todos
addButton.addEventListener('click', createNewTodo);

addInput.addEventListener('keyup', e => {
    if (e.keyCode === 13) {   //enter
        createNewTodo();
    }
})

function createNewTodo() {
    const newTodo = {
        task: addInput.value,
        priority: "high",
        id: todoArray.length
    }
    todoArray.push(newTodo)
    createTodo(newTodo);
    addInput.value = "";
    console.log(todoArray);
}

document.addEventListener('click', e => {
    const editingInput = document.querySelector('.editInput')
    if (!editingInput) return; //Nothing that is currently being edited
    if (editingInput !== e.target) {
        editingInput.classList.remove('editInput');
        editingInput.readOnly = true;
    }
})

//Functions to support events
function onDragStart(e) {
    this.style.opacity = '.4';
    dragSrcEl = e.currentTarget;
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

// function onDrop(e) {
//     let target = e.target;
//     if (target.readonly=true) { //This is bad, should find a better way
//         target = target.parentNode
//     }
//     e.preventDefault();
//     if (dragSrcEl !== target) {
//         dragSrcEl.parentNode.removeChild(dragSrcEl);
//         target.insertAdjacentElement('beforeBegin', dragSrcEl);
//     }
//     target.classList.remove('drop');
//     todoArray[target.id].priority = "high";
//     console.log(todoArray);
// }

function onDropHeader(e) {
    e.preventDefault();
    dragSrcEl.parentNode.removeChild(dragSrcEl);
    e.target.parentNode.appendChild(dragSrcEl);
    e.target.classList.remove('drop');

    const dropTargetParentId = e.target.parentNode.id;

    if (dropTargetParentId === "div-high") todoArray[dragSrcEl.id].priority = "high";
    else if (dropTargetParentId === "div-medium") todoArray[dragSrcEl.id].priority = "medium";
    else todoArray[dragSrcEl.id].priority = "low";

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

//Sorting

const sortButton = document.querySelector('#sortBtn');

sortButton.addEventListener('click', e => {
    // const todoDivs = document.querySelectorAll('.todo-div');

    // for (let todoDiv of todoDivs) {
    //     const todoDivId = todoDiv.id;
    //     const todoItems = document.querySelectorAll(`#${todoDivId} .todo-item`)
    //     //console.log("hi", todoDivId, todoItems)
    //     // for (let todoItem of todoItems) {
    //     //     console.log(todoItem.id)
    //     // }
    //     const todoItems2 = todoItems.sort();
    //     console.log("1: ", todoItems)
    //     console.log("2: ", todoItems2)
    // }
    //const todoItems = document.querySelectorAll('.todo-item');


    // todoArray.sort(sort_date);
    todoArray.sort(sort_alpha);
    //console.log(todoArray)
    clearHeaders();
    fillList();
})

//The more recent, the farther up in order
function sort_date(a, b) {
    if(a.dueDate < b.dueDate) return -1;
    else if (a.dueDate > b.dueDate) return 1;
    else return 0;
}

//Sort alphabetically caps and not caps count the same
function sort_alpha(a, b) {
    const aa = a.task.toUpperCase();
    const bb = b.task.toUpperCase();
    if(aa < bb) return -1;
    else if (aa > bb) return 1;
    else return 0;
}

function clearHeaders() {
    const todoItemsUpdated = document.querySelectorAll('.todo-item');

    todoItemsUpdated.forEach(todoItem => {
        todoItem.remove();
    })
}