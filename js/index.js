document.addEventListener("DOMContentLoaded", () => {
    getListOfBooks()
  });
  
  const panel = document.querySelector('div#show-panel')
  let showBookDetails = false
  
  /******************** Liker of Book *******************/
  let userId = 1
  let currentUser = {}
  
  fetch(`http://localhost:3000/users/${userId}`)
  .then(res => res.json())
  .then(data => currentUser = data)
  .then(() => console.log('currentUser from BE', currentUser))
  /*****************************************************/
  
  function getListOfBooks() {
    fetch('http://localhost:3000/books')
      .then(res => res.json())
      .then(books => books.forEach(renderOneBook))
  }
  
  // console.log('saved currentUser:', currentUser)
  
  /************* HELPER FUNCTION TO CREATE ELEMENT ***********/
  const makeEl = el => document.createElement(el)
  const setContent = (el, content) => el.textContent = content 
  /***********************************************************/
  
  function renderOneBook(item) {
    const bookli = makeEl('li')
    setContent(bookli, item.title) 
    bookli.className = 'bookli'
  
    ///////////////////////////// HIDDEN BOOK DETAILS ////////////////////////
  
    /************** CREATING ELEMENTS FOR EVERY BOOK **************/
    const book = makeEl('div')
    const img = makeEl('img')
    const title = makeEl('h3')  
    const subTitle = makeEl('h3')
    const author = makeEl('h3')
    const p = makeEl('p')
    const ul = makeEl('ul')
    const btn = makeEl('button')
  
    img.src = item.img_url
    ul.id = 'likers-list'
  
  /************** INSERTING TEXTCONTENTS ************/
    setContent(title, item.title)
    setContent(subTitle, item.subTitle)
    setContent(author, item.author)
    setContent(p, item.description)
    setContent(btn, 'LIKE')
  
   /************ Create List of Booklikers onto DOM **************/
    const likers = item.users/////////////////////////////////////////////////////////--->
    renderLikersToList(likers, ul)
  
  /********* Get list of the Booklikers from DOM **********/
    const readers = ul.getElementsByClassName('reader') /////////////////////////////---->
  
  /********* Handle LIKE button click ********/
    btn.addEventListener('click', () => {
      console.log('Likers At Open:', likers);
      // console.log('readers on DOM:', readers)
      // console.log('uls', ul);
      
      // checkAndRemoveLikedUser(likers)
      // console.log('Likers after remove:', likers);
      // renderLikersToList(likers, ul)
      
       
      if (btn.textContent === 'LIKE') {
        btn.textContent = 'UNLIKE'
        // likers.push(currentUser)
        // console.log(currentUser.username)
        // console.log('Typeof currentUser:', typeof(currentUser))
        
        handleLikeButton(likers, currentUser)
        console.log('Likers after check and push:', likers);
        renderLikedUser(currentUser, ul)
        updateBackEndAfterLikeButton(item, likers) 
      } else {
        btn.textContent = 'LIKE'
        likers.pop(currentUser)
        console.log('Likers after pop:', likers);
        ul.lastChild.remove()
        handleUnLikeButton(currentUser)
      }
    })
    book.append(img, title, subTitle, author, p, ul, btn)
  ////////////////////// END OF HIDDEN BOOK DETAILS /////////////////////////////
  
    /********* Event listener for clicking on Book title ********/
    bookli.addEventListener('click', () => {
      showBookDetails = !showBookDetails
      if (showBookDetails) {
        book.style.display = 'block'
        panel.innerText = ''
        panel.append(book)
      } else {
        book.style.display = 'none'
      }
    })
    document.querySelector('ul#list').appendChild(bookli)
  }
  
  /********** Updating Backend Booklikers list *********/
  function updateBackEndAfterLikeButton(book, list) {
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(list)
    })
    .then(res => res.json())
    .then(data => console.log('Data from BackEnd:', data))    
  }
  
  /********** Rendering New Liker to a Booklikers' list ********/
  function renderLikedUser(user, domList) {
    const li = makeEl('li')
    setContent(li, user.username)
    li.className = 'reader'  
    domList.appendChild(li)
  }
  
  // handleLikeButton(likers, currentUser)
  function handleLikeButton(list, user) {
    console.log("List @start:", list)
    list.forEach((liker, index) => {    
      console.log('LikerID:', liker.id);
      console.log('Liker Index:', index);
      // console.log('UserID:', user.id);
  
      if(liker.id === user.id) {      
        list.splice(index, 1)
      } 
    })
    console.log("List @end:", list)
  }
  
  /********** Removing Liker from Backend Bookliker's list ******/
  // handleUnLikeButton(likers, currentUser)
  function handleUnLikeButton(user) {
    fetch(`http://localhost:3000/books/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => console.log('Updated Users:', data))
  }
  
  function renderLikersToList(likers, ul) {
    likers.forEach(liker => {
      const li = makeEl('li')
      setContent(li, liker.username)
      li.className = 'reader'
      ul.appendChild(li)
    })
  }