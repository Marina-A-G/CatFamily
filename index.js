const $wr = document.querySelector('[data-wr]')
const $btnOpenModal = document.querySelector('[data-open_modal]')
const $modalsWr = document.querySelector('[data-modals_wr]')
const $addModalWr = document.querySelector('[data-addmodal_wr]')
const $showModalWr = document.querySelector('[data-showmodal_wr')


//КЛАСС С ДАННЫМИ И МЕТОДАМИ КОТОВ

class APIkotiki {
    constructor(baseurl) {
        //baseurl - общая часть всех url-запросов
        //baseurl = "http://sb-cats.herokuapp.com/api/2/Marina-A-G/"
        this.baseUrl = baseurl;
    }

    async getAllCats() {
        try {
            const response = await fetch(`${this.baseUrl}show`)
            //const data = await response.json()
            return response.json()
        } catch (error) {
            throw new Error(error)
        }
    }


    async getAllCatsID() {
        try {
            const response = await fetch(`${this.baseUrl}ids`)
            //const data = await response.json()
            return response.json()
        } catch (error) {
            throw new Error(error)
        }
    }

    async getOneCat(catId) {
        try {
            const response = await fetch(`${this.baseUrl}show/${catId}`)
            return response.json()
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteCat(catId) {
        try {
            const response = await fetch(`${this.baseUrl}delete/${catId}`, {
                method: 'DELETE'
            })
            if (response.status != 200) {
                throw new Error()
            }
            return response.json()
        } catch (error) {
            throw new Error(error)
        }
    }

    async addCat(catData) {
        try {
            const response = await fetch(`${this.baseUrl}add`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(catData),
            })
            //console.log(response)
            if (response.status != 200) {
                throw new Error()
            }
            return response.json()
        } catch (error) {
            throw new Error(error)
        }
    }
    //////////////////////////////////////////////////
    async updateCat(catId, catData) {
        try {
            const response = await fetch(`${this.baseUrl}update/${catId}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(catData),
            })
            console.log(response)
            if (response.status != 200) {
                throw new Error()
            }
            return response.json()
        } catch (error) {
            throw new Error(error)
        }
    }
}



// ШАБЛОН КАРТОЧКИ ДЛЯ ПОКАЗА КОТА

const generateHTMLTemplateForCat = (cat) => `<div data-cardid=${cat.id} class="card mx-2" style="width: 18rem;">
        <img src = "${cat.img_link}" class="card-img-top" alt = "${cat.name}" >
            <div class="card-body">
                <h5 class="card-title">${cat.name}</h5>
                <p class="card-text">${cat.description}</p>
                <button data-action="details" class="btn btn-primary">Инфо</a>
                <button data-action="delete" class="btn btn-danger">Удалить</a>
            </div>
</div >`

const generateHTMLTemplateForCatShow = (cat) => `<div data-cardid=${cat.id} class="card mx-2" style="width: 18rem;">
        <img src = "${cat.img_link}" class="card-img-top" alt = "${cat.name}" >
            <div class="card-body">
                <h5 class="card-title">${cat.name}</h5>
                <p class="card-text">ID: ${cat.id}</p>
                <p class="card-text">Возраст: ${cat.age}</p>
                <p class="card-text">Рейтинг: ${cat.rate}</p>
                <p class="card-text">${cat.description}</p>
                <p class="card-text">Фаворит: ${cat.favourite}</p>
                <button data-action="closeShow" class="btn btn-primary">Ок</a>
                <button data-action="changeFromShow" class="btn btn-danger">Изменить</a>
            </div>
</div >`

const generateHTMLTemplateForCatUpdate = (cat) => `<div data-updatemodal_wr data-cardid=${cat.id} class="add-modal">
            <form name="update_cat">
                <div class="mb-3">
                    <label class="form-label">Имя: ${cat.name}</label>
                </div>
                <div class="mb-3">
                    <label class="form-label">ID: ${cat.id}</label>
                </div>
                <div class="mb-3">
                    <label>Возраст:</label>
                    <input value="${cat.age}" name="age" type="number" class="form-control">
                </div>
                <div class="mb-3">
                    <label>Рейтинг:</label>
                    <input value="${cat.rate}" name="rate" type="number" class="form-control">
                </div>
                <div class="mb-3">
                    <label>Подробная информация:</label>
                    <input value="${cat.description}" name="description" type="text" class="form-control">
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" name="favourite" class="form-check-input" id="exampleCheck1" checked=${cat.favourite}>
                    <label class="form-check-label" for="exampleCheck1">Фаворит?</label>
                </div>
                <div class="mb-3">
                    <label>Ссылка на фото:</label>
                    <input value="${cat.img_link}" name="img_link" type="text" class="form-control">
                </div>
                <button data-action="updateCat" type="button" class="btn btn-primary">Изменить</button>
                <button type="button" data-action="cancelUpdate" class="btn btn-primary">Отмена</button>
            </form>
        </div>`





///////////////////////////////////////////////////////

const api1 = new APIkotiki('https://sb-cats.herokuapp.com/api/2/Marina-A-G/')

api1.getAllCats().then((responseFromBackend) => {
    //console.log(responseFromBackend.data)
    //console.log($wr)
    responseFromBackend.data.forEach((cat) =>
        $wr.insertAdjacentHTML('beforeend', generateHTMLTemplateForCat(cat)))

}).catch(() => {
    //НАПИСАТЬ УВЕДОМЛЕНИЕ ОБ ОШИБКЕ
})



///////////////////////////////////////////////////////////

// РЕАГИРОВАНИЕ НА СОБЫТИЯ  -  EVENT LISTENER'Ы

$wr.addEventListener('click', (event) => {
    //console.log(event.target.dataset.action)
    switch (event.target.dataset.action) {
        case 'delete': {
            const $cardwr = event.target.closest('[data-cardid]')
            //найти ближайшего родителя, для которорго совпадут условия, поиск от элемента и вверх
            const catId = $cardwr.dataset.cardid
            let result = confirm('Вы точно хотите удалить этого милого котика?');
            if (result) {
                api1.deleteCat(catId).then(() => {
                    $cardwr.remove()
                }).catch(() => { })
                //ДОПОЛНИТЬ ДЕЙСТВИЯ ДЛЯ ОШИБКИ В УДАЛЕНИИ
                //.catch(alert) у Семена в коде
            }
            break
        }
        case 'details': {
            const $cardwr = event.target.closest('[data-cardid]')
            const catId = $cardwr.dataset.cardid
            //console.log($cardwr, catId, Number(catId))
            api1.getOneCat(catId).then((responseOneCat) => {
                console.log(responseOneCat.data)
                $showModalWr.insertAdjacentHTML('afterbegin', generateHTMLTemplateForCatShow(responseOneCat.data))
                $modalsWr.classList.remove('hidden')
                $showModalWr.classList.remove('hidden')
            })
            break;
        }
        default: break
    }
})



document.forms.add_cat.addEventListener('submit', (event) => {
    event.preventDefault()
    //console.log(event.target == 'form')
    const newCatData = Object.fromEntries(new FormData(event.target).entries())
    newCatData.id = +newCatData.id  //==Number(catData.id)
    newCatData.age = +newCatData.age
    newCatData.rate = +newCatData.rate
    newCatData.favourite = newCatData.favourite == 'on'

    api1.getAllCatsID().then((responseIds) => {
        console.log(responseIds.data)
        if (responseIds.data.indexOf(newCatData.id) != -1)
            alert("Кот с таким ID уже есть в базе")
        else {
            api1.addCat(newCatData).then(() => {

                $wr.insertAdjacentHTML('beforeend', generateHTMLTemplateForCat(newCatData))
                $modalsWr.classList.add('hidden')
                $addModalWr.classList.add('hidden')
                event.target.reset()
            }
            ).catch(alert)
        }
    })

})

document.forms.add_cat.addEventListener('input', (event) => {
    const formDataObj = Object.fromEntries(new FormData(document.forms.add_cat).entries())
    console.log(formDataObj)
    localStorage.setItem(document.forms.add_cat.name, JSON.stringify(formDataObj))
})

//document.forms.add_cat.addEventListener('')


$btnOpenModal.addEventListener('click', () => {
    $modalsWr.classList.remove('hidden')
    $addModalWr.classList.remove('hidden')

    const rawFormDataFromLS = localStorage.getItem(document.forms.add_cat.name)
    const formDataFromLS = rawFormDataFromLS ? JSON.parse(rawFormDataFromLS) : undefined

    console.log(formDataFromLS)

    if (formDataFromLS) {
        Object.keys(formDataFromLS).forEach(key => {
            document.forms.add_cat[key].value = formDataFromLS[key]
        })
    }

})

$showModalWr.addEventListener('click', (event) => {
    //event.preventDefault()
    switch (event.target.dataset.action) {
        case 'closeShow': {
            //console.log(event.target.dataset.catId)
            $showModalWr.firstElementChild.remove()
            if ($showModalWr.children.length > 0) {
                $showModalWr.firstElementChild.remove()
            }
            //это значит, что форма на изменение тоже былаоткрыта, и ее тоже надо удалить

            $modalsWr.classList.add('hidden')
            $showModalWr.classList.add('hidden')
            break
        }
        case 'changeFromShow': {
            const $cardwr = event.target.closest('[data-cardid]')
            if ($showModalWr.children.length == 1) {
                const catId = $cardwr.dataset.cardid
                api1.getOneCat(catId).then((responseOneCat) => {
                    $showModalWr.insertAdjacentHTML('beforeend', generateHTMLTemplateForCatUpdate(responseOneCat.data))
                })
            }
            break;
        }
        case 'cancelUpdate': {
            $showModalWr.lastElementChild.remove()
            break
        }
        case 'updateCat': {
            const $cardwr = event.target.closest('[data-cardid]')
            const updCatData = Object.fromEntries(new FormData(event.target.parentNode).entries())
            console.log(updCatData)
            updCatData.age = +updCatData.age
            updCatData.rate = +updCatData.rate
            updCatData.favourite = updCatData.favourite == 'on'

            api1.updateCat($cardwr.dataset.cardid, updCatData).then(() => {
                //$wr.insertAdjacentHTML('beforeend', generateHTMLTemplateForCat(updCatData))
                //alert('Данные изменены')
                $modalsWr.classList.add('hidden')
                $showModalWr.classList.add('hidden')
                $showModalWr.lastElementChild.remove()
                $showModalWr.lastElementChild.remove()

            })
            break
        }

        default: break
    }
})