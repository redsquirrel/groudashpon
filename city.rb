require 'net/http'
require 'json'

class City
  URL = URI.parse("http://www.groupon.com/api/v1/divisions.json")

  def self.all
    response = Net::HTTP.start(URL.host, URL.port) do |http|
      http.get(URL.path)
    end

    JSON.parse(response.body)["divisions"]
  end
end
