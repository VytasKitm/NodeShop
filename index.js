const myAds = document.getElementById("myAds")
const allAds = document.getElementById("allAds")
const createAdButton = document.getElementById("createAdButton")
const regMenu = document.getElementById("regMenu")
const loginMenu = document.getElementById("loginMenu")
const logoutMenu = document.getElementById("logoutMenu")
const createCat = document.getElementById("createCat")
const catSelect = document.getElementById("dropdownMenu")
const showUsersInfo = document.getElementById("showUsers")

async function getData() {
      const token = localStorage.getItem("token")
      const user = await fetch('http://localhost:5001/users/user', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
            }
      });
      console.log(user)
      const userParse = await user.json();

      console.log(userParse)
}
// getData()

window.addEventListener("DOMContentLoaded", async () => {
      checkUser()
})

showUsersInfo.addEventListener("click", async () => {
      hideEverything("logoutMenu","navbar","createAdButton","myAds","dropdownMenu","usersWindow","createCat","allAds")
      showUsers()
})

catSelect.addEventListener("change", async () => {
      const token = localStorage.getItem("token")
      const user = await getCurrentUser()
      console.log(user)
            if (user.role === "admin") {
                  hideEverything("showCategories","logoutMenu","navbar","createAdButton","myAds","createCat","dropdownMenu","showUsers")
                  categorySearch()
                  showCategoryMenu()
            }
            else {
                  hideEverything("showCategories","logoutMenu","navbar","createAdButton","myAds","dropdownMenu")
                  categorySearch()
                  showCategoryMenu()
            }
})

createCat.addEventListener("click", async () => {
      const token = localStorage.getItem("token")
      showCategoryTable(token)
      hideEverything("logoutMenu","navbar","createAdButton","myAds","createCategory","dropdownMenu", "adminAds","showUsers")
      const categoryBtn = document.getElementById("categoryBtn")
      categoryBtn.addEventListener("click", () => {
            createCategory(token)
      })
})

logoutMenu.addEventListener("click", () => {
      localStorage.removeItem('token')
      location.reload()
})

allAds.addEventListener("click", async () => {
      const token = localStorage.getItem("token")
      const user = await getCurrentUser()
            if (user.role === "admin") {
                  hideEverything("showAdminAds","logoutMenu","navbar","createAdButton","myAds","createCat","dropdownMenu","showUsers")
                  showAdminAds(token)
                  showCategoryMenu()
            }
            else {
                  hideEverything("showAllAds","logoutMenu","navbar","createAdButton","myAds","dropdownMenu")
                  showAllAds(token)
                  showCategoryMenu()
            }
})

myAds.addEventListener("click", async () => {
      const token = localStorage.getItem("token")
      const user = await getCurrentUser()
      console.log(user)
            if (user.role === "admin") {
                  hideEverything("showUserAds","logoutMenu","navbar","createAdButton","allAds","createCat","dropdownMenu","showUsers")
                  showUserAds(token)
                  showCategoryMenu()
            }
            else {
                  hideEverything("showUserAds","logoutMenu","navbar","createAdButton","allAds","dropdownMenu")
                  showUserAds(token)
                  showCategoryMenu()
            }
})

createAdButton.addEventListener("click", async () => {
      const token = localStorage.getItem("token")
      const user = await getCurrentUser()
      console.log(user)
            if (user.role === "admin") {
                  hideEverything("createAdSection","logoutMenu","navbar","myAds","allAds","createCat","dropdownMenu","showUsers")
                  showCategoryMenu()
            }
            else {
                  hideEverything("createAdSection","logoutMenu","navbar","myAds","allAds","dropdownMenu")
                  showCategoryMenu()
            }
      const adCategory = document.getElementById("adCategory")
      const category = await getCategory()
            adCategory.innerHTML = ''
            adCategory.innerHTML = "<option selected>Visos Kategorijos</option>"
            Object.keys(category).forEach((key) => {
                  adCategory.innerHTML += `<option value="${category[key].category}">${category[key].category}</option>`
                  console.log(category[key])
            })
            console.log(category)
      const postAdButton = document.getElementById("postAdButton")
      postAdButton.disabled = false
      postAdButton.addEventListener("click", async (event) => {
            await postAd()
            postAdButton.disabled = true
      })
})

