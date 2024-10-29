"use strict"
let todoList = [];
import Groq from 'groq-sdk';



const groq = new Groq({
    dangerouslyAllowBrowser: true,
    apiKey: config.GROQAPI
});
async function categorizeTask(title, description) {
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
            {
                "role": "system",
                "content": `Based on the title and description of a task, categorize it as one of the following categories: \"university\", \"private\", \"work\", \"other\". Task title: ${title}. Task description: ${description}. Return only the category name.`
            }
        ],
        "model": "llama3-8b-8192",
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
    });

    let result = "";
    for await (const chunk of chatCompletion) {
        result += chunk.choices[0]?.delta?.content || '';
    }
    return result.trim();
}



let loadTodoList = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            // Parse JSON response and assign to `todoList`
            todoList = JSON.parse(req.responseText).record || [];
            updateTodoList();
        }
    };
    req.open("GET", `https://api.jsonbin.io/v3/b/${config.BINID}/latest`, true);
    req.setRequestHeader("X-Master-Key", config.XMasterKey);
    req.send();
};




let updateJSONbin = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            console.log("List updated in JSONbin");
        }
    };
    req.open("PUT", `https://api.jsonbin.io/v3/b/${config.BINID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", config.XMasterKey);
    req.send(JSON.stringify(todoList));
};


let updateTodoList = function() {
    let todoListDiv = document.getElementById("todoListView");


    let existingTable = document.getElementById("myTable");
    if (existingTable) {
        existingTable.remove();
    }


    let tab = document.createElement("TABLE");
    tab.setAttribute("id", "myTable");
    tab.className = "table table-bordered";


    let headerRow = document.createElement("TR");
    ["Title", "Description", "Place", "Category", "Due Date", "Actions"].forEach(headerText => {
        let headerCell = document.createElement("TH");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tab.appendChild(headerRow);


    let filterInput = document.getElementById("inputSearch");
    let filterInputFrom = document.getElementById("inputSearchFrom");
    let filterInputTo = document.getElementById("inputSearchTo");
    function checkDateFrom(todoItem) {
        if(filterInputFrom.value == 0 && filterInputTo.value == 0) return 0 <= Date.parse(todoItem.dueDate) && Date.parse(todoItem.dueDate) <= 8640000000000000;
        if(filterInputFrom.value == 0) return 0 <= Date.parse(todoItem.dueDate) && Date.parse(todoItem.dueDate) <= Date.parse(filterInputTo.value);
        if(filterInputTo.value == 0) return Date.parse(filterInputFrom.value) <= Date.parse(todoItem.dueDate) && Date.parse(todoItem.dueDate) <= 8640000000000000;
        return Date.parse(filterInputFrom.value) <= Date.parse(todoItem.dueDate) && Date.parse(todoItem.dueDate) <= Date.parse(filterInputTo.value);
    }
    let timeFilterResult = todoList.filter(checkDateFrom);
    timeFilterResult.forEach((todo, index) => {
        if (filterInput.value == "" || todo.title.toLowerCase().includes(filterInput.value.toLowerCase()) || todo.description.toLowerCase().includes(filterInput.value.toLowerCase())) {
            let newRow = document.createElement("TR");


            let titleCell = document.createElement("TD");
            titleCell.textContent = todo.title;
            newRow.appendChild(titleCell);


            let descCell = document.createElement("TD");
            descCell.textContent = todo.description;
            newRow.appendChild(descCell);


            let placeCell = document.createElement("TD");
            placeCell.textContent = todo.place;
            newRow.appendChild(placeCell);


            let cateCell = document.createElement("TD");
            cateCell.textContent = todo.category;
            newRow.appendChild(cateCell);


            let dueDateCell = document.createElement("TD");
            dueDateCell.textContent = todo.dueDate;
            newRow.appendChild(dueDateCell);


            let actionCell = document.createElement("TD");
            let deleteButton = document.createElement("input");
            deleteButton.type = "button";
            deleteButton.value = "Delete";
            deleteButton.className = "btn btn-xs btn-danger";
            deleteButton.addEventListener("click", () => deleteTodo(index));

            actionCell.appendChild(deleteButton);
            newRow.appendChild(actionCell);


            tab.appendChild(newRow);
        }
    });


    todoListDiv.appendChild(tab);
};



setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index, 1);
    updateJSONbin();
};

window.addTodo = async function () {
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");

    try {
        let category = await categorizeTask(inputTitle.value, inputDescription.value);
        console.log("Category:", category);  // Log to check if it's correctly retrieved

        let newTodo = {
            title: inputTitle.value,
            description: inputDescription.value,
            place: inputPlace.value,
            category: category,
            dueDate: new Date(inputDate.value).toUTCString()
        };

        todoList.push(newTodo);
        updateJSONbin();
        window.localStorage.setItem("todos", JSON.stringify(todoList));
    } catch (error) {
        console.error("Error adding TODO:", error);
    }
};

loadTodoList();