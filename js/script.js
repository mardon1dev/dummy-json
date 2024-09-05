let TOKEN = "7509773382:AAEtgRJ0Noti74ipG-GoTRGmaozGNwCYn0c";
let CHAT_ID = "-1002173495409";
let HTTP = `https://api.telegram.org/bot${TOKEN}/sendPhoto`;

let productsList = document.querySelector(".products")

// Search
let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("keyup", (e) => {
    e.preventDefault();
    let search = searchForm.querySelector(".search-input").value.trim();
    if (search) {
        axios.get(`https://dummyjson.com/products/search?q=${search}`)
        .then(response => {
            let products = response.data.products;
            if (products.length == 0) {
                productsList.innerHTML = `
                <p>No item is found</p>
                `          
            } else {
                renderData(products)
            }
        })
    }
    else{
        getData()
    }
})

function getData () {
    axios.get(`https://dummyjson.com/products`).then(res=>{
    let data = res.data.products;
    renderData(data)
})
}
getData();

function renderData (arr){
    productsList.innerHTML = "";
    arr.forEach((item, index) => {
        let product = document.createElement("div");
        product.classList.add("product");
        product.setAttribute("id", index)
        product.innerHTML = `
        <img src="${item.images[0]}" alt="${item.description}" width="200" height="150"/>
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <div class="product-bottom">
        <p>Price: <srtong>$${item.price}</srtong></p>
        <button onclick="sendMessage(${item.id})" >Sent to telegram</button>
        </div>
        `
        productsList.appendChild(product);
    })
}

let notification = document.querySelector(".notification");

function sendMessage(id) {
    axios.get(`https://dummyjson.com/products/${id}`).then(res => {
    let product = res.data;
    let message = `
    <b>New product:</b>
    <b>${product.title}</b>
    <b>${product.description}</b>
    <b>Price: ${product.price}</b>
    `;
    
    axios.post(HTTP, {
        chat_id: CHAT_ID,
        caption: message,
        parse_mode: "HTML",
        photo: product.images[0],
    })
    .then(() => {
        console.log("Message sent");
        notification.textContent = "Message sent";
        notification.style.display = "block";
        notification.classList.add("green")
        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    })
    .catch(error => {
        notification.textContent = "Could not sent a message";
        notification.style.display = "block";
        notification.classList.add("red")
        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
        console.error("Error sending message:", error);
    });
})
.catch(error => {
    console.error("Error fetching product:", error);
});
}
