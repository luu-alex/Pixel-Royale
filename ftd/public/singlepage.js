
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
      }});
    }
    if (!name) $('#invalidRegUser').show();
    if (!pass) $('#invalidRegPass').show();
    if (!validateEmail(email)) $('#invalidEmail').show();
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
          console.log(result)
          if(result=="success") {
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
function validateEmail(email)
{
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

function hideInvalid(){
  $('#invalidPass').hide();
  $('#invalidUser').hide();
  $('#incorrect').hide();
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
function clearReg(){

}
$(function(){
	$("#registration").hide();
	$("#login").show();
  $('#index').hide();
  $('#stage').hide();
  hideRegInvalid();
  hideInvalid();
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
  $("#userRegistration").on('submit', function(e){
    userRegister();
  })
  $("#registerPage").on('click', function(){
    loginShowPage("registration");
  })
  $("#backBTN").on('click', function(){
    loginShowPage("login");
  })
  $("#registerBTN").on('click', function(e){
    e.preventDefault();
    userRegister();
  })
  $("#postForm").on('submit', function(e){
    e.preventDefault();
  })
  $("#editProfileBTN").on('click', function(e){

  })
});
