    var brakeFx = new Audio("sound/brake.ogg");
    var animationFx = new Audio("sound/swoosh_01.ogg"); 

    brakeFx.volume = 0.2;
    animationFx.volume = 0.2;

    var engineFx = new Howl({
        src: ["sound/engine.ogg"],
        autoplay: false,
        loop: true,
        volume: 0.2,
        rate: 0.5
    }); 

    engineFx.play();