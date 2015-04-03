$.LibCalHoursFull = function() {
var init = function() {
$.getJSON('//api3.libcal.com/api_hours_grid.php?iid=1287&format=json&weeks=2&callback=?',function(data){
  var d = new Date();
  var day = d.getDay();
  var weekday = new Array(7);
  weekday[0]=  "Sunday";weekday[1] = "Monday"; weekday[2] = "Tuesday"; weekday[3] = "Wednesday";
  weekday[4] = "Thursday";  weekday[5] = "Friday";   weekday[6] = "Saturday";
  for (i = 0; i < data.locations.length; i++) {
    if(JSON.stringify(data.locations[i].category) === "\"department\""){continue;}
    var contacts = JSON.stringify(data.locations[i].contact).replace("<p>", "").replace("</p>","").replace("\"","").replace("\"","");
    var name = JSON.stringify(data.locations[i].name).replace("\"", "").replace("\"", "");
    var phone = contacts.substring(0,contacts.indexOf(";")).trim();
    contacts = contacts.substring(contacts.indexOf(";")+1).trim();
    var mail = contacts.substring(0,contacts.indexOf(";")).trim();
    contacts = contacts.substring(contacts.indexOf(";")+1).trim();
    var tmz = contacts.substring(0,contacts.indexOf(";")).toUpperCase().trim();
    contacts = contacts.substring(contacts.indexOf(";")+1).trim();
    var address1 = contacts.substring(0,contacts.indexOf(";")).trim();
    contacts = contacts.substring(contacts.indexOf(";")+1).trim();
    var address2 = contacts.trim();
    var url = JSON.stringify(data.locations[i].url).replace("\"", "").replace("\"", "");
    if(phone.length == 0){phone="unknown";}
    if(mail.length == 0){mail="unknown";}
    if(address1.length == 0){address1="unknown";address2=""}
    tmp = i;
    var openOrNot = "CLOSED";
    colorOpen = "red";
    var currOpenTime = "";
    if(JSON.stringify(data.locations[i].weeks[0][weekday[day]].times.currently_open) === "true" ){
      openOrNot = "TODAY'S HOURS";
      colorOpen = "green";
      if(JSON.stringify(data.locations[i].weeks[0][weekday[day]].times.status) === "\"24hours\"" ){
        currOpenTime = "24 Hours";
    }else if(JSON.stringify(data.locations[i].weeks[0][weekday[day]].times.status) === "\"not-set\""){
      currOpenTime = "Unknown";
    }else if(JSON.stringify(data.locations[i].weeks[0][weekday[day]].times.status) === "\"open\""){
      currOpenTime = ""+data.locations[i].weeks[0][weekday[day]].times.hours[0].from+" to "+data.locations[i].weeks[0][weekday[day]].times.hours[0].to;
    }
    }
      var x = "<div id=\"parent\">"
            +"<div id=\"libcard\">"
            +"<div id=\"libname\"><a href=\""+url+"\">"+name+"</a></div>"
            +"<div id=\"map-canvas"+i+"\" class=\"map-canvas\"></div>"
            +"<div id=\"libaddr\">"+address1+"<BR>"+address2+"</div><BR>"
            +"<div id=\"libphone\"><img height=\"18px\" width=\"18px\" src=\"/images/ic_call_48px.svg\" /><div class=\"pushUpText\">"+phone+"</div></div>"
            +"<div id=\"libemail\"><img height=\"18px\" width=\"18px\" src=\"/images/ic_email_48px.svg\" /><div class=\"pushUpText\">"+mail+"</div></div>"
            +"<div id=\"Open_timing\"><b><font color=\""+colorOpen+"\">"+openOrNot+"</font></b>"
            +"&nbsp&nbsp&nbsp&nbsp<b><font color=\""+colorOpen+"\">"+currOpenTime+"</font></b>"
            +"<div id=\"open_button\">OPEN HOURS ("+tmz+")<div id=\"open_button_img\"><input type=\"image\" data-name=\"hide\"  id=\"buttonLib"+i+"\" src=\"/images/ic_expand_more_48px.svg\" /></div></div>";
      var table_data="<tr><td>&nbsp&nbsp&nbsp&nbsp</td>";
      for( k = 0 ; k < weekday.length ; k++){
        table_data += "<td><b>"+weekday[k].substring(0,3)+"  "+
       data.locations[i].weeks[0][weekday[k]].date.substring(5).replace("-","/")+"</b></td>";
       }
       table_data +="</tr>";
       for( sublibs = i ; sublibs < data.locations.length; sublibs++){
          if(sublibs!=i && JSON.stringify(data.locations[sublibs].category) != "\"department\""){
             i = sublibs-1;
             table_data +="</tr>";
             break;
           }
         table_data +="<tr>";
         if(i == sublibs){
         table_data += "<b><td><a href=\""+(data.locations[sublibs].url)+"\">"+(data.locations[sublibs].name)+"</a></td></b>";
       }else{
         table_data += "<td>&nbsp&nbsp&nbsp&nbsp<a href=\""+(data.locations[sublibs].url)+"\">"+(data.locations[sublibs].name)+"</a></td>";
       }
       for( k = 0 ; k < weekday.length  ; k++){
         if(JSON.stringify(data.locations[sublibs].weeks[0][weekday[k]].times.status) === "\"24hours\"" ){
         table_data += "<td>24 Hours</td>";
       }else if(JSON.stringify(data.locations[sublibs].weeks[0][weekday[k]].times.status) === "\"not-set\""){
         table_data += "<td>Not Set</td>";
       }else if(JSON.stringify(data.locations[sublibs].weeks[0][weekday[k]].times.status) === "\"open\""){
         table_data += "<td>"+data.locations[sublibs].weeks[0][weekday[k]].times.hours[0].from+" - "+data.locations[sublibs].weeks[0][weekday[k]].times.hours[0].to+"</td>";
       }else{
         table_data += "<td>Closed</td>";
       }
        }
        table_data +="</tr>";
      }
    try{
      document.getElementById(name).innerHTML +=x+"<div id=\"tableLib"+tmp+"\"><table id=\"hours-table"+i+"\" class=\"hrsTable\">"+table_data+"</table></div></div></div>";
    }catch(err){
      alert("Match the Name of Library on Hours API = \""+name+"\" and Post Title");continue;}
    }
    for (i = 0; i < data.locations.length; i++) {
      if(JSON.stringify(data.locations[i].category) === "\"library\""){
        map_init(i,data.locations[i].lat, data.locations[i].long);
        document.getElementById("jsScripts").innerHTML += eval(
        "$( document ).ready(function() {"
        +"  $(\"#tableLib"+i+"\").css(\"display\", \"none\");"
        +"$(\"#buttonLib"+i+"\").click(function () {"
        +"if ($(this).data('name') == 'show') {"
        +"$(\"#tableLib"+i+"\").css(\"display\", \"none\");"
        +"$(this).data('name', 'hide');"
        +"$(this).attr('src', '/images/ic_expand_more_48px.svg');"
        +"} else {"
        +"$(\"#tableLib"+i+"\").css(\"display\", \"block\");"
        +"$(this).data('name', 'show');"
        +"$(this).attr('src', '/images/ic_expand_less_48px.svg');"
        +"}});});");
        }
    }
    });
  }
  var map_init = function(id,lat,lng) {
    var mapOptions = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 18
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'+id), mapOptions);
	}
  init();
  }