regMenu.addEventListener("click", () => {
      hideEverything("registerWindow","loginMenu")
      const signUpBtn = document.getElementById("signupBtn")
      signUpBtn.addEventListener("click", (event) => {
            event.preventDefault()
            registerUser()
            setTimeout(() => {
                  hideEverything("loginWindow")
            }, 200) 
      })
})

loginMenu.addEventListener("click", () => {
      hideEverything("loginWindow","regMenu")
      const loginBtn = document.getElementById("loginBtn")
      loginBtn.addEventListener("click", () => {
            loginUser()
      })
})

async function showUsers() {
      const token = localStorage.getItem("token")
      const usersTable = document.getElementById("usersTable")
      usersTable.innerHTML = ""
      const usersData = await fetch(`http://localhost:5001/users/list`, {
      method: 'GET',
      headers: {'Authorization': `Bearer ${token}`},
      })
      const users = await usersData.json()
      Object.keys(users).forEach((key) => {
            if (users[key].role != "admin") {
                  const tr = document.createElement("tr")
                  const tdName = document.createElement("td")
                  const tdEmail = document.createElement("td")
                  const tdBtn = document.createElement("td")
                  const deleteButton = document.createElement("button")
                  deleteButton.textContent = "Delete"
                  deleteButton.type = "submit"
                  deleteButton.id = users[key]._id
                  deleteButton.classList.add("btn","btn-primary","btn-block")

                  deleteButton.addEventListener("click", function(event) {
                        event.preventDefault()
                        deleteUser(token, this.id)
                  })

                  tdName.textContent = users[key].name
                  tdEmail.textContent = users[key].email
                  tdBtn.append(deleteButton)
                  tr.append(tdName,tdEmail, tdBtn)
                  usersTable.appendChild(tr)
            }

})
}

async function deleteUser(token, id) {
      await fetch(`http://localhost:5001/users/delete/${id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`},
      })
      showUsers(token)
}

async function checkUser() {
      const token = localStorage.getItem("token")
      const user = await getCurrentUser()
      if (token) {
            if (user.role === "admin") {
                  hideEverything("showAdminAds","logoutMenu","navbar","createAdButton","myAds","createCat","dropdownMenu","showUsers")
                  showAdminAds(token)
                  showCategoryMenu()
            }
            else {
                  hideEverything("showAllAds","logoutMenu","navbar","createAdButton","myAds","dropdownMenu")
                  showAllAds(token)
                  showCategoryMenu()
            }
      }
      else {
            hideEverything("regMenu", "loginWindow")
            const loginBtn = document.getElementById("loginBtn")
            loginBtn.addEventListener("click", () => {
                  loginUser()
            })
      }
}

async function getCurrentUser() {
      const token = localStorage.getItem("token")
      const currentUserDiv = document.getElementById("currentUser")
      if (token) {
                  const userProm = await fetch(`http://localhost:5001/users/user`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
            })
            const user = await userProm.json()
            currentUserDiv.innerHTML = `Prisijunge  ${user.name}.         `
            return user
      }

}

async function categorySearch() {
      const dropdownMenu = document.getElementById("dropdownMenu")
      const token = localStorage.getItem("token")
      const ads = document.querySelectorAll(".adCard")

      ads.forEach(element => {
            element.remove()
      })
      console.log(dropdownMenu.value)
      const showCategories = document.getElementById("showCategories")
      const catAds = await fetch(`http://localhost:5001/category/search/${dropdownMenu.value}`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
      })
      console.log(catAds)
      const data = await catAds.json()
      console.log(data)
      for (let key in data) {
            console.log(key)
            const newAdCard = document.createElement("div")
            console.log(data[key]._id)
            const userData = await getUserById(data[key].user, token)
            console.log(userData)
            newAdCard.classList.add("card","border-#ff0909","m-3","adCard")
            newAdCard.style.maxWidth = "25rem"
            newAdCard.innerHTML = `
            <img src="${data[key].photo}" class="card-img-top" alt="${data[key].title}">
            <div class="card-body">
                  <h5 class="card-title">${data[key].title}</h5>
                  <p class="card-text">${data[key].description}</p>
            </div>

            <ul class="list-group list-group-flush">
                  <li class="list-group-item">Kategorija: ${data[key].category} </li>
                  <li class="list-group-item">Ikele: ${userData.name}</li> 
            </ul>
            <div class="card-footer">
                  <small>Kaina: ${data[key].price}</small>
            </div>`

            // const deleteAdButton = document.createElement("button")
            // deleteAdButton.innerHTML = "<i class='fs-6 bi bi-trash'></i>"
            // deleteAdButton.id = `delete${key}`
            // deleteAdButton.classList.add("btn","bg-white", "btn-sm")
            // deleteAdButton.style.position = "absolute"
            // deleteAdButton.style.top = "5px";
            // deleteAdButton.style.right = "5px";
            // deleteAdButton.addEventListener("click", function (event) {
            //       event.preventDefault()
            //       deleteAd(token, data[key]._id)
            // })
            // newAdCard.append(deleteAdButton)

            showCategories.appendChild(newAdCard)
            }
}

