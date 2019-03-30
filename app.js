// Global snapshot of items, keep this the only global -- makes it so that refereshes of the entire database are unneeded

var itemdata = [];
var writeitemcheck = 0;


function createItemdb() {
    var db_items = database.ref('items/');

    // Generate item database

    db_items.once("value", function (snapshot) {
        var feedcontent = [];
        snapshot.forEach(function (childSnapshot) {
            var itemo = childSnapshot.val();
            //Reset lights, just in case
            childSnapshot.ref.update({
                light: 0
            });
            itemdata.push(itemo);
            var accession = itemdata.length - 1;
            if (itemo.id != null) {


                // Chronological display (not really necessary, but :) )
                feedcontent = itemFormatter(itemo.id, itemo.light, itemo.name, itemo.price, itemo.qty, accession) + feedcontent;
                console.log(itemo.name + itemo.id + itemo.qty + accession);
            } else {
                console.log("Invalid item!");
            }
        })
        $("#item-log").html(feedcontent);
    })

    // Generate transactions

    var trans_items = firebase.database().ref('users/foo/transaction/');

    trans_items.once("value", function (snapshot) {
        var logcontent = [];
        snapshot.forEach(function (childSnapshot) {
            logcontent = "<div class='log-container' data-byuser='foo' data-transactionid='" + childSnapshot.key + "'>" + "<h3>Transaction time:" + childSnapshot.child("time").val() + "</h3><div id='log-inner-items' class='log-inner log-inner-items'></div> " + "<span class='log-inner log-inner-details'>" + "<span class='log-inner log-inner-value log-value-user'>" + "Physician Name" + "</span>" + "<span class='log-inner log-inner-value log-value-key'>" + childSnapshot.key + "</span></span></div></div>";

            // Prepend shows transactions chronologically, latest one appearing at the top (hopefully)
            $("#log-wrapper").prepend(logcontent);

            childSnapshot.child("items").forEach(function (childchildSnapshot) {
                var itemo = childchildSnapshot.val();
                $("#log-wrapper > [data-transactionid~='" + childSnapshot.key + "'] > #log-inner-items").append(logHistoryFormatter(itemo.id, itemo.light, itemo.name, itemo.price, itemo.qty));

            })
        })
    })

}

createItemdb();


function itemFormatter(id, light, name, price, qty, datapos) {
    var dlgasdgl = "<div class='item-container item-light-" + light + " item-id-" + id + "' data-itemid=" + id + " data-itemqty=" + qty + "><h1 id='item-inner-name'>" + name + "</h1><p class='item-inner-desc'></p><div class='item-stat-qty'>" + qty + "</div> &nbsp; <div class='item-stat-price'>" + price + "</div><br><span class='item-inner-select'><button class='item-inner-option' onclick='itemSelect(\"sub\", itemdata[" + datapos + "]);'>-</button> &nbsp; <button class='item-inner-option' onclick='itemSelect(\"add\", itemdata[" + datapos + "]);'>+</button></div>";
    return dlgasdgl;
}


function logFormatter(id, light, name, price, qty, datapos) {
    var dlgasdgl = "<div class='item-list item-light-" + light + " item-id-" + id + "' data-itemid=" + id + " data-itemqty=" + qty + "><h1 id='item-inner-name'>" + name + "</h1><p class='item-inner-desc'></p><div class='item-stat-qty'>" + qty + "</div> &nbsp; <div class='item-stat-price'>" + price + "</div><br></div>";
    return dlgasdgl;
}


function logHistoryFormatter(id, light, name, price, qty) {
    var dlgasdgl = "<div class='item-container item-light-" + light + " item-id-" + id + "' data-itemid=" + id + " data-itemqty=" + qty + "><h1 id='item-inner-name'>" + name + "</h1><p class='item-inner-desc'></p><div class='item-stat-qty'>" + qty + "</div> &nbsp; <div class='item-stat-price'>" + price + "</div><br></div>";
    return dlgasdgl;
}



/*
function queryItems(id){
    var query = database.ref('items').orderByChild('id').equalTo(parseInt(id));
            query.once("value", function(snapshot) {
                snapshot.ref.child('qty').val();
                console.log( snapshot.ref.child('qty').val());     
            });
}
*/

