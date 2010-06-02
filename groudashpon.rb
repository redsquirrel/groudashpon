require 'rubygems'
require 'sinatra'

require 'city'

get '/' do
  erb :index
end

helpers do
  def city_setup(id)
    <<-JAVASCRIPT
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
end