async function deleteCategory(token, id) {
      const deletedId = await fetch(`http://localhost:5001/category/delete/${id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`},
      })
      showCategoryTable(token)
}

async function showCategoryMenu() {
      const category = await getCategory()
      const dropdownMenu = document.getElementById("dropdownMenu")
      dropdownMenu.innerHTML = ''
      dropdownMenu.innerHTML = "<option selected>Visos Kategorijos</option>"
      Object.keys(category).forEach((key) => {
            console.log(key)
            console.log(category[key].category)
      dropdownMenu.innerHTML += `<option value="${category[key].category}">${category[key].category}</option>`
      })
}

async function showCategoryTable(token) {
      const categoryTable = document.getElementById("categoryTable")
      categoryTable.innerHTML = ""
      const catData = await getCategory(token)
      Object.keys(catData).forEach((key) => {
            const tr = document.createElement("tr")
            const tdName = document.createElement("td")
            const tdBtn = document.createElement("td")
            tdBtn.classList.add("tdBtn")
            const deleteButton = document.createElement("button")
            deleteButton.textContent = "Delete"
            deleteButton.type = "submit"
            deleteButton.id = catData[key]._id
            deleteButton.classList.add("btn","btn-primary","btn-block")
            
            deleteButton.addEventListener("click", function(event) {
                  event.preventDefault()
                  deleteCategory(token, this.id)
            })

            tdName.textContent = catData[key].category
            tdBtn.append(deleteButton)
            tr.append(tdName, tdBtn)
            categoryTable.appendChild(tr)
})
}

async function createCategory(token) {
      const category = document.getElementById("categoryInput").value.trim()
      
      if (!category) {
            alert("Uzpildykite lauka.")
      }
      const searchResult = await categorySearchByName(token, category)
      if (searchResult == 0) {
            try {
                  const createCategory = await fetch('http://localhost:5001/category', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({category})
                  })
                  showCategoryTable(token)
            }
            catch (error){
                  alert("Klaida.", error)
            }
      }
      else {
            alert("tokia kategorija jau yra")
      }

}

async function postAd() {
      const token = localStorage.getItem("token")
      const title = document.getElementById("adName").value.trim()
      const category = document.getElementById("adCategory").value
      const description = document.getElementById("adDescription").value.trim()
      const price = document.getElementById("adPrice").value.trim()
      const photo = document.getElementById("adPhoto").value.trim()

      if (!title || !category || !description || !price || !photo) {
            alert("uzpildykite visus laukus")
      }
      try { 
            console.log(category)
            const createAd = await fetch('http://localhost:5001/ads', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({title, category, description, price, photo})
            })
            const createAdParse = await createAd.json()

            if (!createAd.ok) {
                  alert(createAdParse.message || "Sukurti skelbimo nepavyko.")
            }
            else {
                  location.reload()
            }
      }
      catch (error) {
            console.log('Error', error);
      } 

}