function itemSelect(option, data) {

    // Access temporary database
    function updateItemdata(id, newqty) {
        for (var i in itemdata) {
            if (itemdata[i].id == id) {
                itemdata[i].qty = newqty;
            }
        }
    }

    var query = database.ref('items').orderByChild('id').equalTo(data.id);
    switch (option) {
        case "add":

            var newdata = data.qty;
            newdata--;
            query.once("child_added", function (snapshot) {
                snapshot.ref.child('qty').set(newdata);
                console.log(newdata);
            });

            console.log("Trying to locate div in log with value: " + data.id + typeof data.id);

            //  console.log($('#saved-log > *[data-itemid="' + data.id + "']").html().data('itemid'));

            if ($('#saved-log .item-id-' + data.id).length) {
                var currentlogqty;
                $('#saved-log > *[data-itemid="' + data.id + '"]').each(function () {
                    console.log($(this).attr('data-itemqty'));
                    currentlogqty = $(this).attr('data-itemqty');
                })
                // var currentlogqty = $("saved-log > .item-container[data-itemid=" + data.id + "] > .item-stat-qty").val();
                currentlogqty++;
                $('#saved-log .item-id-' + data.id).replaceWith(logFormatter(data.id, data.light, data.name, data.price, currentlogqty, data.datapos));
            } else {
                console.log("Does not exist, adding new...");
                $("#saved-log").append(logFormatter(data.id, data.light, data.name, data.price, 1, data.datapos));
            }

            /*
                        $('#saved-log > .item-container').each(function () {
                            if ($(this).data('itemid') == data.id) {
                                var currentlogqty = $(this).data('itemqty');
                                currentlogqty++;
                                $(this).replaceWith(logFormatter(data.id, data.light, data.name, data.price, currentlogqty, data.datapos));
                            }
                        })*/


            //  if ($("#saved-log > *[data-itemid=" + data.id + "]")) {
            /*
            if ($('#saved-log > *[data-itemid="' + data.id + "']").length) {
                console.log("Exists!" + typeof data.id);
                var currentlogqty = $("#saved-log > [data-itemid~='" + data.id + "']").data('itemqty');
                currentlogqty++;
                $("#saved-log > [data-itemid~='" + data.id + "']").replaceWith(logFormatter(data.id, data.light, data.name, data.price, currentlogqty, data.datapos));
            } else {
                console.log("Does not exist, adding new...");
                $("#saved-log").append(logFormatter(data.id, data.light, data.name, data.price, 1, data.datapos));
            }*/

            //console.log("id:" + data.id + " qty:" + data.qty--);
            $('#saved-log > *[data-itemid="' + data.id + "']").data('itemqty', newdata);

            //console.log($("#item-log > [data-itemid~='" + data.id + "'] > .item-stat-qty").html() + newdata);
            $("#item-log > .item-id-" + data.id + " > .item-stat-qty").each(function () {
                console.log("new dataqty" + newdata);
                $(this).html(newdata);
            });

            // Access and update temporary database with the new qty
            updateItemdata(data.id, newdata);

            break;

        case "sub":


            var newdata = data.qty;

            // Locate saved-log for item matching id, if none then decrement isn't possible
            if ($('#saved-log .item-id-' + data.id).length) {


                // Modify log quantity
                var currentlogqty = $('#saved-log .item-id-' + data.id).data('itemqty');
                // Check if list removal is needed, if so, fade and remove
                if (currentlogqty <= 1) {
                    currentlogqty--;
                    // Remove div; fadeOut has to be fast or else successive decrements will restore more than there is
                    // Change: Input delay after click
                    $('#saved-log .item-id-' + data.id).fadeOut(300, function () {
                        $(this).remove();
                    });
                } else {
                    currentlogqty--;
                    $('#saved-log .item-id-' + data.id).replaceWith(logFormatter(data.id, data.light, data.name, data.price, currentlogqty, data.datapos));

                }
                newdata++;

                // Decrement item in item database
                query.once("child_added", function (snapshot) {
                    //Increase inventory count
                    snapshot.ref.child('qty').set(newdata)
                });
                console.log("id:" + data.id + " qty: " + newdata);
                $("#item-log > .item-id-" + data.id + " > .item-stat-qty").each(function () {
                    $(this).html(newdata);
                    //   $(this).html ()".item-stat-qty").html(data.qty++);
                });

                updateItemdata(data.id, newdata);
            } else {
                // If no match found
                console.log("Can't decrease! No change")
            }

            // Access and update temporary database with the new qty

            break;
    }
}

