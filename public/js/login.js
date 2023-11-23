window.onload = loginLoad;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username')
const password = urlParams.get('password')

function loginLoad() {
    var form = document.getElementById("myLogin");
    form.onsubmit = function (event) {
        event.preventDefault(); 
        checkLogin();  
    };

    setFormValues(); 

    if (username && password) {
        form.username.disabled = true;
        form.password.disabled = true;
    }
}


function checkLogin() {
    if (document.forms["myLogin"]["username"].value == username){
        if (document.forms["myLogin"]["password"].value == password){
            alert("ได้");
            return false;

        }
        else {
            alert("รหัสผิดพลาด");
            return true;

        }
    }
    else{
        alert("Usernameผิดพลาด")
         return true;

    }
}


