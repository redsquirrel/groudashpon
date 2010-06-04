require 'rubygems'
require 'sinatra'

require 'city'

get '/' do
  erb :index
end