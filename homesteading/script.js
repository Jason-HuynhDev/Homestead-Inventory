const itemInput = document.querySelector('#item-input')
const quantity = document.querySelector('#amount')
const date = document.querySelector('#date')
const table = document.querySelector('.table')
const form = document.querySelector('#form')
const template = document.querySelector('#table-template')
const LOCAL_STORAGE_PREFIX = 'HOMESTEAD_INVENTORY_TABLE'
const TABLE_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-rows`
let savedTableItems = loadTable()
savedTableItems.forEach(renderTableItem)


form.addEventListener('submit', e=> {
    e.preventDefault()

    const tableItemInput = itemInput.value
    const tableQty = quantity.value
    const tableDate = date.value

    //render table item
    if(tableItemInput === "" || tableQty === "" || tableDate === "") return
    const tableItemObject = {
        name: tableItemInput,
        qty: tableQty,
        dateMade: tableDate,
        id: new Date().valueOf().toString()
    }
    savedTableItems.push(tableItemObject)
    renderTableItem(tableItemObject)

    saveTable()
    itemInput.value = ""
    quantity.value = ""
    date.value = ""
})

// function to render table items
function renderTableItem(tableStuff) {
    const templateClone = template.content.cloneNode(true)
    const itemName = templateClone.querySelector('.item-template')
    const qtyNumber = templateClone.querySelector('.qty-template')
    const dateNumber = templateClone.querySelector('.date-template')
    const tableItem = templateClone.querySelector('.table-row')
    tableItem.dataset.tableId = tableStuff.id

    itemName.innerText = tableStuff.name
    qtyNumber.innerText = tableStuff.qty
    dateNumber.innerText = tableStuff.dateMade

    table.appendChild(templateClone)
}

//load table 

function loadTable() {
    const tableItemsString = localStorage.getItem(TABLE_STORAGE_KEY)
    return JSON.parse(tableItemsString) || []
}

//saves submitted table items

function saveTable() {
    localStorage.setItem(TABLE_STORAGE_KEY, JSON.stringify(savedTableItems))
}

//increase decrease quantity



table.addEventListener('click', e => {
    if(!e.target.matches('.increaseBtn')) return

    const parent = e.target.closest('.table-row')
    const tableItemId = parent.dataset.tableId
    const targetTable = savedTableItems.find(t => t.id === tableItemId)
    let currentQty = targetTable.qty
    
    currentQty ++
    targetTable.qty = currentQty 
    
    saveTable()
    rerenderTable()
} )

table.addEventListener('click', e => {
    if(!e.target.matches('.decreaseBtn')) return

    const parent = e.target.closest('.table-row')
    const tableItemId = parent.dataset.tableId
    const targetTable = savedTableItems.find(t => t.id === tableItemId)
    let currentQty = targetTable.qty
    
    currentQty --
    targetTable.qty = currentQty 
    
    saveTable()
    rerenderTable()
} )


function rerenderTable() {
    table.innerHTML = "<tr><th>Item</th><th>Qty</th><th>Date</th><th>Dlt</th></tr> "
    savedTableItems.forEach(renderTableItem)
}

//delete table row

table.addEventListener('click', e => {
    if(!e.target.matches('.deleteBtn')) return

    const parent = e.target.closest('.table-row')
    const tableItemId = parent.dataset.tableId
    const targetTable = savedTableItems.find(t => t.id === tableItemId)
    //removes table row from current display
    parent.remove()

    //removes table item from local storage
    savedTableItems = savedTableItems.filter( tableObject => tableObject.id !== tableItemId)
    saveTable()
} )
