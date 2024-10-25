"use strict"
let todoList = []; //declares a new array for Your todo list

// let initList = function() {
//     let savedList = window.localStorage.getItem("todos");
//     if (savedList != null)
//         todoList = JSON.parse(savedList);
//     else
// //code creating a default list with 2 items
//     todoList.push(
//     {
//         title: "Learn JS",
//         description: "Create a demo application for my TODO's",
//         place: "445",
//         category: '',
//         dueDate: new Date(2024,10,16)
//     },
//     {
//         title: "Lecture test",
//         description: "Quick test from the first three lectures",
//         place: "F6",
//         category: '',
//         dueDate: new Date(2024,10,17)
//     }
//         // of course the lecture test mentioned above will not take place
//     );
// }

let updateJSONbin = function(todoObj) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        todoList.push(req.responseText);
    }
    };
    console.log(todoObj);
    req.open("PUT", `https://api.jsonbin.io/v3/b/${config.BINID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", config.XMasterKey);
    todoList.push(todoObj);
    req.send(JSON.stringify(todoList));//fix this
}

let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        todoList.push(req.responseText);
        //console.log(req.responseText);
    }
};

req.open("GET", `https://api.jsonbin.io/v3/b/${config.BINID}/latest`, true);
req.setRequestHeader("X-Master-Key", config.XMasterKey);
req.send();

//initList();

let updateTodoList = function() {
    let todoListDiv =
    document.getElementById("todoListView");

    //remove all elements
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

//add all elements
let filterInput = document.getElementById("inputSearch");   
for (let todo in todoList) {
  if (
    (filterInput.value == "") ||
    (todoList[todo].title.includes(filterInput.value)) ||
    (todoList[todo].description.includes(filterInput.value))
  ) {
    let newElement = document.createElement("p");
    let newContent = document.createTextNode(todoList[todo].title + " " +
                                             todoList[todo].description);
    newElement.appendChild(newContent);
    todoListDiv.appendChild(newElement);
  }
}

    let newDeleteButton = document.createElement("input");
        newDeleteButton.type = "button";
        newDeleteButton.value = "x";
        newDeleteButton.addEventListener("click",
            function() {
                deleteTodo(todo);
            });
}

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
    //get the elements in the form
      let inputTitle = document.getElementById("inputTitle");
      let inputDescription = document.getElementById("inputDescription");
      let inputPlace = document.getElementById("inputPlace");
      let inputDate = document.getElementById("inputDate");
    //get the values from the form
      let newTitle = inputTitle.value;
      let newDescription = inputDescription.value;
      let newPlace = inputPlace.value;
      let newDate = new Date(inputDate.value);
    //create new item
      let newTodo = {
          title: newTitle,
          description: newDescription,
          place: newPlace,
          category: '',
          dueDate: newDate.toUTCString()
      };
      
    //add item to the list
      updateJSONbin(newTodo);
      window.localStorage.setItem("todos", JSON.stringify(todoList));
  }