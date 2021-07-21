const highDiv = document.querySelector('#div-high');
const mediumDiv = document.querySelector('#div-medium');
const lowDiv = document.querySelector('#div-low');
const copyDetail = document.querySelector('#todo-detail-div');
const editDetails = document.querySelector('#editTodo');

const dueDate = document.querySelector("#dueDate");
const notes = document.querySelector("#notes");

const editTodoSpan = document.querySelector("#editTodo");
const saveTodoSpan = document.querySelector("#saveTodo");
const deleteTodoSpan = document.querySelector("#deleteTodo");

const showCompleted = document.querySelector("#showCompleted");

const todoItems = document.querySelectorAll('.todo-item');
const todoHeaders = document.querySelectorAll('.todo-header');
const todoInputs = document.querySelectorAll('.todo-item input');
const todoEdits = document.querySelectorAll('.todo-edit');
const todoSaves = document.querySelectorAll('.todo-save');
const todoCompletes = document.querySelectorAll('.completeSpan');

const addButton = document.querySelector('button');
const addInput = document.querySelector('#newTodo');

fillList();

function fillList() {
    for (let newTodo of todos) {
        const newTodoDiv = document.getElementById(newTodo._id);

        let updateDiv = "";
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
                updateDiv = lowDiv;
        }

        updateDiv.appendChild(newTodoDiv);

        //By default hide completed todos
        if (newTodo.status === "Complete") {
            newTodoDiv.classList.add('notvisible');
        }

        const dueDateInput = document.getElementById(`${newTodo._id}-dueDate`);
        const storedDate = new Date(newTodo.dueDate);
        
        const formattedDate = `${storedDate.getUTCFullYear().toString()}-${(storedDate.getUTCMonth() + 1).toString().padStart(2,0)}-${storedDate.getUTCDate().toString().padStart(2,0)}`
        dueDateInput.value = formattedDate;
    }
}


// function fillList() {
//     for (let newTodo of todos) {
//         createTodo(newTodo);
//     }
// }


// function createTodoss(newTodo) {
//     const todoItem = document.createElement('div');
//     todoItem.classList.add('todo-item');
//     const todoItemHeader = document.createElement('div');
//     todoItemHeader.classList.add('todo-item-header');
//     const newInput = document.createElement('input');
//     newInput.type="text";
//     newInput.value=`${newTodo.task}`; 
//     newInput.readOnly=true;
//     const completeTodo = document.createElement('div');
//     if (newTodo.status === "Complete") {
//         completeTodo.innerHTML = '<span title="Uncomplete" class="completeSpan"><i class="fas fa-times"></span></i>';
//     } else {
//         completeTodo.innerHTML = '<span title="Complete" class="completeSpan"><i class="fas fa-check"></span></i>';
//     }

//     todoItem.appendChild(todoItemHeader);
//     todoItemHeader.appendChild(newInput);
//     todoItemHeader.appendChild(completeTodo);
//     let updateDiv=""

//     switch(newTodo.priority) {
//         case 'high':
//             updateDiv = highDiv;
//             break;
//         case 'medium':
//             updateDiv = mediumDiv;
//             break;
//         case 'low':
//             updateDiv = lowDiv;
//             break;
//         default:
//             updateDiv = lowDiv;
//     }
//     todoItem.id = newTodo._id;
    
//     updateDiv.appendChild(todoItem);
//     todoListeners(todoItem);
//     todoInputListener(newInput);
//     completeTodo.addEventListener('click', markTodo);
// }

todoEdits.forEach(editSpan => {
    editSpan.addEventListener('click', editTodoEvent);
})

todoSaves.forEach(saveSpan => {
    saveSpan.addEventListener('click', saveEdits);
})

todoCompletes.forEach(completeSpan => {
    completeSpan.addEventListener('click', markTodo);
})

// editDetails.addEventListener('click', editTodo);

todoHeaders.forEach(todoHeader => todoHeaderListener(todoHeader));

// saveTodoSpan.addEventListener('click', saveEdits);

function editTodoEvent(e) {
    const editSpan = e.currentTarget;
    const todoItem = editSpan.closest(".todo-item");
    editTodo(todoItem);
}

