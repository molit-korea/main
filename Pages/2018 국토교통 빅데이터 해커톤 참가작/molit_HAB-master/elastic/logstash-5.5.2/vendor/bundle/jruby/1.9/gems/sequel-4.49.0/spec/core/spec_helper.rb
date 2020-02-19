require 'rubygems'
require "#{File.dirname(File.dirname(__FILE__))}/sequel_warning.rb"

if ENV['COVERAGE']
  require File.join(File.dirname(File.expand_path(__FILE__)), "../sequel_coverage")
  SimpleCov.sequel_coverage(:filter=>%r{lib/sequel/(\w+\.rb|(dataset|database|model|connection_pool)/\w+\.rb|adapters/mock\.rb)\z})
end

unless Object.const_defined?('Sequel')
  $:.unshift(File.join(File.dirname(File.expand_path(__FILE__)), "../../lib/"))
  require 'sequel/core'
end

gem 'minitest'
require 'minitest/autorun'
require 'minitest/hooks/default'
require 'minitest/shared_description'

require "#{File.dirname(File.dirname(__FILE__))}/deprecation_helper.rb"

class Minitest::HooksSpec
  # SEQUEL5: Replace with define_singleton_method
  def meta_def(obj, name, &block)
    (class << obj; self end).send(:define_method, name, &block)
  end
end

if ENV['SEQUEL_COLUMNS_INTROSPECTION']
  Sequel.extension :columns_introspection
  Sequel::Database.extension :columns_introspection
  Sequel.require 'adapters/mock'
  Sequel::Mock::Dataset.send(:include, Sequel::ColumnsIntrospection)
end

# SEQUEL5: Remove
output = Sequel::Deprecation.output
Sequel::Deprecation.output = nil
Sequel.quote_identifiers = false
Sequel.identifier_input_method = nil
Sequel.identifier_output_method = nil
Sequel::Deprecation.output = output
