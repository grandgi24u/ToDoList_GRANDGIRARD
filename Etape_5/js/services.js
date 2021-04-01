/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

    //////////////////
    // Task Service //
    //////////////////
    tasks: {

        // Creates a new task and attaches it to the pending task list.
        create: (data) => {

            // Task item template.
            var taskItem = ons.createElement(
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

            // Store data within the element.
            taskItem.data = data;

            myApp.services.localStor.saveItem(taskItem.data);

            taskItem.addEventListener('change', (event) => {
                myApp.services.animators.swipe(taskItem, () => {
                    if (taskItem.data.state === "pending") {
                        taskItem.data.state = "current";
                        myApp.services.localStor.changeState(taskItem.data, "current");
                        taskItem.querySelector('.left').innerHTML = '<ons-checkbox></ons-checkbox>';
                        var currentList = document.querySelector('#current-list');
                        currentList.insertBefore(taskItem, taskItem.data.urgent ? currentList.firstChild : null);
                    } else if (taskItem.data.state === "current") {
                        taskItem.data.state = "completed";
                        myApp.services.localStor.changeState(taskItem.data, "completed");
                        taskItem.querySelector('ons-checkbox').checked = true;
                        taskItem.querySelector('ons-checkbox').disabled = true;
                        var completedList = document.querySelector('#completed-list');
                        completedList.insertBefore(taskItem, taskItem.data.urgent ? completedList.firstChild : null);
                    }
                });
            });

            taskItem.querySelector('ons-icon').addEventListener('click', () => {
                myApp.services.animators.remove(taskItem, () => {
                    myApp.services.localStor.deleteItem(taskItem.data);
                });
            });

            taskItem.querySelector('.center').addEventListener('click', () => {
                document.querySelector('#myNavigator').pushPage('html/details_task.html', {data: taskItem.data});
            });

            // Insert urgent tasks at the top and non urgent tasks at the bottom.
            if (taskItem.data.state === "current") {
                var currentList = document.querySelector('#current-list');
                currentList.insertBefore(taskItem, taskItem.data.urgent ? currentList.firstChild : null);
            } else if (taskItem.data.state === "completed") {
                var completedList = document.querySelector('#completed-list');
                completedList.insertBefore(taskItem, taskItem.data.urgent ? completedList.firstChild : null);
                taskItem.querySelector('ons-checkbox').checked = true;
                taskItem.querySelector('ons-checkbox').disabled = true;
            } else {
                var pendingList = document.querySelector('#pending-list');
                pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
            }

        },
    },

    //////////////////
    // LocalStorage //
    //////////////////
    localStor: {

        // item charger
        chargeItem: [],

        // change an item
        changeItemValues: (title, data) => {
            var tabFixtures = JSON.parse(window.localStorage.getItem("ToDoList"));
            tabFixtures.forEach((elem) => {
                if (elem.title === title) {
                    elem.description = data.description;
                    elem.category = data.category;
                }
            });
            window.localStorage.setItem("ToDoList", JSON.stringify(tabFixtures));
        },

        // check if an item existe in localStorage
        itemExist: (data) => {
            var tabFixtures = JSON.parse(window.localStorage.getItem("ToDoList"));
            if (tabFixtures !== null) {
                var exist = false;
                tabFixtures.forEach((elem) => {
                    if (elem.title === data.title) {
                        exist = true;
                    }
                });
                return exist;
            }
            return false;
        },

        changeState: (data, state) => {
            var tabFixtures = JSON.parse(window.localStorage.getItem("ToDoList"));
            tabFixtures.forEach((elem) => {
                if (elem.title === data.title) {
                    elem.state = state;
                }
            });
            window.localStorage.setItem("ToDoList", JSON.stringify(tabFixtures));
        },

        // save items in localStorage when app is close
        saveItem: (data) => {
            var tabFixtures = JSON.parse(window.localStorage.getItem("ToDoList"));
            if (tabFixtures === null) {
                window.localStorage.setItem("ToDoList", JSON.stringify([data]));
            } else {
                if(!myApp.services.localStor.itemExist(data)) {
                    tabFixtures.push(data);
                    window.localStorage.setItem("ToDoList", JSON.stringify(tabFixtures));
                }
            }
        },

        // charge items from localStorage when we open app
        charge: (page) => {
            var tabFixtures = JSON.parse(window.localStorage.getItem("ToDoList"));
            if (tabFixtures) {
                tabFixtures.forEach((e) => {
                    if(e.state === page && myApp.services.localStor.chargeItem.indexOf(e.state) === -1) {
                        myApp.services.tasks.create(e);
                    }
                });
                myApp.services.localStor.chargeItem.push(page);
            }
        },

        // delete an item in localStorage
        deleteItem: (data) => {
            var fixtures = JSON.parse(window.localStorage.getItem("ToDoList"));
            var newTab = [];
            fixtures.forEach((elem) => {
                if (elem.title !== data.title) {
                    newTab.push(elem);
                }
            });
            window.localStorage.setItem("ToDoList", JSON.stringify(newTab));
        },

        // delete the localStorage of the app
        deleteAll: () => {
            document.querySelector('#pending-list').innerHTML = "";
            document.querySelector('#completed-list').innerHTML = "";
            document.querySelector('#current-list').innerHTML = "";
            window.localStorage.removeItem("ToDoList");
        }

    },

    ////////////////
    // Animations //
    ////////////////
    animators: {

        // Swipe animation for task completion.
        swipe: function (listItem, callback) {
            var animation = 'animation-swipe-right';
            listItem.classList.add('hide-children');
            listItem.classList.add(animation);

            setTimeout(function () {
                listItem.classList.remove(animation);
                listItem.classList.remove('hide-children');
                callback();
            }, 950);
        },

        // Remove animation for task deletion.
        remove: function (listItem, callback) {
            listItem.classList.add('animation-remove');
            listItem.classList.add('hide-children');

            setTimeout(function () {
                callback();
            }, 750);
        }
    }

};
