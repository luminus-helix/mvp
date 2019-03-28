/*   LOCATION FOR TEST FUNCTIONS
     FOR DELETION LATER ON          */

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function temp(what) {
    switch (what) {


        case "clearlog":
            var foo = {
                transaction: 0
            }

            var cleanuser = {};
            cleanuser['users/foo'] = foo;

            return firebase.database().ref().update(cleanuser);

            break;
    }
}

function addDBitem(id, light, name, price, qty) {

    if (light == 0 || light == 1) {
        var itemDetails = {
            id: id,
            light: light,
            name: name,
            price: price,
            qty: qty
        };
    } else {
        console.log("Light level must be 0 or 1!");
    }

    var newItemKey = database.ref('items').push().key;

    var newitems = {};
    newitems['items/' + newItemKey] = itemDetails;

    return firebase.database().ref().update(newitems);
}


function resetLight(){
    var db_items = database.ref('items/');
    

    db_items.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var itemo = childSnapshot.val();
                //Reset lights, just in case
                childSnapshot.ref.update({light: 0});
        })})
}