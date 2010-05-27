require 'rubygems'
require 'sinatra'

require 'city'

get '/' do
  body = "<h1>GrouDASHpon</h1>"
  City.all.each do |city|
    body << %Q(<h2 id="#{city['id']}">#{city['name']}</h2>)
    # body << "<pre>#{city.inspect}</pre>"
  end
  body
end