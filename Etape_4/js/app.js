// App logic.
window.myApp = {};

document.addEventListener('init', (event) => {
  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
    if (document.querySelector('#menuPage')
      && document.querySelector('#pendingTasksPage')
      && !document.querySelector('#pendingTasksPage ons-list-item')
    ) {
      myApp.services.localStor.charge();
    }
  }
});

window.onbeforeunload = () => {
  myApp.services.localStor.save();
}

window.onclose = () => {
  myApp.services.localStor.save();
}



