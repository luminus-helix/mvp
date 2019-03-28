/*var articles = [];
var posts = database.ref('items/');
			posts.on('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
					// Create an object that depicts individual articles
            articles[childSnapshot.key] = {
                                'name' : childSnapshot.val().name,
								'light' : childSnapshot.val().light,
								'id' : childSnapshot.val().id,
								'price' : childSnapshot.val().price,
								'qty' : childSnapshot.val().qty};
				})
});
//displayItems();});
*//*


var ref = firebase.database().ref("items/");

ref.on("value", function(snapshot) {
 snapshot.forEach(function(childSnapshot) {
	var childData = childSnapshot.val();
	var id=childData.id;
	console.log(childData);}*/


//creating reference to the database

// Storage for items
    var itemdata = [];


function createItemdb(){
    var db_items = database.ref('items/');

    db_items.once("value", function(snapshot) {
        var feedcontent = [];
        snapshot.forEach(function(childSnapshot){
            var itemo = childSnapshot.val();
            itemdata.push(itemo);
            var accession = itemdata.length - 1;
            feedcontent += itemFormatter(itemo.id, itemo.light, itemo.name, itemo.price, itemo.qty, accession);
            console.log(itemo.name + itemo.id + itemo.qty + accession);
        })
    $("#item-log").html(feedcontent);
    })
    
}

    createItemdb();
    

function itemFormatter(id, light, name, price, qty, datapos){
    var dlgasdgl = "<div class='item-container item-light-" + light + " item-id-" + id + "' data-itemid=" + id + " data-itemqty=" + qty + "><h1 id='item-inner-name'>" + name + "</h1><p class='item-inner-desc'>lorem ipsul dolor sit amet<br><br><div class='item-stat-qty'>" + qty + "</div> &nbsp; <span class='item-stat-price'>" + price + "</span><br><span class='item-inner-select'><button class='item-inner-option' onclick='itemSelect(\"sub\", itemdata[" + datapos + "]);'>-</button> &nbsp; <button class='item-inner-option' onclick='itemSelect(\"add\", itemdata[" + datapos + "]);'>+</button></p></div>";
    return dlgasdgl;
}


function logFormatter(id, light, name, price, qty, datapos){
    var dlgasdgl = "<div class='item-container item-light-" + light + " item-id-" + id + "' data-itemid=" + id + " data-itemqty=" + qty + "><h1 id='item-inner-name'>" + name + "</h1><p class='item-inner-desc'>lorem ipsul dolor sit amet<br><br><div class='item-stat-qty'>" + qty + "</div> &nbsp; <span class='item-stat-price'>" + price + "</span><br><span class='item-inner-select'><button class='item-inner-option' onclick='itemSelect(\"sub\", itemdata[" + datapos + "]);'>-</button> &nbsp; <button class='item-inner-option' onclick='itemSelect(\"add\", itemdata[" + datapos + "]);'>+</button></p></div>";
    return dlgasdgl;
}


function itemSelect(option, data){
    switch(option){
        case "add":
            var updates = {};
           // updates["/qty"] = data.qty--;
          //  return database.ref('items/' + data.id).update(updates);
            var query = database.ref('items').orderByChild('id').equalTo(data.id);
            //var newqty = data.qty++;
           // console.log(newqty);
            query.once("child_added", function(snapshot) {
                snapshot.ref.child('qty').set(data.qty--)
            });
            //$("#saved-log").append(itemFormatter(data.id, data.light, data.name, data.price, data.qty, data.datapos, data.logqty));
            if($("#saved-log > .item-container").data('itemid')===data.id){
                console.log($("#saved-log > [data-itemid~='"+data.id+"']").data('itemid'));
                //if existing, increment logqty
                //if not create
                /*var loc = $("#saved-log > .item-container").data('itemid')===data.id;
                var currentlogqty = $('#saved-log > *[data-itemid="' + parseInt(2424) + '"]').data('itemid');
                console.log($(currentlogqty).attr('data-itemqty'));
                $(this).html(logFormatter(data.id, data.light, data.name, data.price, currentlogqty++, data.datapos));*/
            } else{
                $("#saved-log").append(logFormatter(data.id, data.light, data.name, data.price, 1, data.datapos));
            }
            console.log("id:" + data.id);
            $("#item-log > .item-id-" + data.id + " > .item-stat-qty").each(function(){
                console.log("hello!");
                $(this).html(data.qty);
             //   $(this).html ()".item-stat-qty").html(data.qty++);
            });
            //$(".item-container").attr('data-itemqty');
            break;
    }
}

//data-log-qty temporarily tracks amount of item selected in log

// Save items in saved-log div
var tempitemid;
function writeLog(){
    
    var thetime = Date.now()
    
    var transkey = database.ref('users/foo/transaction').push().key;
    console.log(transkey);
    database.ref('users/foo/transaction/' + transkey).child('time').set(thetime);
    $("#saved-log > .item-container").each(function(){
        tempitemid = $(this).attr('data-itemid');
        qty = $(this).attr('data-itemqty');
        var pleasegod = parseInt(tempitemid);
        
        database.ref().child("items").orderByChild('id').equalTo(pleasegod).once("value").then(function(result) {
            result.forEach(function(snapshot) {
                console.log(snapshot.val());
                addItem(transkey, snapshot.val(), qty);
                console.log(snapshot.child("id").val());
            });
        });
    })
  //  return database.ref('users/foo/transaction/' + transkey).child("time").set(thedate);
};
        
        
        
        /*var query = database.ref('items').orderByChild('id').equalTo($(this).attr('data-itemid'));
        console.log(query);
        query.
        query.once("value", function(snapshot){ 
            console.log("helelo" + snapshot.val());
            return snapshot.val();
        })*/
       /* query.once('child_added', function(snapshot) {
            console.log("FUCL");
         //   addItem(snapshot.val());
            console.log(snapshot.val());
        });*/
        
        /*
        var query = database.ref('items').orderByChild('id').equalTo(tempitemid);
        query.once("child_added", function(snapshot) {
            console.log(snapshot.ref); 
            console.log("hi");
        });*/
    

function addItem(transaction, data, qty){
    var itemDetails = {
        id: data.id,
        light: data.light,
        name: data.name,
        price: data.price,
        qty: qty
    };
    
    //var newItemKey = database.ref('users/foo/transaction/' + transaction).push().key;
    
    var newitems = {};
    newitems['users/foo/transaction/' + transaction + '/' + data.id] = itemDetails;
    
    return firebase.database().ref().update(newitems);
    
}
