//create shorter name
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//create a delete button for every item
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//create mark completed button for every item
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// create an unmark completed button for every item
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//function to delete item
async function deleteItem(){
    //create shorter name
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //call delete from server side 
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //console log message
        const data = await response.json()
        console.log(data)
        //reload page
        location.reload()
    //in case of error log error message
    }catch(err){
        console.log(err)
    }
}
//function to mark item
async function markComplete(){
    //shorten name
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //call put from server side 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //console log message
        const data = await response.json()
        console.log(data)
        //reload page
        location.reload()
    //in case of error log error message
    }catch(err){
        console.log(err)
    }
}
//function to unmark item
async function markUnComplete(){
    //shorten name
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //call put from server side
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //console log message
        const data = await response.json()
        console.log(data)
        //reload page
        location.reload()
    //in case of error log error message
    }catch(err){
        console.log(err)
    }
}