async function registerUser() {
      const name = document.getElementById("regName").value.trim()
      const email = document.getElementById("regEmail").value.trim()
      const password = document.getElementById("regPassword").value.trim()

      if (!name || !email || !password) {
            alert("Please fill out all fields"); // Or display an error message in the UI
            return; // Stop the function if validation fails
      }

      try {
            const regUser = await fetch('http://localhost:5001/users', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({name, email, password})
            })

            const regUserParse = await regUser.json()

            if (!regUser.ok) {
                  alert(regUserParse.message || "Registration failed")
                  throw new Error(`HTTP error! Status: ${regUser.status}`)
            }
            console.log(regUserParse.token)
            // localStorage.setItem('token', `${regUserParse.token}`);
            location.reload()
      }
      catch (error) {
            alert("Netinkamas email")
            console.log('Error', error);
      } 
}

async function loginUser() {
      const email = document.getElementById("loginEmail").value.trim()
      const password = document.getElementById("loginPassword").value.trim()

      if (!email || !password) {
            alert("Please fill out all fields");
            return;
      }

      try {
            const loginUser = await fetch('http://localhost:5001/users/login', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({email, password})
            })

            const loginUserParse = await loginUser.json()

            if (!loginUser.ok) {
                  alert(loginUserParse.message || "Registration failed")
                  throw new Error(`HTTP error! Status: ${loginUser.status}`)
            }
            console.log(loginUserParse.token)
            localStorage.setItem('token', `${loginUserParse.token}`);
            console.log(`Prisijungta!!!! ${loginUserParse.name}`)
            location.reload()
      }
      catch (error) {
            alert("Blogas email arba slaptazodis")
      } 
}

async function deleteAd(token, id) {
      const deletedId = await fetch(`http://localhost:5001/ads/${id}`, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer ${token}`},
      })
      showUserAds(token)
      showAdminAds(token)
}

async function getCategory(token) {
      // const token = localStorage.getItem("token")
      const categoryData = await fetch('http://localhost:5001/category/list', {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
            }})
            const category = await categoryData.json()
            return category 
}

async function categorySearchByName(token, name) {
      const categoryByNameData = await fetch(`http://localhost:5001/category/name/${name}`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
      })
      const category = await categoryByNameData.json()
      return category
}

async function getUserById(id, token) {
      try {
            const user = await fetch(`http://localhost:5001/users/${id}`, {
                  method: 'GET',
                  headers: {'Authorization': `Bearer ${token}`},
                  })
            
            if (user.ok) {
                  const data = await user.json()
                  return data
            }
      }
      catch (error) {
            console.error("Error", error)
      }
      
}

async function showAllAds(token) {
      const ads = document.querySelectorAll(".adCard")
      ads.forEach(element => {
            if(element) {
                 element.remove() 
            }
      })

      const showAllAds = document.getElementById("showAllAds")

      const allAds = await fetch('http://localhost:5001/ads/all', {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
      })
      console.log(allAds)
      const data = await allAds.json()
      console.log(data)
      for (let key in data) {
            console.log(key)
            const newAdCard = document.createElement("div")
            console.log(key)
            const userData = await getUserById(data[key].user, token)
            let userName
            if (userData == null) {
                  userName = "Vartotojas pasalintas."
            }
            else {
                  userName = userData.name
            }
            newAdCard.classList.add("card","border-#ff0909","m-3","adCard")
            newAdCard.style.maxWidth = "25rem"
            newAdCard.innerHTML = `
            <img src="${data[key].photo}" class="card-img-top" alt="${data[key].title}">
            <div class="card-body">
                  <h5 class="card-title">${data[key].title}</h5>
                  <p class="card-text">${data[key].description}</p>
            </div>

            <ul class="list-group list-group-flush">
                  <li class="list-group-item">Kategorija:${data[key].category} </li>
                  <li class="list-group-item">Ikele: ${userName}</li> 
            </ul>
      
            <div class="card-footer">
                  <small>Kaina: ${data[key].price}</small>
            </div>`
      
            showAllAds.appendChild(newAdCard)
            }
}

