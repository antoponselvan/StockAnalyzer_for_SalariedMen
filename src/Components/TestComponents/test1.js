// import fetch from 'node-fetch'
// fetch("https://api.giphy.com/v1/gifs/random?api_key=HZSrhjAYpqulkOg0lwOc7yljFZpppPar&tag=&rating=g")
//     .then((response)=>{console.log(response)})

const https = require('https');
https.get("https://api.giphy.com/v1/gifs/random?api_key=HZSrhjAYpqulkOg0lwOc7yljFZpppPar&tag=&rating=g", (resp)=>{console.log(resp)})