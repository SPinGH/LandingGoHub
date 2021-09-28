(function () {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
        if (webP.height === 2) { document.body.classList.add('webp'); }
        else { document.body.classList.add('no-webp'); }
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";

    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('lock');
        })
    }
    const header = document.querySelector('.header');
    const headerOffsetTop = header.offsetTop;
    if (header) {
        window.addEventListener('scroll', () => {
            let offsetTop = self.pageYOffset || (document.documentElement && document.documentElement.scrollTop)
                || (document.body && document.body.scrollTop);
            if (offsetTop > headerOffsetTop) {
                header.classList.add('fixed');
            } else {
                header.classList.remove('fixed');
            }
        });
    }
})()