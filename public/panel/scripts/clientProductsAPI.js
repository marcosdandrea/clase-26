let productTemplates
let retryCount = 0;

const fetchRetry = setInterval(()=>{
fetch("http://localhost:8080/template/products.hbs")
    .then(res => res.text())
    .then(baseTemplate => {
        productTemplates = Handlebars.compile(baseTemplate)
        clearInterval(fetchRetry)
        getProducts()
    })
    .catch((err) => {
        console.log(err)
        retryCount ++
        if (retryCount > 5){
            alert ("Hubo un problema para comunicarse con el servidor")
            clearInterval(fetchRetry)
        }
    })
}, 5000)

const sendProduct = () => {
    const productName = document.querySelector("#title").value
    const productPrice = document.querySelector("#price").value
    const fileImage = document.querySelector("#fileImage").files[0]

    const formData = new FormData();
    formData.append("title", productName)
    formData.append("price", productPrice)
    formData.append("image", fileImage)
    const URL = "/products"
    fetch(URL, {
        method: 'POST',
        body: formData
    })
        .then(res => getProducts())
        .catch((err) => console.log("No se pudo cargar el producto: " + err))
}

const getProducts = () => {
    fetch("http://localhost:8080/products/")
        .then(response => {
            if (response.status != 200) {
                console.log(response)
                return
            }
            response.json()
                .then(products => {
                    const html = productTemplates({ products });
                    document.getElementById("hbsProducts").innerHTML = html;
                })
        })
        .catch(err => console.log(err))
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnSubmit").addEventListener("click", sendProduct)
})