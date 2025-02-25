const myAds = document.getElementById("myAds")
const allAds = document.getElementById("allAds")
const createAdButton = document.getElementById("createAdButton")
const regMenu = document.getElementById("regMenu")
const loginMenu = document.getElementById("loginMenu")
const logoutMenu = document.getElementById("logoutMenu")
const createCat = document.getElementById("createCat")
const catSelect = document.getElementById("dropdownMenu")

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

window.addEventListener("DOMContentLoaded", async () => {
      const token = localStorage.getItem("token")
      if (token) {
            hideEverything("showAllAds","logoutMenu","navbar","createAdButton","myAds","createCat","dropdownMenu")
            showAllAds(token)
            showCategoryMenu()
      }
      else {
            hideEverything("regMenu", "loginWindow")
            const loginBtn = document.getElementById("loginBtn")
            loginBtn.addEventListener("click", () => {
                  loginUser()
            })
      }
})

catSelect.addEventListener("change", () => {
      categorySearch()
})

createCat.addEventListener("click", () => {
      const token = localStorage.getItem("token")
      hideEverything("logoutMenu","navbar","createAdButton","myAds","createCategory","dropdownMenu")
      const categoryBtn = document.getElementById("categoryBtn")
      categoryBtn.addEventListener("click", () => {
            createCategory(token)
      })
      
})

logoutMenu.addEventListener("click", () => {
      localStorage.removeItem('token')
      location.reload()
})

allAds.addEventListener("click", () => {
      const token = localStorage.getItem("token")
      hideEverything("showAllAds","logoutMenu","navbar","createAdButton","myAds","createCat","dropdownMenu")
      showAllAds(token)
})

myAds.addEventListener("click", () => {
      const token = localStorage.getItem("token")
      hideEverything("showUserAds","logoutMenu","navbar","createAdButton","allAds","createCat","dropdownMenu")
      showUserAds(token)
})

createAdButton.addEventListener("click", async () => {
      hideEverything("createAdSection","navbar","myAds","allAds","createCat","dropdownMenu")
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
      postAdButton.addEventListener("click", (event) => {
            postAd()
            setTimeout(() => {
                  hideEverything("loginWindow")
            }, 200) 
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

async function categorySearch() {
      const dropdownMenu = document.getElementById("dropdownMenu")
      const token = localStorage.getItem("token")
      const ads = document.querySelectorAll(".adCard")
      ads.forEach(element => {
            element.remove()
      })

      const showUserAds = document.getElementById("showUserAds")
      const catAds = await fetch('http://localhost:5001/category/search', {
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

async function createCategory(token) {
      const category = document.getElementById("categoryInput").value.trim()
      
      if (!category) {
            alert("Uzpildykite lauka.")
      }

      try {
            const createCategory = await fetch('http://localhost:5001/category', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({category})
            })
            console.log(createCategory)
      }
      catch (error){
            alert("Klaida.", error)
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
            console.log(category)
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
      console.log(deletedId)
      showUserAds(token)
}

async function getCategory() {
      const token = localStorage.getItem("token")
      const categoryData = await fetch('http://localhost:5001/category/list', {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
            }})
            const category = await categoryData.json()
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
                  <li class="list-group-item">Kategorija:${data[key].category} </li>
                  <li class="list-group-item">Ikele: ${userData.name}</li> 
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
            "showUserAds"
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

// function hideEverythingOld() {
//       const registerWindow = document.getElementById("registerWindow")
//       const commentSection = document.getElementById("commentSection")
//       const sectionAdShow = document.getElementById("sectionAdShow")
//       const loginWindow = document.getElementById("loginWindow")
//       const createAdSection = document.getElementById("createAdSection")
//       const createCategory = document.getElementById("createCategory")
//       const commentWindow = document.getElementById("commentWindow")
//       const showAllAds = document.getElementById("showAllAds")
//       const showFavorites = document.getElementById("showFavorites")
//       const showCategories = document.getElementById("showCategories")
//       const createCat = document.getElementById("createCat")
//       const showUsers = document.getElementById("showUsers")
//       const allAds = document.getElementById("allAds")
//       const createAdButton = document.getElementById("createAdButton")
//       const myAds = document.getElementById("myAds")
//       const favorites = document.getElementById("favorites")
//       const dropdownMenu = document.getElementById("dropdownMenu")
//       const navbar = document.getElementById("navbar")
//       const loginMenu = document.getElementById("loginMenu")
//       const regMenu = document.getElementById("regMenu")
//       const logoutMenu = document.getElementById("logoutMenu")
//       const categoryWindow = document.getElementById("createCategory")
//       const usersWindow = document.getElementById("usersWindow")
//       const showUserAds = document.getElementById("showMyAds")

//       showUserAds.hidden = true
//       showCategories.hidden = true
//       showFavorites.hidden = true
//       showAllAds.hidden = true
//       registerWindow.hidden = true
//       sectionAdShow.hidden = true
//       loginWindow.hidden = false
//       createAdSection.hidden = true
//       createCategory.hidden = true
//       commentWindow.hidden = true
//       commentSection.hidden = true

//       navbar.hidden = false
//       createAdButton.hidden = true
//       myAds.hidden = true
//       favorites.hidden = true
//       dropdownMenu.hidden = true
//       createCat.hidden = true
//       showUsers.hidden = true
//       allAds.hidden = true

//       loginMenu.hidden = false
//       regMenu.hidden = false
//       logoutMenu.hidden = true

//       categoryWindow.hidden = true
//       usersWindow.hidden = true
// }




