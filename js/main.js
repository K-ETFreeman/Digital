function ibg() {

    let ibg = document.querySelectorAll(".ibg");
    for (var i = 0; i < ibg.length; i++) {
        let img = ibg[i].querySelector('.ibg__image');

        if (img) {
            ibg[i].style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
        }
        else {
            obj = ibg[i].getElementsByClassName('grid__item-icon')[0];

            if(obj) console.log(obj.contentDocument);
        }
    }
}

ibg();