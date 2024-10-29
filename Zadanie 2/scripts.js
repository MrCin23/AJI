"use strict"
let todoList = [];

let categorizeTask = function(title, description, callback) {
    let req = new XMLHttpRequest();
    let prompt = `Based on the title and description of a task, categorize it as one of the following categories: "university", "private", "work", "shopping". Task title: ${title}. Task description: ${description}. Return only the category name.`;
    
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            let response = JSON.parse(req.responseText);
            callback(response.result);
        }
    };
    
    req.open("POST", "https://api.groq.com/google/v1/chat/completions", true); 
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", `Bearer ${config.GROQ_API_KEY}`);
    req.send({
         "messages": [
           {
             "role": "user",
             "content": ""
           }
         ],
         "model": "llama3-8b-8192",
         "temperature": 1,
         "max_tokens": 1024,
         "top_p": 1,
         "stream": true,
         "stop": null
       });
    req.send(JSON.stringify({ prompt: prompt }));
};



// Załaduj listę `todoList` z serwera
let loadTodoList = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            // Parse JSON response and assign to `todoList`
            todoList = JSON.parse(req.responseText).record || [];
            updateTodoList();
        }
    };
    req.open("GET", `https://api.jsonbin.io/v3/b/${config.BINID}/latest`, true);
    req.setRequestHeader("X-Master-Key", config.XMasterKey);
    req.send();
};



// Wyślij zaktualizowaną listę `todoList` na serwer
let updateJSONbin = function() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE && req.status == 200) {
            console.log("List updated in JSONbin");
        }
    };
    req.open("PUT", `https://api.jsonbin.io/v3/b/${config.BINID}`, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", config.XMasterKey);
    req.send(JSON.stringify(todoList));
};

// Aktualizuj widok listy z `todoList`
let updateTodoList = function() {
  let todoListDiv = document.getElementById("todoListView");

  // Usuń istniejącą tabelę, jeśli istnieje
  let existingTable = document.getElementById("myTable");
  if (existingTable) {
      existingTable.remove();
  }

  // Utwórz nową tabelę z nagłówkami
  let tab = document.createElement("TABLE");
  tab.setAttribute("id", "myTable");
  tab.className = "table table-bordered";

  // Utwórz wiersz nagłówkowy
  let headerRow = document.createElement("TR");
  ["Title", "Description", "Place", "Due Date", "Actions"].forEach(headerText => {
      let headerCell = document.createElement("TH");
      headerCell.textContent = headerText;
      headerRow.appendChild(headerCell);
  });
  tab.appendChild(headerRow);

  // Wypełnij tabelę danymi z `todoList`
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

            // Dodaj komórkę dla tytułu
            let titleCell = document.createElement("TD");
            titleCell.textContent = todo.title;
            newRow.appendChild(titleCell);

            // Dodaj komórkę dla opisu
            let descCell = document.createElement("TD");
            descCell.textContent = todo.description;
            newRow.appendChild(descCell);

            // Dodaj komórkę dla miejsca
            let placeCell = document.createElement("TD");
            placeCell.textContent = todo.place;
            newRow.appendChild(placeCell);

            // Dodaj komórkę dla terminu
            let dueDateCell = document.createElement("TD");
            dueDateCell.textContent = todo.dueDate;
            newRow.appendChild(dueDateCell);

            // Dodaj komórkę dla akcji (przycisk usuwania)
            let actionCell = document.createElement("TD");
            let deleteButton = document.createElement("input");
            deleteButton.type = "button";
            deleteButton.value = "Delete";
            deleteButton.className = "btn btn-xs btn-danger";
            deleteButton.addEventListener("click", () => deleteTodo(index));

            actionCell.appendChild(deleteButton);
            newRow.appendChild(actionCell);

            // Dodaj wiersz do tabeli
            tab.appendChild(newRow);
        }
    });

  // Dodaj tabelę do kontenera `todoListView`
  todoListDiv.appendChild(tab);
};



setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index, 1);
    updateJSONbin();
};

let addTodo = function() {
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");

    categorizeTask(inputTitle.value, inputDescription.value, function(category) {
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
    });
};

// Załaduj listę przy starcie aplikacji
loadTodoList();


import Groq from "groq-sdk";

const groq = new Groq({
    dangerouslyAllowBrowser: true,
    apiKey: config.GROQ_API_KEY
});

export async function fetchCategoryFromGroq(todoTitle, todoDescription) {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Na podstawie tytułu zadania: '${todoTitle}' i opisu: '${todoDescription}', jaką kategorię byś przypisał? Wybierz między Prywatne a Uniwersytet i odpowiedz tylko jednym słowem: Prywatne albo Uniwersytet.`,
        },
      ],
      model: "llama3-8b-8192",
    });
  
    const categoryResponse = chatCompletion.choices[0]?.message?.content || "Brak kategorii";
    return categoryResponse;
  }

