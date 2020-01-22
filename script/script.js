document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'); // нашли первый элемент с таким классом на странице
    const cartBtn = document.getElementById('cart');
    const wishListBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const loader = document.querySelector('.loader-wrapper');
    const countCounter = cartBtn.querySelector('.counter');
    const wishlistCounter = wishListBtn.querySelector('.counter');

    let wishlist = [];


    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
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
        event.preventDefault(); // отмена стандартного браузерного поведения элемента. В данном случае - перехода по ссылке
        cart.style.display = 'flex';
    }

    const renderCard = items => {
        goodsWrapper.textContent = '';

        if (items.length) {
            items.forEach((item) => {
                const { id, title, price, imgMin } = item;  // деструктуризация. Чтобы не писать каждый раз item.id и тп.
                // console.log(item);
                goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin))
            });
        } else {
            goodsWrapper.textContent = 'Товары не найдены';
        }

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
            // console.log(category);
            getGoods(renderCard, goods => goods.filter(item =>  item.category.includes(cat)));
        }
    }; 

    const hideLoader = () => {
        loader.style.display = 'none';
    };

    const searchGoods = event => {
        // отмена стандартного браузерного поведения элемента.
        // В данном случае - перезагрузки страницы.Мы не будем браузером обрабатывать поиск, а будем через JS.
        event.preventDefault(); 

        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim(); // trim убирает пробелы, так в консоль не вывалится пустой запрос
        if (inputValue !== '') { 
            // console.log(input.value);  // получаем содержимое формы поиска
            // https://regexr.com/ - сайт для подбора регулярных выражений на своем тексте
            const searchString = new RegExp(inputValue, 'i'); // создаем рег. выражение для поиска на основании введенного текста. По этому тексту ищем среди массива товаров

            getGoods(renderCard, goods => goods.filter( item => searchString.test(item.title)));
            
        } else {
            // данный блок в случае пустого запроса вешает класс на строку поиска.
            //Этот css класс воспроизводит анимацию мерцания.
            search.classList.add('error');
            // Если еще раз навесить этот класс при следующем пустом запросе, анимация не сработает.
            // Поэтому, необходимо через какое-то время удалить этот класс;
            setTimeout( () => search.classList.remove('error'), 2000);
        };

        input.value = '';

    };

    const checkCount = () => {
        wishlistCounter.textContent = wishlist.length;
    };

    const storageQuery = get => {
        if (get) {
            if (localStorage.getItem('wishlist')) {
                JSON.parse(localStorage.getItem('wishlist')).forEach(id => wishlist.push(id));
            }

        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlist))
        }
        checkCount();
    };
    
    const toggleWishlist = id => {
        if (wishlist.includes(id)) {
            wishlist.splice(wishlist.indexOf(id), 1);
            document.querySelector(`.card-add-wishlist[data-goods-id='${id}']`).classList.remove('active');
        } else {
            wishlist.push(id);
            document.querySelector(`.card-add-wishlist[data-goods-id='${id}']`).classList.add('active');
        };
        checkCount();
        storageQuery();
    };

    const handlerGoods = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')) {

            // нестандартные атрибуты записываются в dataset и их названя преобразуются в camelCase.
            // (если в начале названия атрибута стоит слово 'data', оно опускается).
            // Так атрибут 'data-goods-id' мы можем найти в структуре DOM элемента через dataset.goodsId.
            toggleWishlist(target.dataset.goodsId);
            
        }
    };

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    document.addEventListener('keydown', closeCart);
    category.addEventListener('click', chooseCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);


    getGoods(renderCard, randomSort, hideLoader);

    storageQuery(true);
});

// 2:07:26