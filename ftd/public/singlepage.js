function database(){
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("screen").innerHTML = this.responseText;
    }
  }
  xhttp.open("GET", "database", true);
  // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(null);
}
function register(){
  $('#register').submit(function(e){
  	$('#cont').load('registration.html', function(
  		responseTXT, statusTXT, xhr){
  			if(statusTXT == "success")
  				console.log("good stuff");
  		}
  	)
  })
}
function json(){
  $.getJSON('users.json', function(data){
    $.each(data, function(i, user){
      $('ul#users'.append('<li>'))
    })
  })
  $.ajax({
    method:'GET',
    url: "nothing"
  })
}
function userRegister(){
    console.log("hi")
		var name = $('#regUser').val();
		var pass = $('#regPsw').val();
    var email = $('#regEmail').val();
		var url = "/registration";
		$.ajax({url:url,
            data:{
            name:name,
            pass:pass,
            email:email},
            method:"POST",
            success: function(result){
              if (result=="success")
                indexPage()
              //show error registration
    }});
}
function signIn(){
		var name = $('#uname').val();
		var pass = $('#psw').val();
		var url = "/login"
    console.log(name);
    if (name && pass){
      $.ajax({url: "/login",
              method:"POST",
              data:{name:name,pass:pass},
              success: function(result){
                console.log(result)
    }});
  }
}
function registerPage(){
  $("#registration").show();
  $("#login").hide();
}
function indexPage(){
  $("#registration").hide();
  $("#login").show();
}
$(function(){
	// Setup all events here and display the appropriate UI
	// Setup an onclick event for the #guessButton
	$("#registration").hide();
	$("#login").show();
  $("#loginBTN").on('click',function(e){
    e.preventDefault();
    signIn();
  })
  $("#userRegistration").on('submit', function(e){
    userRegister();
  })
  $("#registerPage").on('click', function(){
    registerPage();
  })
  $("#backBTN").on('click', function(){
    indexPage();
  })
  $("#registerBTN").on('click', function(e){
    e.preventDefault();
    userRegister();
  })
  $("#postForm").on('submit', function(e){
    e.preventDefault();
  })
});


// $(function(){
//   $(document).ready(function(){
//     $('#screen').load('login.html', function(
//       responseTXT, statusTXT, xhr){
//         if(statusTXT == "success")
//           console.log("good stuff");
//       }
//     )
//   });
// })
