//cookie function
const setCookie = (name, value, days = 7, path = '/') => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
}

const getCookie = (name) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}


//selectors
const todoInput = document.querySelector(".todo-input");
const addBtn = document.querySelector(".add-btn");
const todoList = document.querySelector(".todo-list");

//event listeners
document.addEventListener("DOMContentLoaded", getTodos);
addBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", action);

let allData = [];

//functions
function addTodo(event) {
  event.preventDefault();
  const newDiv = document.createElement("div");
  newDiv.classList.add("todo");
  const newLi = document.createElement("li");
  newLi.innerText = todoInput.value;
  newDiv.appendChild(newLi);

  //create edit button
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit");
  editBtn.innerText = "Edit";
  newDiv.appendChild(editBtn);

  //create check button
  const checkBtn = document.createElement("button");
  checkBtn.classList.add("check");
  checkBtn.innerText = "Done";
  newDiv.appendChild(checkBtn);
  //create delete button

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  deleteBtn.innerText = "Delete";
  newDiv.appendChild(deleteBtn);

  //appent new div
  todoList.appendChild(newDiv);

  //local storage
  if (getCookie("storage") === "") {
    allData = [];
  } else {
    allData = JSON.parse(getCookie("storage"));
  }
  const data = { text: todoInput.value, check: 0 };
  allData.push(data);
  // localStorage.setItem("storage", JSON.stringify(allData));
  setCookie("storage", JSON.stringify(allData))

  //clear input
  todoInput.value = "";

  // console.log(localStorage.getItem("storage"));
}

function action(e) {
  const item = e.target;
  //edit action
  if (item.classList[0] === "edit") {
    const todo = item.parentElement;
    todo.classList.add("edited");
    todoInput.value = todo.children[0].innerText;

   //remove from cookie
   if (getCookie("storage") === "") {
    allData = [];
  } else {
    allData = JSON.parse(getCookie("storage"));
  }
  const index = allData.findIndex(
    (allData) => allData.text === todo.children[0].innerText
  );

  if (index > -1) {
    allData.splice(index,1)
  }
 
  setCookie("storage")
  setCookie("storage", JSON.stringify(allData))
    //then
    todo.addEventListener("transitionend", (e) => {
      todo.remove();
    });
  }
  //delete action
  if (item.classList[0] === "delete") {
    const todo = item.parentElement;
    todo.classList.add("deleted");

    //remove from cookie
    if (getCookie("storage") === "") {
      allData = [];
    } else {
      allData = JSON.parse(getCookie("storage"));
    }
    const index = allData.findIndex(
      (allData) => allData.text === todo.children[0].innerText
    );

    if (index > -1) {
      allData.splice(index,1)
    }
   
    setCookie("storage")
    setCookie("storage", JSON.stringify(allData))
    //then
    todo.addEventListener("transitionend", (e) => {
      todo.remove();
    });
  }
  //checked action
  if (item.classList[0] === "check") {
    const todo = item.parentElement;

    if (getCookie("storage") === "") {
      allData = [];
    } else {
      allData = JSON.parse(getCookie("storage"));
    }

    if (todo.classList.contains("completed")) {
      todo.classList.remove("completed");
      const index = allData.findIndex(
        (allData) => allData.text === todo.children[0].innerText
      );

      if (index > -1) {
        allData[index].check = 0;
      }
      setCookie("storage")
      setCookie("storage", JSON.stringify(allData))
    } else {
      todo.classList.add("completed");
      const index = allData.findIndex(
        (allData) => allData.text === todo.children[0].innerText
      );

      if (index > -1) {
        allData[index].check = 1;
      }

      setCookie("storage")
      setCookie("storage", JSON.stringify(allData))
    }
  }
}


//get from local storage
function getTodos() {
  console.log(getCookie("storage"))
  let todos;
  if (getCookie("storage") === "") {
    todos = [];
  } else {
    todos =JSON.parse(getCookie("storage"));
  }
  todos.forEach(function(todo) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("todo");
    const newLi = document.createElement("li");
    newLi.innerText = todo.text;
    newDiv.appendChild(newLi);

    //create edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.innerText = "Edit";
    newDiv.appendChild(editBtn);
    //create check button
    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check");
    checkBtn.innerText = "Done";
    newDiv.appendChild(checkBtn);
    //create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerText = "Delete";
    newDiv.appendChild(deleteBtn);

    if(todo.check == 1){
      newDiv.classList.add("completed");
    }

    //appent new div
    todoList.appendChild(newDiv);
  });
}