function editTodo(todoItem) {
    const id = todoItem.id;
    const dueDateInput = document.getElementById(`${id}-dueDate`);
    const notesInput = document.getElementById(`${id}-notes`);
    const taskInput = document.getElementById(`${id}-task`);
    const saveSpan = document.getElementById(`${id}-saveTodo`);
    const editSpan = document.getElementById(`${id}-editTodo`);

    dueDateInput.readOnly = false;
    notesInput.readOnly = false;
    taskInput.readOnly = false;

    taskInput.parentElement.classList.add('fieldEditable');
    dueDateInput.classList.add('fieldEditable');
    notesInput.classList.add('fieldEditable');

    saveSpan.classList.remove("notvisible");
    editSpan.classList.add("notvisible");
}

function stopEditTodo(todoItem) {
    const id = todoItem.id;
    const dueDateInput = document.getElementById(`${id}-dueDate`);
    const notesInput = document.getElementById(`${id}-notes`);
    const taskInput = document.getElementById(`${id}-task`);
    const saveSpan = document.getElementById(`${id}-saveTodo`);
    const editSpan = document.getElementById(`${id}-editTodo`);

    dueDateInput.readOnly = true;
    notesInput.readOnly = true;
    taskInput.readOnly = true;

    taskInput.parentElement.classList.remove('fieldEditable');
    dueDateInput.classList.remove('fieldEditable');
    notesInput.classList.remove('fieldEditable');

    saveSpan.classList.add("notvisible");
    editSpan.classList.remove("notvisible");
}


// Add event listeners to todo div, todo input, and todo header
todoItems.forEach(todo => todoListeners(todo));

todoHeaders.forEach(todoHeader => todoHeaderListener(todoHeader));

todoInputs.forEach(todoInput => todoInputListener(todoInput));

function todoListeners(todo) {
    todo.draggable = "true"
    todo.addEventListener('dragstart', onDragStart);
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
    todoInput.addEventListener('click', todoItemClick);
}

function markTodo(e) {
    const todoItem = e.currentTarget.closest(".todo-item")
    const updateSpan = todoItem.querySelector('.completeSpan')

    let putString = "";
    
    if (updateSpan.title === "Complete") {
        //Marking Complete
        putString=`/edit/${todoItem.id}?status=Complete`;
        updateSpan.title="Uncomplete"
        updateSpan.innerHTML = `<i class="fas fa-times"></i>`
        if (!showCompleted.checked) {
            todoItem.classList.add('notvisible');
        }
    }  else {
        //Marking New
        putString=`/edit/${todoItem.id}?status=New`;
        updateSpan.title="Complete"
        updateSpan.innerHTML = `<i class="fas fa-check"></i>`
    }

    console.log("Mark Todo", putString)

    axios.put(putString)
        .then( res => {
            console.log("Success", res)})
        .catch( err => {
            console.log("Error", err)})
}

function saveEdits(e) {
    const todoItem = e.currentTarget.closest(".todo-item")
    const todoTask = todoItem.querySelector(".todo-item-header input")

    const notes = todoItem.querySelector(".notesInput")
    const dueDate = todoItem.querySelector(".dueDateInput")

    const dateDue = new Date(dueDate.value);

    axios.put(`/edit/${todoItem.id}?dueDate=${dateDue}&notes=${notes.value}&q=${todoTask.value}`)
        .then( res => {
            console.log("Success", res)
            stopEditTodo(todoItem)})
        .catch( err => {
            console.log("Error", err)})
}

// Add functionality to creating new todos
// addButton.addEventListener('click', createNewTodo);

// addInput.addEventListener('keyup', e => {
//     if (e.keyCode === 13) {   //enter
//         createNewTodo();
//     }
// })

// function createNewTodo() {
//     const newTodo = {
//         task: addInput.value,
//         priority: "high",
//         id: todoArray.length
//     }
//     todoArray.push(newTodo)
//     createTodo(newTodo);
//     addInput.value = "";
//     console.log(todoArray);
// }

