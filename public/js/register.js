window.onload = pageLoad;

function pageLoad() {
  document.getElementById('input_checkpassword').onclick = TogglePassword;

  TogglePassword(); // เซ็ตก่อน 1 รอบ
  
  var form = document.getElementById("myForm");
  form.onsubmit = validateForm;
}


function validateForm() {
  var password = document.forms["myForm"]["password"].value;
  var retypePassword = document.forms["myForm"]["retype_password"].value;
  
  if (password != retypePassword) {
    document.getElementById("errormsg").innerHTML ="รหัสไม่ถูก"
    alert ("ใส่รหัสให้ตรงกัน");
    return false;
  }
  return true;
}

// async function getData(){
//   timer = setInterval (ReadPostREfresh,500);
//   await ChangeTextWhenToggle();
// }

// function ReadPostREfresh(){
// 	ChangeTextWhenToggle()
// }

function TogglePassword() {
  var x = document.getElementById("check_password");
  var y = document.getElementById("check_retype_password");
  var z = document.getElementById("label_changetext");

  if (x.type === "password" && y.type === "password" && z.innerHTML === "Hidden On") {
    x.type = "text";
    y.type = "text";
    z.innerHTML = "Hidden Off";
  } else {
    x.type = "password";
    y.type = "password";
    z.innerHTML = "Hidden On";
  }
}
    

