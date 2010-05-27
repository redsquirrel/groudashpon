require 'rubygems'
require 'sinatra'

require 'city'

get '/' do
  body = "<h1>GrouDASHpon</h1>"
  City.all.each do |city|
    body << %Q(<h2>#{city['name']}</h2>\n)
    body << %Q(<div class="city-data" id="#{city['id']}"></div>\n)
    body << city_setup(city['id'])
    # body << "<pre>#{city.inspect}</pre>"
  end
  "<html><head>" + head + "</head><body>" + body + "</body></html>"
end

def head
<<HEAD
<title>GrouDASHpon</title>
<script src="http://js.pusherapp.com/1.4/pusher.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js"></script>
HEAD
end

def city_setup(id)
<<JAVASCRIPT
<script type="text/javascript">
  var server = new Pusher('0aa652d61807ea18fe70', "#{id}");
  server.bind('update', function(amount) {
    $("#{id}").update(amount);
  });
</script>
JAVASCRIPT
end
