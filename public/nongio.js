var myDataRef;
var current_user;

$(document).ready(function () {
    window.console.log("ready!")
    
    var myDataRef = new Firebase('https://nongio.firebaseio.com/users');
    //var id = myDataRef.get("id") || 0;
    // myDataRef.forEach(function(childSnapshot) {
    //   // This code will be called twice.
    //   var name = childSnapshot.name();
    //   var childData = childSnapshot.val();
    //   // if( childData.date)
    // });
    var current_user = myDataRef.push({
        scroll: 0,
        date: (new Date()),
        r: Math.random()*255,
        g: Math.random()*255,
        b: Math.random()*255
    });

    $(document).scroll(function(e){
        var top = $(window).scrollTop();
        current_user.update({scroll: top});
    })

    myDataRef.on('child_added', function(snapshot) {
        window.console.log("new user", snapshot.val());
        var person = $("<div id=\"person"+ snapshot.name() +"\" class=\"person\">")
            .css({top: snapshot.val().scroll+"px"})
            .css({
                "border-color": " transparent rgb("+ Math.floor(snapshot.val().r)+","+Math.floor(snapshot.val().g) + ","+Math.floor(snapshot.val().b)+") transparent transparent"
            })
        $("#people").append(person);

    });
    myDataRef.on('child_changed', function(snapshot) {
        window.console.log("user changed", snapshot);
        //
        var top = (snapshot.val().scroll / $(window).height());
        if(top > 1)
            top = 1
        top = top * $("#people").height();
        $("#person"+ snapshot.name()).css({top: top+"px"})
        .css({
            "border-color": "transparent rgb("+ Math.floor(snapshot.val().r)+","+Math.floor(snapshot.val().g) + ","+Math.floor(snapshot.val().b)+") transparent transparent"
        })
    });
    myDataRef.on('child_removed', function(snapshot) {
        window.console.log("delete user")
        $("#person"+ snapshot.name()).remove();
    });

});