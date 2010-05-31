require 'rubygems'
require 'sinatra'

require 'city'

get '/' do
  body = "<h1>GrouDASHpon</h1>"
  body << %Q(<ul id="cities">)
  City.all.each do |city|
    body << %Q(<li id="#{city['id']}-item">)
    body << %Q(<a target="_blank" href="http://groupon.com/#{city['id']}">#{city['name']}</a>\n)
    body << %Q($<span class="city-data" id="#{city['id']}"></span>\n)
    body << city_setup(city['id'])
    # body << "<pre>#{city.inspect}</pre>"
    body << "</li>"
  end
  body << "</ul>"
  body << %Q(<p><a target="_blank" href="http://github.com/redsquirrel/groudashpon">Fork me on Github</a></p>\n)
  body << %Q(<p>Best viewed in <a href="http://www.google.com/chrome">Google Chrome</a></p>\n)
  "<html><head>" + head + "</head><body>" + body + "</body></html>"
end

def head
<<HEAD
<title>GrouDASHpon</title>
<script src="http://js.pusherapp.com/1.4/pusher.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js"></script>
<script type="text/javascript">
var list = {};
function cityData(element) {
  var city = element.id.replace("-item", "");
  return (city && $(city).innerHTML) || 0;
}

function sortNumber(a, b) {
  return cityData(b) - cityData(a);
}

function sortList() {
  var sortedCities = $("cities").childElements().sort(sortNumber);
  $("cities").innerHTML = "";
  sortedCities.each(function(city) {
    $("cities").appendChild(city);
  });
}

var socket = new Pusher('0aa652d61807ea18fe70');
</script>
HEAD
end

def city_setup(id)
<<JAVASCRIPT
<script type="text/javascript">
  socket.subscribe("#{id}").bind('update', function(amount) {
    if ($("#{id}").innerHTML != amount) {
      $("#{id}").update(amount);
      sortList();
      new Effect.Highlight("#{id}");
    }
  });  
</script>
JAVASCRIPT
end
