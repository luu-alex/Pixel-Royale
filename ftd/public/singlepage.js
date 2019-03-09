function userRegister(){
    hideRegInvalid();
		var name = $('#regUser').val();
		var pass = $('#regPsw').val();
    var email = $('#regEmail').val();
		var url = "/registration";
    if (name && pass && validateEmail(email)) {
  		$.ajax({url:url,
              data:{
              name:name,
              pass:pass,
              email:email},
              method:"POST",
              success: function(result){
                if (result=="success"){
                  loginShowPage("login");
                }
                else $('#incorrectReg').show();
                //show error registration
              }
      });
    }
    if (!name) $('#invalidRegUser').show();
    if (!pass) $('#invalidRegPass').show();
    if (!validateEmail(email)) $('#invalidEmail').show();
}
function populateProfile(){
    $.ajax({
      url: "/edit",
      method:"get",
      success: function(result){
        $("#pName").val(result.name);
        $("#pEmail").val(result.email);
      }
  });
}
function editProfile(){
  var name = $('#pName').val();
  var email = $('#pEmail').val();
  if (name && (!validateEmail(email))) {
    $.ajax({
      url: "/edit",
      method:"get",
      success: function(result){
        $("#pName").val(result.name);
        $("#pEmail").val(result.email);
      }
    });
  }
  if (!name) $("#pInvalidUser").show();
  if (!validateEmail(email)) $('#pInvalidEmail').show();
}
function signIn(){
		var name = $('#uname').val();
		var pass = $('#psw').val();
		var url = "/login";
    hideInvalid();
    if (name && pass){
      $.ajax({
        url: "/login",
        method:"POST",
        data:{name:name,pass:pass},
        success: function(result){
          if(result["success"]) {
            loginShowPage("index");
          } else {
            $(function(){
              $('#incorrect').show();
            })
            loginShowPage("login");
          }
        }
      });
  }
  if (!name) $('#invalidUser').show();
  if (!pass) $('#invalidPass').show();
}
function logOut(){
  $.ajax({
    url: "/logout",
    method:"GET",
    success: function(result){
      if(result["success"]) {
        loginShowPage("login");
      }
    }
  });
}
function checkJWT(){
  $.ajax({
    url: '/checkJWT',
    method:"GET",
    success: function(result){
      if (result["success"]){
        $("#index").show();
        $("#login").hide();
      }
      else {
        $("#login").show();
      }
    }
  })
}
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function loginShowPage(page){
  $('#regUser').val("");
  $('#regPsw').val("");
  $('#regEmail').val("");
  $("#uname").val("");
  $("#psw").val("");
  $("#registration").hide();
  $("#login").hide();
  $('#index').hide();
  $("#"+page).show();
}
function indexShowPage(page){
  $.getScript('./controller.js', function(){
    pauseGame();
  })
  $("#stage").hide();
  $("#stats").hide();
  $("#profile").hide();
  $("#"+page).show();
}
function hideInvalid(){
  $('#invalidPass').hide();
  $('#invalidUser').hide();
  $('#incorrect').hide();
}
function hidePInvalid(){
  $('#pInvalidEmail').hide();
  $('#pInvalidUser').hide();
}
function hideRegInvalid(){
  $('#invalidRegPass').hide();
  $('#invalidRegUser').hide();
  $('#incorrectReg').hide();
  $('#invalidEmail').hide();
}
function game(){
  $("#stage").show();
  $.getScript('./controller.js', function(){
    setupGame();
    startGame();
  })
}
function home(){
  $('#home').show();
  $('#stage').hide();
  $('#index').show();
  $('#stats').hide();
}
$(function(){
	$("#registration").hide();
  $('#index').hide();
  $('#stage').hide();
  $("#profile").hide();
  hideRegInvalid();
  hideInvalid();
  hidePInvalid();

  $("#homeBTN").on('click', function(e){
    home();
  })
  $("#statsBTN").on('click',function(e){
    stats();
  })
  $("#gameBTN").on('click',function(e){
    game();
  })
  $("#loginBTN").on('click',function(e){
    e.preventDefault();
    signIn();
  })
  $("#registerBTN").on('click', function(e){
    hideInvalid();
    hideRegInvalid();
    userRegister();
  })
  $("#backBTN").on('click', function(){
    hideInvalid();
    hideRegInvalid();
    loginShowPage("login");
  })
  $("#editProfileBTN").on('click', function(e){
    populateProfile();
    indexShowPage("profile");
  })
  $("#logOut").on('click', function(e){
    logOut();
  })
  $("#userRegistration").on('submit', function(e){
    userRegister();
  })
  $("#registerPage").on('click', function(){
    loginShowPage("registration");
  })
  $("#postForm").on('submit', function(e){
    e.preventDefault();
  })
  $("#submitEdit").on('click', function(e){
    editProfile();
  })
  $("#document").ready(function(){
    checkJWT();
  })
});
