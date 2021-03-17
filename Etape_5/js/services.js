/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.
    create: (data) => {
      // Task item template.
      var taskItem = ons.createElement(
        //'<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
        '<ons-list-item tappable category="' + data.category + '">' +
        '<label class="left">' +
        '<ons-checkbox></ons-checkbox>' +
        '</label>' +
        '<div class="center">' +
        data.title +
        '</div>' +
        '<div class="right">' +
        '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
        '</div>' +
        '</ons-list-item>'
      );

      // Insert task in the fixtures tab
      myApp.services.fixtures.push(data);

      // Store data within the element.
      taskItem.data = data;

      taskItem.addEventListener('change', (event) => {
        myApp.services.animators.swipe(taskItem, () => {
          if(event.target.checked){
            myApp.services.tasks.moveToCurrent(taskItem);
          }
        });
      });

      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      var pendingList = document.querySelector('#pending-list');
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
    },

    moveToCurrent: (taskItem) => {
      taskItem.querySelector('.left').innerHTML = '<ons-checkbox></ons-checkbox>';
      taskItem.addEventListener('change', (event) => {
        myApp.services.animators.swipe(taskItem, () => {
          if (event.target.checked) {
            myApp.services.tasks.moveToCompleted(taskItem);
          }
        });
      });

      var currentList = document.querySelector('#current-list');
      currentList.insertBefore(taskItem, taskItem.data.urgent ? currentList.firstChild : null);

    },

    moveToCompleted: (taskItem) => {
      taskItem.querySelector('ons-checkbox').checked = true;
      taskItem.querySelector('ons-checkbox').disabled = true;
      var completedList = document.querySelector('#completed-list');
      completedList.insertBefore(taskItem, taskItem.data.urgent ? completedList.firstChild : null);

    }

  },

  //////////////////////////
  // LocalStorage Gestion //
  //////////////////////////

  localStor: {

    // save items in localStorage when app is close
    save: () => {
      if(myApp.services.fixtures.length > 0) {
        window.localStorage.setItem("ToDoList", JSON.stringify(myApp.services.fixtures));
      }
    },

    // charge items in localStorage when we open app
    charge: () => {
      var tabFixtures = JSON.parse(window.localStorage.getItem("ToDoList"));
      if(tabFixtures) {
        tabFixtures.forEach((e) => {
          myApp.services.tasks.create(e);
          if(myApp.services.fixtures.indexOf(e) === -1) {
            myApp.services.fixtures.push(e);
          }
        });
      }
    },

    // delete the localStorage of the app
    deleteAll: () => {
      document.querySelector('#pending-list').innerHTML = "";
      myApp.services.fixtures = [];
      window.localStorage.removeItem("ToDoList");
    }
  },

  //////////////////////////
  // Initial Data Service //
  //////////////////////////
  fixtures: [],

  animators: {

    // Swipe animation for task completion.
    swipe: function(listItem, callback) {
      var animation = 'animation-swipe-right';
      listItem.classList.add('hide-children');
      listItem.classList.add(animation);

      setTimeout(function() {
        listItem.classList.remove(animation);
        listItem.classList.remove('hide-children');
        callback();
      }, 950);
    }
  }
};
