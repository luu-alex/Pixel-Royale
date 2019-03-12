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
function deleteProfile(){
  $.ajax({
    url: "/edit",
    method:"delete",
    success: function(result){
      if (result) {
      indexShowPage("login");
      }
    }
  });
}
function editProfile(){
  var name = $('#pName').val();
  var email = $('#pEmail').val();
  if (name && (validateEmail(email))) {
    $.ajax({
      url: "/edit",
      method:"put",
      data:{name: name,email: email},
      success: function(result){
        $('#success').show();
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
            $("#nav").show();
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
        $("#nav").hide();
        indexShowPage("login");
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
        $("#nav").show();
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
  pauseGame();
  $("#submitBTN").hide();
  $("#stage").hide();
  $("#stats").hide();
  $("#statsProfile").hide();
  $("#showStats").hide();
  $("#profile").hide();
  $("#index").hide();
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
  $("#profile").hide();
  $("#stats").hide();
  $("#submitStats").hide();
  $("#index").hide();
  $("#stage").show();
  $("#statsProfile").hide();
    pauseGame();
    setupGame();
    startGame();
}
function submitBTN(){
  $("#submitBTN").show();
  // $("#stage").hide();
}
function statsswitch(kills){
  $("#stats").show();
  $("#submitStats").show();
  $("#kills").val(kills);
}
function home() {
  $('#home').show();
  $('#stage').hide();
  $('#index').show();
  $('#stats').hide();
  $("#profile").hide();
}
function showStats() {
  var kills = $('#kills').val();
  $.ajax({
    url: "/score",
    method:"post",
    data:{kills: kills},
    success: function(result){
      $("#submitStats").hide();
    }
  });
}
function getStats() {
  $.ajax({
    url: "/score",
    method:"get",
    success: function(result){
      var item = "<div class='container'> <div class='formBox'> <table id='statsProfile' >  <tr> <th> Name </th> <th> Kills </th> </tr>  "
      for (var i=0; i<result["data"].length; i++) {
        item+= "<tr> <th>"+result["data"][i][0] + "</th> <th> " + result["data"][i][1] +"</th>  </tr>"
      }
      item+= "</table </div> </div>"
      $("#statsProfile").replaceWith(item);
    }
  });
}
$(function() {
	$("#registration").hide();
  $("#submitBTN").hide();
  $('#index').hide();
  $('#stage').hide();
  $("#nav").hide();
  $("#profile").hide();
  $("#stats").hide();
  $("#statsProfile").hide();
  $("#kills").hide();
  $("#submitStats").hide();
  hideRegInvalid();
  hideInvalid();
  hidePInvalid();


  $("#homeBTN").on('click', function(e){
    home();
  })
  $("#statsBTN").on('click',function(e){
    getStats();
    indexShowPage("stats");
    $("#statsProfile").show();
  })
  $("#gameBTN").on('click',function(e){
    game();
  })
  $("#loginBTN").on('click',function(e){
    e.preventDefault();
    signIn();
  })
  $("#submitStats").on('click',function(e){
    showStats();
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
    $("#success").hide();
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
    e.preventDefault();
    editProfile();
  })
  $("#deleteEditBTN").on('click', function(e){
    deleteProfile();
  })
  $("#document").ready(function(){
    checkJWT();
  })

});
