window.onload = function(){
    window.addEventListener('scroll', function(e){
            document.querySelector("header").classList.remove("is-scrolling")
        if(window.pageYOffset>100){
            document.querySelector("header").classList.add("is-scrolling")
        }

    });

    const menu_btn = document.querySelector(".hamburger");
    const menu_links = document.querySelector(".hamburgerLinks");

    menu_btn.addEventListener('click', function(){
        menu_btn.classList.toggle("is-active")
        menu_links.classList.toggle("is-active")

    })
}