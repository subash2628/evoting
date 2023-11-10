//immediately invoked function expression
(function(global){


var dc = {};

var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='img/ajax-loader_2.gif'></div>";
    insertHtml(selector, html);
  };


var homeUrl = "snippets/home.html";
var registerUrl = "snippets/registration.html";
var statusUrl = "snippets/statusCheck.html";
var dashBoardUrl = "snippets/dashBoard.html";
var checkerUrl = "snippets/checker.html";
var resultUrl = "snippets/result.html";
var helpUrl ="snippets/help.html";
//window.location = homeUrl;
 //$("#main-content").load(homeUrl);
$(function(){
    
    showLoading("#main-content"); //show loading gif

//     $ajaxUtils.sendGetRequest(
//         homeUrl,
//         function(home_html){
//             insertHtml("#main-content",home_html);
//         },
//         false   //no json response 
// )
	
	$("#main-content").load(homeUrl);

});



//console.log("Entered!!!");


dc.getRegister = function(){
	    showLoading("#main-content");

	    // $ajaxUtils.sendGetRequest(
	    // 		registerurl , 
	    // 		function(register_page){
	    // 			insertHtml("#main-content", register_page);
	    // 		},
	    // 		false  //no json response
	    // 	);
	    	$("#main-content").load(registerUrl);



};

dc.getStatus = function(){
    showLoading("#main-content");

	$("#main-content").load(statusUrl);
    
};


dc.getDashboard = function(){
	showLoading("#main-content");
	$("#main-content").load(dashBoardUrl);

};

dc.getChecker = function(){
	showLoading("#main-content");

$("#main-content").load(checkerUrl);
	


// 	 $(function() {
//                                               const z = prompt("Enter date of birth in the order year/month/day. For eg. 2055/11/15");
//                         
//                                               if(z){

//                                               const m = z.split('/').join('');
//                                               const n = m.substring(0,4);
//                                               const o = m.substring(4,6);
//                                               const p = m.substring(6,8);
//                                               const a = parseInt(n);
//                                               const datetoday = 20751010;
//                                               const age = (datetoday - parseInt(m))/10000;
//                                               //alert(".............");
//                                               const x = document.getElementById("gg");
//                                               const y = document.getElementById("ff");
//                                               if(a < 2075 && a > 1960 && parseInt(o)<13 && parseInt(p)<32) 
//                                               { 
                                                
//                                                 if(age <18){
//                                                       //console.log("Entered!!!");
//                                                       y.style.color= "Red"; 
//                                                       x.style.backgroundColor= "#FF5D52"; 

                                                      
//                                                       y.innerHTML= "Age below 18"; 
                                                
//                                                     }
                                                      
//                                                   //y.innerHTML= "Finger print not found!!"; 
                                                    
//                                                     else{
//                                                    //console.log(".............");
                                                  
//                                                   y.innerHTML= "All Ok!"; 
//                                                   y.style.color= "green"; 
//                                                   x.style.backgroundColor= "lightgreen"; 

//                                                       }
//                                                 }
//                                             else
//                                             {
//                                                 alert("Wrong input!!! ");
//                                             }   
                                                
                                                
//     //{console.log("kick back!!!");}
// }

// });
};

dc.getResult = function(){
		showLoading("#main-content");
    //console.log('inside counter');
			$("#main-content").load(resultUrl);

    //     $(".counter-count").each(function () {
    //       console.log('inside counter');
    //     $(this).prop('Counter',0).animate({
    //         Counter: $(this).text()
    //     }, {
    //         duration: 5000,
    //         easing: 'swing',
    //         step: function (now) {
    //             $(this).text(Math.ceil(now));
    //         }
    //     });
    // });

    //dc.countResult();

  $.get(
  "http://localhost:3001/getResult",
  function(data,status){
      //console.log("Data: "+ data.note);
      //console.log(data);
      $("#P1").text(data.A);
      $("#P2").text(data.B);
      $("#P3").text(data.C);
  }
  );


};


dc.countResult = function(){
 //alert("hello world");
    // $('.counter-count').each(function () {
    //     $(this).prop('Counter',0).animate({
    //         Counter: $(this).text()
    //     }, {
    //         duration: 10000,
    //         easing: 'swing',
    //         step: function (now) {
    //             $(this).text(Math.ceil(now));
    //         }
    //     });
    // });
};

dc.getHelp = function(){
			showLoading("#main-content");
			$("#main-content").load(helpUrl);

};


dc.getRadios = function(){
  //alert('pressed!!!');
  var radios1 = document.getElementsByName('Party');
    var radios2 = document.getElementsByName('candidate');

    var a1 = []; var a2 = [];

for(let i =0 ; i < radios1.length ; i++ ) {

  a1[i] = radios1[i].checked;
  a2[i] = radios2[i].checked;
}

if((a1[0] || a1[1] || a1[2] )&& (a2[0] || a2[1] || a2[2] )){
  var value1; var value2;
  for (var i = 0; i < radios1.length; i++) {
      if (radios1[i].type === 'radio' && radios1[i].checked)  value1 = radios1[i].value; 
      if (radios2[i].type === 'radio' && radios2[i].checked)  value2 = radios2[i].value; 
    


 }

 //alert(value1);

$.post(
      "http://localhost:3001/vote/broadcast",
      {
        "For": value1
      },
      function(data,status){
           console.log("Data: "+ data.note);
          $("#main-content").html(`<h1 style="color: green;">${data.note}</h1>`);
      }
  );

$.get(
  "http://localhost:3001/mine",
  function(data,status){
      //console.log("Data: "+ data.note);

  }
  );


}
else{
  alert('Radio Empty!!!');

}
// else{
//   alert('Radio Empty!!!');
// }

  //console.log(`${value1} + ${value2}`);

};





dc.validateForm = function(){
	//showLoading("#main-content");
	// $("#main-content").load(registerurl);
			//alert("entered");

	 		  var x = document.getElementById("Citizenship").value;
              //var y = document.getElementById("location").value;
              var z = document.getElementById("chheckbox").checked;              
              var a = x.length;
              //var b = y.length;
            if (a >= 12 && z ){
                // alert("you are registered");

                 
                var data = {
                    citizenNo: x
                    //password : pass2
                };

                //console.log(data);

                $.ajax({
                    type : 'POST',
                    url : 'api/user',
                    data : JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success : function(data1){
                        //console.log(data1.Citizen + data1.message);
                        alert(data1.citizenNo + data1.message );
                    },
                    error: function(err){
                        alert("Error Occured");
                        //console.log(err);
                    }
                });
            }
            
              else{
                alert("wrong input");
              	}



};

dc.checkStatus = function(){
	var citizenNoo = $('#Citizenship').val();

   

    if(citizenNoo != '' && citizenNoo.length>=12 ){
        var data = {
            citizenNo: citizenNoo
            //password : pass2
        };
        // console.log( JSON.stringify(data));

            $.ajax({
                type: 'POST',
                url: 'api/check',
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success : function(data1){

                    alert(data1.citizenNo + data1.message );
                },
                error: function(err){
                    alert("Error Occured !!!");
                    //console.log(err);
                }
            });
        }
        else{
            alert("Please Check your CitizenShip Number!!!");
        }
};






global.$dc = dc;



})(window);