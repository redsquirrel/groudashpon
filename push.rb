require 'rubygems'
require 'pusher'

require 'city'
require 'deal'

require 'pusher_config'

loop do
  City.all.each do |city|
    channel = city["id"]
        
    total = 0

    Deal.at(city["location"]).each do |deal|
      quantity = deal["quantity_sold"].to_i
      if deal["tipped"]
        price = deal["price"].to_f
        total += quantity * price
      end
    end

    puts "Pushing #{channel}: #{total}"
    Pusher[channel].trigger('update', total.to_s)
  end
  
  puts "Giving Groupon a little rest..."
  sleep 5
end

