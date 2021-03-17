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

      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      var pendingList = document.querySelector('#pending-list');
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
    },



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
  fixtures: []

};