async function showUserAds(token) {
      const ads = document.querySelectorAll(".adCard")
      ads.forEach(element => {
            element.remove()
      })

      const showUserAds = document.getElementById("showUserAds")
      const userAds = await fetch('http://localhost:5001/ads/', {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
      })
      console.log(userAds)
      const data = await userAds.json()
      console.log(data)
      for (let key in data) {
            console.log(key)
            const newAdCard = document.createElement("div")
            console.log(data[key]._id)
            const userData = await getUserById(data[key].user, token)
            let userName
            if (userData == null) {
                  userName = "Vartotojas pasalintas."
            }
            else {
                  userName = userData.name
            }
            newAdCard.classList.add("card","border-#ff0909","m-3","adCard")
            newAdCard.style.maxWidth = "25rem"
            newAdCard.innerHTML = `
            <img src="${data[key].photo}" class="card-img-top" alt="${data[key].title}">
            <div class="card-body">
                  <h5 class="card-title">${data[key].title}</h5>
                  <p class="card-text">${data[key].description}</p>
            </div>

            <ul class="list-group list-group-flush">
                  <li class="list-group-item">Kategorija: ${data[key].category} </li>
                  <li class="list-group-item">Ikele: ${userName}</li> 
            </ul>
            <div class="card-footer">
                  <small>Kaina: ${data[key].price}</small>
            </div>`

            const deleteAdButton = document.createElement("button")
            deleteAdButton.innerHTML = "<i class='fs-6 bi bi-trash'></i>"
            deleteAdButton.id = `delete${key}`
            deleteAdButton.classList.add("btn","bg-white", "btn-sm")
            deleteAdButton.style.position = "absolute"
            deleteAdButton.style.top = "5px";
            deleteAdButton.style.right = "5px";
            deleteAdButton.addEventListener("click", function (event) {
                  event.preventDefault()
                  deleteAd(token, data[key]._id)
            })
            newAdCard.append(deleteAdButton)

            showUserAds.appendChild(newAdCard)
            }
}

async function showAdminAds(token) {
      const ads = document.querySelectorAll(".adCard")
      ads.forEach(element => {
            element.remove()
      })

      const showAdminAds = document.getElementById("showAdminAds")
      const userAds = await fetch('http://localhost:5001/ads/all', {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`},
      })
      const data = await userAds.json()
      console.log(data)
      for (let key in data) {
            console.log(key)
            const newAdCard = document.createElement("div")
            console.log(data[key]._id)
            const userData = await getUserById(data[key].user, token)
            let userName
            if (userData == null) {
                  userName = "Vartotojas pasalintas."
            }
            else {
                  userName = userData.name
            }
            newAdCard.classList.add("card","border-#ff0909","m-3","adCard")
            newAdCard.style.maxWidth = "25rem"
            newAdCard.innerHTML = `
            <img src="${data[key].photo}" class="card-img-top" alt="${data[key].title}">
            <div class="card-body">
                  <h5 class="card-title">${data[key].title}</h5>
                  <p class="card-text">${data[key].description}</p>
            </div>

            <ul class="list-group list-group-flush">
                  <li class="list-group-item">Kategorija: ${data[key].category} </li>
                  <li class="list-group-item">Ikele: ${userName}</li> 
            </ul>
            <div class="card-footer">
                  <small>Kaina: ${data[key].price}</small>
            </div>`

            const deleteAdButton = document.createElement("button")
            deleteAdButton.innerHTML = "<i class='fs-6 bi bi-trash'></i>"
            deleteAdButton.id = `delete${key}`
            deleteAdButton.classList.add("btn","bg-white", "btn-sm")
            deleteAdButton.style.position = "absolute"
            deleteAdButton.style.top = "5px";
            deleteAdButton.style.right = "5px";
            deleteAdButton.addEventListener("click", function (event) {
                  event.preventDefault()
                  deleteAd(token, data[key]._id)
            })
            newAdCard.append(deleteAdButton)

            showAdminAds.appendChild(newAdCard)
            }
}

function hideEverything(...args) {

      const allElements = [
            "registerWindow",
            "commentSection",
            "sectionAdShow",
            "loginWindow",
            "createAdSection",
            "createCategory",
            "commentWindow",
            "showAllAds",
            "showFavorites",
            "showCategories",
            "createCat",
            "showUsers",
            "allAds",
            "createAdButton",
            "myAds",
            "favorites",
            "dropdownMenu",
            "navbar",
            "loginMenu",
            "regMenu",
            "logoutMenu",
            "usersWindow",
            "showUserAds",
            "showAdminAds"
      ]

      allElements.forEach((id) => {
            if (!args.includes(id)) {
                  const element = document.getElementById(id)
                  element.hidden = true
            }
            else {
                  const element = document.getElementById(id)
                  element.hidden = false
            }
      })
}





