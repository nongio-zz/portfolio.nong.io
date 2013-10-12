var myDataRef;
var current_user;

$(document).ready(function () {
    window.console.log("ready!")
    
    //myDataRef = new Firebase('https://nongio.firebaseio.com/users');
    myDataRef = new Firebase('https://nongio.firebaseio.com/users')

    //var id = myDataRef.get("id") || 0;
    myDataRef.once('value', function(allMessagesSnapshot) {
        var current_date = (new Date()).getTime();
        allMessagesSnapshot.forEach(function(messageSnapshot) {
            var diff = current_date - messageSnapshot.val().date;
            if(diff > 36000)
                messageSnapshot.ref().remove();

        });
    });
    var current_user = myDataRef.push({
        scroll: 0,
        date: (new Date()).getTime(),
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
        var top = 0.05+(snapshot.val().scroll / ($(window).height()*1.6));
        if(top < 0)
            top = 0;
        if(top > 1)
            top = 1;
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