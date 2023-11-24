window.onload = pageLoad;


function pageLoad(){
	document.getElementById('input_checkpassword').onclick = TogglePassword;

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error")) {
		const errorMessage = window.location.href.includes("Regis.html")
			? "Registration Error!"
			: "Username or password does not match.";
		document.getElementById('errordisplay').innerHTML = errorMessage;
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