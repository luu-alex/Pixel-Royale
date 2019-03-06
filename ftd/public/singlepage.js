function loadDoc() {
  console.log("hi");
  var phase = "login";
  var xhttp = new XMLHttpRequest();
  if (phase == "login"){
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("screen").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "login", true);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(null);
  }
  if (phase == "database"){
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("screen").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "database", true);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(null);
  }
  if (phase == "register"){
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("screen").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "register", true);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(null);
  }
}
