let cardsContainer = document.querySelector(".grid");
let toggleStageButtons = document.querySelectorAll("a.toggle-btn");
let activeFilter = document.querySelector(".btn-active");
let inActiveFilter = document.querySelector(".btn-inactive");
let all = document.querySelector(".btn-all");
let removeButtons = document.querySelectorAll(".remove");
let originalData = [];

const getData = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    if (Array.isArray(jsonData)) {
      return jsonData;
    } else if (typeof jsonData === "object" && jsonData !== null) {
      return Object.values(jsonData);
    } else {
      console.warn("JSON data is not an array or an object, returning as is.");
      return jsonData;
    }
  } catch (error) {
    console.error("Error loading or parsing JSON:", error);
    return null;
  }
};

const toggleState = (btnCollection) => {
  if (btnCollection.length <= 0 && typeof btnCollection !== "object") return;

  for (let btn of btnCollection) {
    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      let isActive = btn.classList.contains("on") ? true : false;
      if (!isActive) {
        btn.classList.add("on");
      } else {
        btn.classList.remove("on");
      }
    });
  }
};

function updateGridComponent(component, arr) {
  if (!component || !arr) return;

  let innerHtml = "";
  for (let i = 0; i < arr.length; i++) {
    innerHtml += `<div class="grid-item" >
              <div class="card">
                <div class="card-top">
                  <div class="card-img">
                    <img src="${arr[i].logo}" />
                  </div>
                  <div class="card-content">
                    <h2>${arr[i].name}</h2>
                    <p>${arr[i].description}</p>
                  </div>
                </div>
                <div class="card-footer">
                  <a href="#" class="remove" aria-index="${i}">Remove</a>

                  <a href="#" class="toggle-btn ${arr[i].isActive ? "on" : "off"}" ></a>
                </div>
              </div>
            </div>`;
  }
  component.innerHTML = innerHtml;
  cardsContainer = document.querySelector(".grid");
  toggleStageButtons = document.querySelectorAll("a.toggle-btn");
  activeFilter = document.querySelector(".btn-active");
  inActiveFilter = document.querySelector(".btn-inactive");
  all = document.querySelector(".btn-all");
  removeButtons = document.querySelectorAll(".remove");

  toggleState(toggleStageButtons);

  activeFilter.addEventListener("click", function (ev) {
    ev.preventDefault();
    activeListFilter(cardsContainer, originalData);
  });
  all.addEventListener("click", function (ev) {
    ev.preventDefault();
    showAll(cardsContainer, originalData);
  });
  inActiveFilter.addEventListener("click", function (ev) {
    ev.preventDefault();
    inActiveListFilter(cardsContainer, arr);
  });
  removeCard(removeButtons, cardsContainer, arr);
}

const activeListFilter = (refComponent, arr) => {
  if (!refComponent || !arr) return;

  let active_list = arr.filter((element) => element.isActive);
  updateGridComponent(refComponent, active_list);

  getData("/data.json").then((myArray) => {
    if (myArray) {
      toggleStageButtons = document.querySelectorAll("a.toggle-btn");
      removeButtons = document.querySelectorAll(".remove");

      toggleState(toggleStageButtons);

      activeFilter.addEventListener("click", function (ev) {
        ev.preventDefault();
        activeListFilter(cardsContainer, myArray);
      });
      all.addEventListener("click", function (ev) {
        ev.preventDefault();
        showAll(cardsContainer, myArray);
      });
      inActiveFilter.addEventListener("click", function (ev) {
        ev.preventDefault();
        inActiveListFilter(cardsContainer, myArray);
      });
      removeCard(removeButtons, cardsContainer, myArray);
    }
  });
};

const showAll = (refComponent, arr) => {
  if (!refComponent || !arr) return;

  updateGridComponent(refComponent, arr);
};

const inActiveListFilter = (refComponent, arr) => {
  if (!refComponent || !arr) return;

  let active_list = arr.filter((element) => !element.isActive);
  updateGridComponent(refComponent, active_list);
};

const removeCard = (elements, refComponent, arr) => {
  if (!refComponent || !arr) return;

  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function (ev) {
      ev.preventDefault();
      let index = this.getAttribute("aria-index");
      let updateArr = arr.filter((el, ind) => ind != index);
      updateGridComponent(refComponent, updateArr);
    });
  }
};

window.addEventListener("load", function () {
  cardsContainer = document.querySelector(".grid");
  toggleStageButtons = document.querySelectorAll("a.toggle-btn");
  activeFilter = document.querySelector(".btn-active");
  inActiveFilter = document.querySelector(".btn-inactive");
  all = document.querySelector(".btn-all");
  removeButtons = document.querySelectorAll(".remove");

  getData("/data.json").then((myArray) => {
    if (myArray) {
      originalData = myArray;
      updateGridComponent(cardsContainer, originalData);
    }
  });
});
