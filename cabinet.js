var neonPhase1 = $("#logo").css("text-shadow");
var neonPhase2 = "rgb(255, 255, 255) 0px 0px 20px, rgb(255, 255, 255) 0px 0px 30px, rgb(0, 117, 135) 0px 0px 40px, rgb(0, 117, 135) 0px 0px 50px, rgb(0, 117, 135) 0px 0px 80px, rgb(0, 117, 135) 0px 0px 100px, rgb(0, 117, 135) 0px 0px 120px, rgb(0, 117, 135) 0px 0px 175px";

//setInterval(function(){ 
//    $("this").toggleClass("animate-neon")}, 
//1000);


$(".deck-button").hover(function(){
    
    var $pushable = $(this).children().eq(1);
    var $label = $(this).children().eq(2);
    var pushedY = $pushable.attr("cy");
    
    $pushable.attr("cy", "78");
    $pushable.attr("ry", "11");
    $pushable.attr("rx", "29");
    
    $label.attr("fill", "#fcfcb1")
    
}, function(){
    
    var $pushable = $(this).children().eq(1);
    var $label = $(this).children().eq(2);

    
    $pushable.attr("cy", "77");
    $pushable.attr("ry", "12");
    $pushable.attr("rx", "30");
    
    $label.attr("fill", "blue")
   
});