//data-log-qty temporarily tracks amount of item selected in log

// Save items in saved-log div
var tempitemid;

function writeLog() {

    var thetime = Date.now()

    var transkey = database.ref('users/foo/transaction').push().key;
    console.log(transkey);
    database.ref('users/foo/transaction/' + transkey).child('time').set(thetime);
    database.ref('users/foo/transaction/' + transkey).child('light').set(1);
    $("#saved-log > .item-list").each(function () {
        tempitemid = $(this).attr('data-itemid');
        var newqty = $(this).attr('data-itemqty');
        console.log(tempitemid);
        //var pleasegod = parseInt(tempitemid);

        //Make sure item id is ALL STRING OR ALL INTEGER, if int it has to be parsed properly
        database.ref().child("items").orderByChild('id').equalTo(parseInt(tempitemid)).once("value").then(function (result) {
            result.forEach(function (snapshot) {
                console.log(snapshot.val());

                //Turn light on
                snapshot.ref.update({
                    light: 1
                });


                newqty = $("#saved-log > .item-id-" + snapshot.child('id').val()).attr('data-itemqty');
                console.log("hi");
                addItem(transkey, snapshot.val(), newqty);
                //sleep(1000);
                console.log(tempitemid);
                console.log(snapshot.child("id").val());
            });
        });
    })


    displayLogentry(transkey);

    //clearlog();

    //function clearlog(){$("#saved-log").html("");}

    /*
    console.log("Clearing selection...");
    $("#saved-log").html("");*/
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


function addItem(transaction, data, qty) {
    var itemDetails = {
        id: data.id,
        light: data.light,
        name: data.name,
        price: data.price,
        qty: qty
    };

    console.log(data.light);
    //var newItemKey = database.ref('users/foo/transaction/' + transaction).push().key;

    var newitems = {};
    newitems['users/foo/transaction/' + transaction + '/items/' + data.id] = itemDetails;

    return firebase.database().ref().update(newitems);

}





/* DISPLAY NEWEST LOG ENTRY */

function displayLogentry(transkey) {
    var query = firebase.database().ref('users/foo/transaction').child(transkey).child('items');
    var querytime = firebase.database().ref('users/foo/transaction').child(transkey).child('time');

    var thetime;

    querytime.once('value', function (snapshot) {
        thetime = snapshot.val();
    });

    var logcontent = "<div class='log-container' data-byuser='foo' data-transactionid='" + transkey + "'>" + "<h3>Transaction time:" + thetime + "</h3><div id='log-inner-items' class='log-inner log-inner-items'></div> " + "<span class='log-inner log-inner-details'>" + "<span class='log-inner log-inner-value log-value-user'>" + "Physician Name" + "</span>" + "<span class='log-inner log-inner-value log-value-user'>" + transkey + "</span></span></div></div>"

    $("#log-wrapper").prepend(logcontent);

    query.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var itemo = childSnapshot.val();
            $("#log-wrapper > [data-transactionid~='" + transkey + "'] > #log-inner-items").append(logHistoryFormatter(itemo.id, itemo.light, itemo.name, itemo.price, itemo.qty));


        })
    })

    writeitemcheck = 1;

}




/* DOM BEHAVIOR */
$('#screen-log').hide();
$('#screen-cart').hide();


function screenMove(screen) {
    switch (screen) {
        // Log
        case "log":
            if (writeitemcheck = 1) {
                writeitemcheck = 0;
                $("#saved-log").text("");
            }
            // --->
            $('.wrapper-screen').hide();
            $("#wrapper").css('background', 'rgb(238, 185, 137)');
            $("#screen-log").slideDown();
            break;

            // Main
        case "main":
            // --->
            if (writeitemcheck = 1) {
                writeitemcheck = 0;
                $("#saved-log").text("");
            }
            $('.wrapper-screen').hide();
            $("#wrapper").css('background', 'rgb(238, 185, 137)');
            $("#screen-main").slideDown();
            break;

            // Cart
        case "cart":
            // --->
            $('.wrapper-screen').hide();
            $("#wrapper").css('background', '#f6f6f9');
            $("#screen-cart").slideDown();
            break;

    }
}
