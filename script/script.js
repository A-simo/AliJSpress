document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'); // нашли первый элемент с таким классом на странице
    const cartBtn = document.getElementById('cart');
    const wishListBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const loader = document.querySelector('.loader-wrapper');


    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist"
                                    data-goods-id="${id}"></button>
                            </div>
                            <div class="card-body justify-content-between">
                                <a href="#" class="card-title">${title}</a>
                                <div class="card-price">${price} ₽</div>
                                <div>
                                    <button class="card-add-cart"
                                    data-goods-id="${id}">Добавить в корзину</button>
                                </div>
                            </div>
                        </div>`;
        return card;
    };


    const closeCart = (event) =>  {
        // console.log(event);
        const target = event.target;
        // проверяем, по каким элементам был клик для закрытия окна корзины и был ли клик по клавише Esc
        if (target === cart ||
            target.classList.contains('cart-close') ||
            event.key === "Escape") {
                cart.style.display = '';
                document.removeEventListener('keyup', closeCart);
            }
        };

    const openCart = () => {
        event.preventDefault();
        cart.style.display = 'flex';
    }

    const renderCard = items => {
        goodsWrapper.textContent = '';
        items.forEach((item) => {
            const { id, title, price, imgMin } = item;  // деструктуризация. Чтобы не писать каждый раз item.id и тп.
            // console.log(item);
            goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin))
        });
    };


    const getGoods = (handler, filter, decoration) => {
        fetch('db/db.json')
        .then( response => response.json())
        .then( filter )
        .then( handler )
        .then( decoration);
    };

    const randomSort = (goods) => goods.sort(() => Math.random() -0.5 ); // рандомная сортировка
    
    
    const chooseCategory = event => {
        event.preventDefault();
        const target = event.target;

        if (target.classList.contains('category-item')) {
            const cat = target.dataset.category;
            console.log(category);
            getGoods(renderCard, goods => goods.filter(item =>  item.category.includes(cat)));
        }
    }; 

    const hideLoader = () => {
        loader.style.display = 'none';
    };
    
    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    document.addEventListener('keydown', closeCart);
    category.addEventListener('click', chooseCategory);


    getGoods(renderCard, randomSort, hideLoader);
});





// ​ВОПРОС: полтора года практики, чтобы потом начать преподавать - смело. Чувствуется уверенное знание предмета. Как ты учил js? Вероятно, был интенсивный оптимальный способ, а не чтение книг.