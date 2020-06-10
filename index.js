// MODULES
const fs = require("fs");
const http = require("http");
const url = require("url");
 
// Here we are reading the files synchronously as it will be executed only once right at the beginning(when we load up the application) 
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");  
const dataObj = JSON.parse(data);
// in dataObj we have an array of all the objects that are in JSON file

// SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    return output;
}


const server = http.createServer((req, res) => {
    // const path = url.parse(req.url, true).pathname;
    // const id = url.parse(req.url, true).query.id;
    const { pathname, query } = url.parse(req.url, true); //DESTRUCTURING
// OVERVIEW 
    if (pathname === "/overview" || pathname === "/") {
        res.writeHead(200, {"Content-type": "text/html"});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}",cardsHtml);
        res.end(output);    
    }
    // PRODUCT
    else if (pathname == "/product") {  
        res.writeHead(200, { "Content-type": "text/html" });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
   // API
    else if (pathname === "/api") {
             res.writeHead(200, {"Content-type" : "application.json"});
            res.end(data);  
    }
    // NOT FOUND
    else {
        res.writeHead(404, {"Content-type": "text/html"});
        res.end("<h1>PAGE NOT FOUND!!</h1>")
    }
});
server.listen(8000, "127.0.0.1", () => {
    console.log("server started"); 
});