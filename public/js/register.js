window.onload = pageLoad;

function pageLoad() {
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

function TogglePassword() {
    var x = document.getElementById("check_password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }

    var y = document.getElementById("check_retype_password");
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
}
    

