window.onload = pageLoad;

function pageLoad(){

	
}
function showData(data){
    var keys = Object.keys(data);
    for(var i =0; i< keys.length; i++){
        var temp = document.getElementById("layer");
        var list = temp.querySelectorAll("div");

        var username = document.createElement("p");
        brandname.innerText = data[keys[i]].username;

        var hightscore = document.createElement("p");
        price.innerText = data[keys[i]].hightscore;

        list[i].appendChild(username);
        list[i].appendChild(hightscore);
        
    }
}
function checkCookie(){
    var username = "";
    if(getCookie("username")== false){

    }
}

function getCookie(name){
    var value = "";
    try{
        value = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name))
        .split("=")[1];
        return value;
    } catch (err){
        return false;
    }
}
async function showScoreBoard(){
    let response = await fetch("/leaderBoarding");
    let content = await response.json();
    showLeaderBoard(content);
}
function showLeaderBoard(data){
    var keys = Object.keys(data);
    console.log(keys);
    var divTag = document.getElementById("");
    divTag.innerHTML = "";
    for(var i = keys.length - 1; i >= 0; i--){
        var temp = document.createElement("div");
        temp.className = "newsleaderboard"
        divTag.appendChild(temp);
        var temp1 = document.createElement("div");
        temp1.className = "score";
        temp1.innerHTML = data[keys[i]]["score"];
        temp.appendChild(temp1);
        var temp1 = document.createElement("div");
        temp1.className = "username";

        temp1.innerHTML = data[keys[i]]["username"];
        temp.appendChild(temp1);
    }
}