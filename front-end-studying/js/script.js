const apiLink = "http://127.0.0.1:8000/api/products"

function updatePage( compasionParameter, message ) {
    if ( compasionParameter ) {
        let h2 = document.querySelector('div.messages h2')
        h2.innerText = message
        document.querySelector('div.messages').appendChild(h2)

        mainRequisition()
    }
}

// HTTP requisition
async function mainRequisition () {
    const options = {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
    }

    const requisition = await fetch ( apiLink, options )
    const response = await requisition.json()

    createList(response.products)
}

async function requisition ( HTTPmethod, id = null, requisition = null) {
    // receiveing or sending commands to the serve
    const optionsNoJson = {
        method: HTTPmethod,
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
        }
    }

    // sending data to the serve
    const optionsJson = {
        method: HTTPmethod,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requisition)
    }

    // GET one product only
    if ( HTTPmethod === 'GET' ) {
        let requisition = await fetch ( `${apiLink}/${id}`, optionsNoJson )
        let response = await requisition.json()

        fillForm(response.product)
    }

    // POST
    else if ( HTTPmethod === 'POST' ) {
        let requisition = await fetch ( apiLink, optionsJson )
        let response = await requisition.json()

        updatePage( response.status, response.message )
    }

    // PUT
    else if ( HTTPmethod === 'PUT') {
        let requisition = await fetch( `${apiLink}/${id}`, optionsJson )
        let response = await requisition.json()

        updatePage( response.status, response.message )
    }

    // DELETE
    else if ( HTTPmethod === 'DELETE' ) {
        let requisition = await fetch ( `${apiLink}/${id}`, optionsNoJson )
        let response = await requisition.json()
        
        updatePage(response.status, response.message)
    }
}

mainRequisition()


// Fields validation
function validationFields (className, id) {
    let allInput = document.querySelectorAll(`form.${className} input[type='text'], form.${className} input[type='number']`)

    for ( let index = 0; index < allInput.length; index += 1 ) {
        allInput[index].addEventListener ('blur', () => {
            if ( allInput[index].type === "text" ) {
                if ( allInput[index].value.length <= 4 ) {
                    let span = allInput[index].parentElement.querySelector('span')
                    span.innerText = "This field need, at lest, 4 characters!"
                }
            }
            else {
                if ( allInput[index].value < 1) {
                    let span = allInput[index].parentElement.querySelector('span')
                    span.innerText = "This field required a number bigger than 0!"
                }
            }
        })
    }

    // checking if it´s creating a new product or changing one
    className === 'put-form' ? sendData('PUT', id, className) : sendData('POST', null, className)
}

function sendData (HTTPmethod, id, className ) {
    let buttonClick = document.querySelector(`form.${className} button`)

    buttonClick.addEventListener('click', () => {
        let allInputPost = document.querySelectorAll(`form.${className} input[type='text'], form.${className} input[type='number'], form.${className} input[type='radio']:checked`)

        let data = {
            name: String(allInputPost[0].value),
            category: String(allInputPost[1].value),
            quantity: Number(allInputPost[2].value)
        }
    
        if ( (data.name <= 4) || (data.name === null) || (data.category <= 4) || (data.category === null) ) {
            console.log("preencha o formulario, arrombado!")
        }
    
        else if ( data.quantity < 1 || data.quantity === null ) {
            console.log("preencha o formulario, arrombado!")
        }
    
        else {
            requisition( HTTPmethod, id, data )
        }
    })
}


// HTML manipulation
function createList ( content ) {
    let tbody = document.createElement('tbody')

    for ( let index = 0; index < content.length; index += 1 ) {
        let tr = createContent(content[index])
        tbody.appendChild(tr)
    }
    document.querySelector('div.list table tbody').replaceWith(tbody)
}

function createButtons ( id ) {
    let buttons = createElements(2, 'button')

    buttons[0].innerHTML = `<i class="far fa-edit"></i>`
    buttons[0].setAttribute('type', 'button')
    buttons[0].setAttribute('onclick', `requisition('GET', ${id}, null), validationFields('put-form', ${id})`)
    buttons[0].setAttribute('class', 'edit-product')

    buttons[1].innerHTML = `<i class="far fa-trash-alt"></i>`
    buttons[1].setAttribute('type', 'button')
    buttons[1].setAttribute('onclick', `requisition('DELETE', ${id})`)
    buttons[1].setAttribute('class', 'delete-product')

    let divButtons = document.createElement('div')
    divButtons.setAttribute('class', 'div-buttons')
    divButtons.appendChild(buttons[0])
    divButtons.appendChild(buttons[1])

    return divButtons
}

function createContent ( content ) {
    const th = createElements(5, 'th')
    
    th[0].innerText = content.id
    th[1].innerText = content.name
    th[2].innerText = content.category
    th[3].innerText = content.quantity
    th[4].appendChild(createButtons(content.id))

    let tr = document.createElement('tr')
    for ( let index = 0; index < th.length; index += 1 ) {
        tr.appendChild(th[index])
    }

    return tr
}

function createElements ( quantity, element ) {
    const elementArray = []

    for ( let index = 0; index < quantity; index += 1 ) {
        elementArray[index] = document.createElement(element)
    }

    return elementArray
}


// open Put modal
function openModal (idModal) {
    const modal = document.getElementById(idModal)
    modal.classList.add('show')

    modal.addEventListener('click', (event) => {
        if ( event.target.id == idModal || event.target.className == "close" || event.target.className == "fas fa-times" )
        {
            modal.classList.remove('show')
        }
    })
}

// fill the PUT form
function fillForm (content) {
    let allInputPut = document.querySelectorAll(`form.put-form input[type='text'], form.put-form input[type='number']`)

    let firstIndex = null
    for ( let index in content ) {
        firstIndex = index
    }

    for ( let index in content[firstIndex] ) {
        if ( document.querySelector(`.put-form #${index}`) ) {
            document.querySelector(`#${index}`).value = content[firstIndex][index]
        }
    }

    let categorys = document.querySelectorAll("input.category")
    for ( let index = 0; index < categorys.length; index += 1 ) {
        if ( categorys[index].value === content[firstIndex].category ) {
            categorys[index].checked = true
            return openModal('change-product')       
        }
    }
}
