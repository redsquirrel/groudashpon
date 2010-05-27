require 'net/http'
require 'json'

class Deal
  URL = URI.parse("http://www.groupon.com/api/v1/deals.json")

  def self.at(location)
    response = Net::HTTP.start(URL.host, URL.port) do |http|
      http.get(URL.path + "?lat=#{location['latitude']}&lng=#{location['longitude']}")
    end
    
    JSON.parse(response.body)["deals"]
  end
end
