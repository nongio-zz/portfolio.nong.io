var myDataRef;
var current_user;

$(document).ready(function () {
    $("#people").css({
        height:$(document).height() + "px"
    })

    myDataRef = new Firebase('https://nongio.firebaseio.com/users')
    var my_color = {
        r: Math.random()*255,
        g: Math.random()*255,
        b: Math.random()*255
    }
    var current_user = myDataRef.push({
        scroll: 0,
        date: (new Date()).getTime(),
        r: my_color.r,
        g: my_color.g,
        b: my_color.b
    });
    var person = $("<div id=\"person_me\" class=\"person\">")
        .css({
            "position": "fixed",
            "border-color": " rgb("+ Math.floor(my_color.r)+","+Math.floor(my_color.g) + ","+Math.floor(my_color.b)+")"
        })
    $("#people").append(person);
    
    $(document).scroll(function(e){
        var top = $(window).scrollTop();
        current_user.update({scroll: top});
    })

    myDataRef.on('child_added', function(snapshot) {
       if(snapshot.name() != current_user.name()){
            var person = $("<div id=\"person"+ snapshot.name() +"\" class=\"person\">")
                .css({top: snapshot.val().scroll+"px"})
                .css({
                    "border-color": " rgb("+ Math.floor(snapshot.val().r)+","+Math.floor(snapshot.val().g) + ","+Math.floor(snapshot.val().b)+")"
                })
            $("#people").append(person);
        }

    });
    myDataRef.on('child_changed', function(snapshot) {
        var top = snapshot.val().scroll+100;
        $("#person"+ snapshot.name()).css({top: top+"px"})
        .css({
            "border-color": "rgb("+ Math.floor(snapshot.val().r)+","+Math.floor(snapshot.val().g) + ","+Math.floor(snapshot.val().b)+")"
        })
    });
    myDataRef.on('child_removed', function(snapshot) {
        $("#person"+ snapshot.name()).remove();
    });

    current_user.onDisconnect().remove();
});