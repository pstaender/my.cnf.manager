#!/usr/bin/env ruby

# Example for `~/.my.cnf.clients`
# [default]
# user=root
# password=passwors
# host=127.0.0.1
# port=3302
# port=33306
# [php]
# port=3320

environment = ARGV[0] || 'default'
filename = File.expand_path('~/.my.cnf.clients')
my_cnf_file = File.expand_path('~/.my.cnf')
do_collect_lines = false
lines = ["[client]\n"]

File.read(filename).lines.each do |line|
  matches = line.match(/\[(.+?)\]/)
  do_collect_lines = [environment, 'default'].include?(matches[1]) if matches && matches[1]
  lines << line if do_collect_lines && matches.nil?
end

File.open(my_cnf_file, 'w') { |f| f.write(lines.join('')) }

puts "switched .my.cnf to #{environment}"