document.addEventListener('click', e => {
    const editingInput = document.querySelector('.editInput');
    const viewingItem = document.querySelectorAll('.viewingItem');
    
    // console.log("target", e.target)
    // console.log("editing", viewingItem)

    // This section removes attention from the viewingItem class (on a todo-item div)
    viewingItem.forEach(editItem => {
        console.log("here");
        if (!editItem.contains(e.target)){
            // console.log("here");
            stopEditTodo(editItem);
            editItem.classList.remove('viewingItem');

            const todoDetail = editItem.querySelector('.todo-detail');
            todoDetail.classList.add('notvisible');

            // if (!e.target.closest(".todo-item")) {
            //     todoDetail.classList.add('notvisible');
            // }
        }
    })

    //if (!editingInput) return; //Nothing that is currently being edited
    if (editingInput && !editingInput.contains(e.target)) {
        editingInput.classList.remove('editInput');
        editingInput.readOnly = true;
        const newTitle = editingInput.value;
        const todoDiv = editingInput.parentElement;
        const config = {
            task: newTitle,
            priority: "high"
        }
        axios.put(`/edit/${todoDiv.id}?q=${newTitle}`)
        .then( res => {
            console.log("Success", res)})
        .catch( err => {
            console.log("Error", err)})
    }
})

//
showCompleted.addEventListener('click', toggleCompleted)

function toggleCompleted(e) {
    const completeSpans = document.querySelectorAll(".completeSpan");

    if(e.target.checked===true) {
        //Show completed 
        completeSpans.forEach(completeSpan => {
           const todoItem = completeSpan.closest(".todo-item");
            todoItem.classList.remove('notvisible'); 
        })
    } else {
        //Only show non-completed
        completeSpans.forEach(completeSpan => {
            if (completeSpan.title !== "Complete") {
                const todoItem = completeSpan.closest(".todo-item");
                todoItem.classList.add('notvisible'); 
            }
        })
    }
}

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
    let priority="";

    if (dropTargetParentId === "div-high") priority = "high";
    else if (dropTargetParentId === "div-medium") priority = "medium";
    else priority = "low";

    //const newTitle = editingInput.value;
    //const todoDiv = editingInput.parentElement;
    //console.log("Here", e.target)

    axios.put(`/edit/${dragSrcEl.id}?priority=${priority}`)
    .then( res => {
        console.log("Success", res)})
    .catch( err => {
        console.log("Error", err)})

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
    const todoItem = e.target.closest(".todo-item");
    editTodo(todoItem);
}

// Clicking a specific todo (shows detail)
function todoItemClick(e) {
    const todoItem = e.currentTarget.closest(".todo-item");
    const todoDetail = todoItem.querySelector(".todo-detail");

    todoDetail.classList.remove("notvisible");
    todoItem.classList.add('viewingItem');
}


function todoItemClicky(e) {
    const dueDate = document.querySelector('#dueDate');
    const notes = document.querySelector('#notes');
    // const todoDetailDiv = e.currentTarget.parentElement;
    const todoDetailDiv = e.currentTarget.closest(".todo-item");

    // const deleteTodo = document.querySelector('#deleteTodo');

    todoDetailDiv.appendChild(copyDetail);
    const editDivId = todoDetailDiv.id;
    
    copyDetail.classList.remove('notvisible');
    todoDetailDiv.classList.add('viewingItem');
    console.log("DIV HERE", todoDetailDiv);

    axios.get(`/${editDivId}`)
    .then( res => {
        const storedDate = new Date(res.data.dueDate);
        const formattedDate = `${storedDate.getFullYear().toString()}-${(storedDate.getMonth() + 1).toString().padStart(2,0)}-${storedDate.getDate().toString().padStart(2,0)}`
        dueDate.value = formattedDate,
        notes.value = res.data.notes

        const saveTodo = document.querySelector('#saveTodo');
        const deleteTodoForm = document.querySelector('#formDelete');
        const completeTodo = document.querySelector('#completeTodo');

        saveTodo.href = `/${editDivId}/save`;
        deleteTodoForm.action = `/${editDivId}?_method=DELETE`
        console.log("delete todo", deleteTodoForm);
        // completeTodo.href = `/edit/${editDivId}`;
    })
    .catch( err => {
        console.log("Error", err)})

}

//Sorting

const sortButton = document.querySelector('#sortBtn');

sortButton.addEventListener('click', e => {
    
    todoArray.sort(sort_alpha);
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