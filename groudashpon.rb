require 'rubygems'
require 'sinatra'

require 'city'

get '/' do
  body = "<h1>GrouDASHpon</h1>"
  City.all.each do |city|
    body << %Q(<a target="_blank" href="http://groupon.com/#{city['id']}">#{city['name']}</a>\n)
    body << %Q($<span class="city-data" id="#{city['id']}"></span>&nbsp;&nbsp;\n)
    body << city_setup(city['id'])
    # body << "<pre>#{city.inspect}</pre>"
  end
  body << %Q(<p><a target="_blank" href="http://github.com/redsquirrel/groudashpon">source</a></p>\n)
  "<html><head>" + head + "</head><body>" + body + "</body></html>"
end

def head
<<HEAD
<title>GrouDASHpon</title>
<script src="http://js.pusherapp.com/1.4/pusher.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js"></script>
HEAD
end

def city_setup(id)
<<JAVASCRIPT
<script type="text/javascript">
  var server = new Pusher('0aa652d61807ea18fe70', "#{id}");
  server.bind('update', function(amount) {
    if ($("#{id}").innerHTML != amount) {
      $("#{id}").update(amount);
      new Effect.Highlight("#{id}");      
    }
  });
</script>
JAVASCRIPT
end
