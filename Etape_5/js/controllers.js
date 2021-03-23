/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////
  tabbarPage: (page) => {
    // Set button functionality to open/close the menu.
    page.querySelector('[component="button/menu"]').onclick = () => {
      document.querySelector('#mySplitter').left.toggle();
    };

    // Set button functionality to push 'new_task.html' page.
    Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), (element) => {
      element.onclick = () => {
        document.querySelector('#myNavigator').pushPage('html/new_task.html');
      };
      element.show && element.show(); // Fix ons-fab in Safari.
    });

    page.querySelector('[component="button/del-task"]').addEventListener('click', () => {
      myApp.services.localStor.deleteAll();
    });
  },

  newTaskPage: (page) => {

      // Charger les catégories lors de la création d'une nouvelle tache
      var categorie = [];
      var tabFix = JSON.parse(window.localStorage.getItem("ToDoList"));
      if(tabFix) {
        tabFix.forEach( (elem) => {
          if(!categorie.includes(elem.category) && elem.category !== '' ) {
            categorie.push(elem.category);
            page.querySelector('#categorie').innerHTML += `
            <ons-list-item id="item-category" tappable>
                <div class="center">
                    <p>${elem.category}</p>
                </div>
                <div class="right">
                    <ons-radio name="categoryGroup" input-id="r-all ${elem.category}"></ons-radio>
                </div>
            </ons-list-item>
          `;
          }
        });
      }


    page.querySelector('#categorie').innerHTML += `
        <ons-list-item id="item-category" tappable>
           <div class="center">
                <ons-input id="category-input" type="text" placeholder="Nom de la categorie" float></ons-input>
           </div>
           <div class="right">
                <ons-radio name="categoryGroup" input-id="r-all new-Cat" checked></ons-radio> 
           </div>
        </ons-list-item>
        `;

    // lorsque l'on enregistre une tâche
    page.querySelector('[component="button/save-task"]').onclick = () => {

      var titre = document.getElementById("title-input").value;
      var descr = document.getElementById("descr-input").value;

      var categorie = "";
      var radio = document.getElementsByName("categoryGroup");

      radio.forEach((e) => {
        if(e.checked) {
          if(e.id.substr(6) === "new-Cat"){
            categorie = document.getElementById("category-input").value;
          }else{
            categorie = e.id.substr(6);
          }
        }
      })

      if(titre) {
        var data = {
          title: titre,
          category: categorie,
          description: descr,
          state: "pending",
          highlight: false,
          urgent: false,
        };
        if(myApp.services.localStor.itemExist(data)) {
          ons.notification.alert("La tache existe déjà");
        } else {
          myApp.services.tasks.create(data);
          document.querySelector('#myNavigator').popPage();
        }
      } else {
        ons.notification.alert("Veuillez saisir un titre");
      }
    }
  }

};
