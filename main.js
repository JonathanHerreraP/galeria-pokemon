// Importando modulos:
const axios = require("axios");
const http = require("http");
const fs = require("fs");
const url = require("url")

//creando servidor en puerto 3000:
http.createServer(function(req, res){

// Si la url tiene "galeria" muestra el index.html con los pokemones:
if (req.url.includes("/galeria")){
res.writeHead(200, {"Content-Type":"text/html"})
fs.readFile("index.html", "utf8", (err, html)=>{
    res.write(html)
    res.end()
})

}
// si la url tiene "pokemones" consulta las APIS y generará el JSON con la data:
if (req.url.includes("/pokemones")){

    // se crea arreglo vacio para posterior llenado:
    let pokemones = []

    // Se consulta la API con limite de 150 resultados:
    async function getpokemon(){
    const { data }= await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=150`)
    return data.results
    }
    // se consulta la API para obtener los nombres:
    async function getname(name){
    const { data }= await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    return data
    }
    
    // Se llama la funcion con su promesa
    getpokemon().then((results)=>{
        results.forEach((p) => {
            let pokemonNombre = p.name
            pokemones.push(getname(pokemonNombre))
            
        });

        // Se hace el promise.all para juntar todo y generar el JSON con la data filtrada:
        Promise.all(pokemones).then((data)=>{
            let filtro = []
            data.forEach((d)=>{
                let img = d.sprites.front_default
                let nombre = d.name
                filtro.push({img, nombre})
            })
            res.write(JSON.stringify(filtro))
            res.end()
        }).catch(e => console.log(e))
    })
}
})


.listen(3000, () => console.log('Escuchando el puerto 3000'))



