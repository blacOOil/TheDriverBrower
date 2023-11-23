window.onload = pageLoad;

<<<<<<< HEAD
function pageLoad(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error")) {
		const errorMessage = window.location.href.includes("Regis.html")
			? "Registration Error!"
			: "Username or password does not match.";
		document.getElementById('errordisplay').innerHTML = errorMessage;
	}
}
=======
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username')
const password = urlParams.get('password')

function pageLoad() {
    document.getElementById('input_checkpassword').onclick = TogglePassword;
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

function TogglePassword() {
    var x = document.getElementById("check_password");
    var z = document.getElementById("label_changetext");
  
    if (x.type === "password" && z.innerHTML === "Hidden On") {
      x.type = "text";
      z.innerHTML = "Hidden Off";
    } else {
      x.type = "password";
      z.innerHTML = "Hidden On";
    }
  }


>>>>>>> master
