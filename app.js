class Producto {

    constructor({id, nombre, precio, descripcion, img}){
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.cantidad = 1
        this.descripcion = descripcion
        this.img = img
    }

    aumentarCantidad(){
        this.cantidad++
    }

    disminuirCantidad(){
        if(this.cantidad > 1){
            this.cantidad--
            return true
        }

        return false
    }

    descripcionHTMLCarrito(){
        return `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${this.img}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${this.nombre}</h5>
                        <p class="card-text">Cantidad: <button class="btn btn-dark" id="minus-${this.id}"><i class="fa-solid fa-minus fa-1x"></i></button>${this.cantidad}<button class="btn btn-dark" id="plus-${this.id}"><i class="fa-solid fa-plus"></i></button> </p>
                        <p class="card-text">Precio: $${this.precio}</p>
                        <button class="btn btn-danger" id="eliminar-${this.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>`
    }

    descripcionHTML(){
        return `<div class="card" style="width: 18rem;">
        <img src="${this.img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${this.nombre}</h5>
            <p class="card-text">${this.descripcion}</p>
            <p class="card-text">$${this.precio}</p>
            <button class="btn btn-primary" id="ap-${this.id}">Añadir al carrito</button>
        </div>
    </div>
        `
    }
}

class Carrito {
    constructor() {
        this.listaCarrito = []
    }

    levantarStorage(){
        this.listaCarrito = JSON.parse(localStorage.getItem("listaCarrito")) || []

        if(this.listaCarrito.length > 0){
            let listaAuxiliar = []

            for (let i = 0; i < this.listaCarrito.length; i++) {
                
                let productoDeLaClaseProducto = new Producto(this.listaCarrito[i])
                listaAuxiliar.push(productoDeLaClaseProducto)
                

            }

            this.listaCarrito = listaAuxiliar
        }
       
    }

    guardarEnStorage(){
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    agregar(productoAgregar) {
        let existeElProducto = this.listaCarrito.some(producto => producto.id == productoAgregar.id)

        if( existeElProducto ){
            let producto = this.listaCarrito.find(producto => producto.id == productoAgregar.id)
            producto.cantidad = producto.cantidad + 1
        }else{
            this.listaCarrito.push(productoAgregar)
        }
    }

    eliminar(productoEliminar){
        let producto = this.listaCarrito.find(producto => producto.id == productoEliminar.id)
        let indice = this.listaCarrito.indexOf(producto)
        this.listaCarrito.splice(indice,1)
    }

    mostrarProductos() {
        let contenedor_carrito = document.getElementById('contenedor_carrito')
        let total = document.getElementById('total')

        contenedor_carrito.innerHTML = ""        

        this.listaCarrito.forEach( producto => {
            contenedor_carrito.innerHTML += producto.descripcionHTMLCarrito()
        })
        this.listaCarrito.forEach(producto => {

            let btn_eliminar = document.getElementById(`eliminar-${producto.id}`)
            let btn_plus = document.getElementById(`plus-${producto.id}`)
            let btn_minus = document.getElementById(`minus-${producto.id}`)

            btn_eliminar.addEventListener("click", () => {
                this.eliminar(producto)
                this.guardarEnStorage()
                this.mostrarProductos()
            })

            btn_plus.addEventListener("click",()=>{
                producto.aumentarCantidad()
                this.mostrarProductos()
            })

            btn_minus.addEventListener("click", ()=>{
                if( producto.disminuirCantidad() ){
                    this.mostrarProductos()
                }
            })

        })

        total.innerHTML = "Precio Total: $" + this.calcular_total()
    }

    calcular_total(){
        return this.listaCarrito.reduce((acumulador, producto) => acumulador + producto.precio * producto.cantidad ,0)
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
    }

    agregar(producto) {
        this.listaProductos.push(producto)
    }

    mostrarProductos() {
        let contenedor_productos = document.getElementById("contenedor_productos")
        this.listaProductos.forEach(producto => {
            contenedor_productos.innerHTML += producto.descripcionHTML()
        })
        this.listaProductos.forEach(producto => {

            const btn = document.getElementById(`ap-${producto.id}`)

            btn.addEventListener("click", () => {
                carrito.agregar(producto)
                carrito.guardarEnStorage()
                carrito.mostrarProductos()
            })
        })
    }
}

const p1 = new Producto({id:1, nombre:"iphone13", precio:"1000", descripcion:"Celular Gama Alta", img:"https://m.media-amazon.com/images/I/61eDXs9QFNL._AC_SL1500_.jpg"})
const p2 = new Producto({id:2, nombre:"Galaxy S23 Ultra", precio:"950", descripcion:"Celular Gama ALta", img:"https://m.media-amazon.com/images/I/71Sa3dqTqzL._AC_SL1500_.jpg"})
const p3 = new Producto({id:3, nombre:"Moto G Play 2023", precio:"250", descripcion:"Celular Gama Baja", img:"https://m.media-amazon.com/images/I/61K1Fz5LxvL._AC_SL1500_.jpg"})
const p4 = new Producto({id:4, nombre:"Nokia G50", precio:"100", descripcion:"Celular Gama Baja", img:"https://m.media-amazon.com/images/I/51vf1R1wS9L._AC_SL1080_.jpg"})

const carrito = new Carrito()
carrito.levantarStorage()
carrito.mostrarProductos()
const controlador_productos = new ProductoController()

controlador_productos.agregar(p1)
controlador_productos.agregar(p2)
controlador_productos.agregar(p3)
controlador_productos.agregar(p4)

controlador_productos.mostrarProductos()