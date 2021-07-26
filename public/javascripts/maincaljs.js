
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
    console.log("Todos", todos)
    for (let newTodo of todos) {
        if (newTodo.dueDate) {
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

    axios.get(`/todo/${info.event._def.publicId}`)
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
    // console.log("hi", info)
    info.draggedEl.parentNode.removeChild(info.draggedEl);
    // console.log(info);

    axios.put(`/edit/${info.draggedEl.id}?dueDate=${info.date}`)
    .then( res => {
        console.log("Success", res)})
    .catch( err => {
        console.log("Error", err)})
}

function changeDate(info) {
    // console.log("Changing date", info)
    // console.log("Start", info.event._instance.range.start)

    axios.put(`/edit/${info.event._def.publicId}?dueDate=${info.event._instance.range.start}`)
    .then( res => {
        console.log("Success", res)})
    .catch( err => {
        console.log("Error", err)})
}