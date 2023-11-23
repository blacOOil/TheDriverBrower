window.onload = pageLoad;

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