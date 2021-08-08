
const Calendar = FullCalendar.Calendar;
const Draggable = FullCalendar.Draggable;
  
const containerEl = document.getElementById('datelessTasks');
const calendarEl = document.getElementById('calendar');
  
// initialize the external events
// -----------------------------------------------------------------
  
new Draggable(containerEl, {
    itemSelector: '.todo-item',
    eventData: function(eventEl) {
        const todoHeader = document.getElementById(`${eventEl.id}-task`)
        return {
            title: todoHeader.value,
            id: eventEl.id
        }
    }
});

// initialize the calendar
// -----------------------------------------------------------------
  
const calendar = new Calendar(calendarEl, {
    timeZone: 'UTC',
    headerToolbar: {
        left: 'title',
        center: '',
        right: 'prev,next today'
    },
    editable: true,
    droppable: true, // this allows things to be dropped onto the calendar
    drop: dropEvent,
    eventDrop: changeDate,
    eventMouseEnter: hoverAdd,
    eventMouseLeave: hoverRemove
    // drop: function(info) {
    //     info.draggedEl.parentNode.removeChild(info.draggedEl);
    // }
});

calendar.render();
initialTodoSetup();

function initialTodoSetup() {
    for (let newTodo of user.todos) {
        if (newTodo.dueDate && newTodo.status !== "Complete") {
            const newEvent = {
                id: newTodo._id,
                title: newTodo.task,
                start: newTodo.dueDate,
                allDay: true
            }
            // console.log("New todo", newTodo.task, newTodo.dueDate)
            calendar.addEvent(newEvent)
            const todoDiv = document.getElementById(newTodo._id);
            todoDiv.remove();
        }
    }
}

function hoverAdd(info) {
    // console.log("Hovering", info);
    const newDiv = document.createElement('div');

    axios.get(`/todoList/${user._id}/todo/${info.event._def.publicId}`)
    .then( res => {
        console.log("Success", res)
        newDiv.innerHTML = `<h4>Title:</h4>${res.data.task}<h4>Notes:</h4>${res.data.notes}`;
    })
    .catch( err => {
        console.log("Error", err)})

    // newSpan.innerHTML = "Hi";
    newDiv.classList.add('spanDetail');
    info.el.appendChild(newDiv);
}

function hoverRemove(info) {
    const hoverSpan = document.querySelectorAll('.spanDetail');
    hoverSpan.forEach(hover => {
        hover.remove();
    })
}

function dropEvent(info) {
    axios.get(`/todoList/${user._id}/todo/checkOwner/${info.draggedEl.id}`)
    .then( res => {
        console.log("Success2", res);
    })
    .catch( err => {
        console.log("Error2", err);
        if (err.response.status === 302) {
            window.location.href = window.location.href; 
        }
        throw "Error";
    })
    // console.log("hi", info)
    info.draggedEl.parentNode.removeChild(info.draggedEl);
    // console.log(info);

    axios.put(`/todoList/${user._id}/todo/${info.draggedEl.id}?dueDate=${info.date}`)
    .then( res => {
        console.log("Success", res)})
    .catch( err => {
        console.log("Error", err)})
}

function changeDate(info) {
    axios.get(`/todoList/${user._id}/todo/checkOwner/${info.event._def.publicId}`)
    .then( res => {
        console.log("Success", res);
    })
    .catch( err => {
        console.log("Error", err);
        if (err.response.status === 302) {
            window.location.href = window.location.href; 
        }
        throw "Error";
    })

    axios.put(`/todoList/${user._id}/todo/${info.event._def.publicId}?dueDate=${info.event._instance.range.start}`)
    .then( res => {
        console.log("Success", res)})
    .catch( err => {
        console.log("Error", err)})
}
