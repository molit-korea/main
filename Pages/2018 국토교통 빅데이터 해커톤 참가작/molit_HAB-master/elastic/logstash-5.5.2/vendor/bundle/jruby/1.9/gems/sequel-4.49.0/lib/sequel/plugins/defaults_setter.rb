# frozen-string-literal: true

module Sequel
  module Plugins
    # The defaults_setter plugin makes the column getter methods return the default
    # values for new objects, if the values have not already been set.  Example:
    #
    #   # column a default NULL
    #   # column b default 2
    #   album = Album.new
    #   album.a # => nil
    #   album.b # => 2
    #   album = Album.new(:a=>1, :b=>3)
    #   album.a # => 1
    #   album.b # => 3
    #
    # You can manually set default values as well:
    #
    #   Album.default_values[:a] = 4
    #   Album.new.a # => 4
    #
    # You can also provide procs to set default values:
    #
    #   Album.default_values[:a] = lambda{Date.today}
    #   Album.new.a # => Date.today
    # 
    # Usage:
    #
    #   # Make all model subclass instances set defaults (called before loading subclasses)
    #   Sequel::Model.plugin :defaults_setter
    #
    #   # Make the Album class set defaults 
    #   Album.plugin :defaults_setter
    module DefaultsSetter
      # Set the default values based on the model schema
      def self.configure(model)
        model.send(:set_default_values)
      end

      module ClassMethods
        # The default values to set in initialize for this model.  A hash with column symbol
        # keys and default values.  If the default values respond to +call+, it will be called
        # to get the value, otherwise the value will be used directly.  You can manually modify
        # this hash to set specific default values, by default the ones will be parsed from the database.
        attr_reader :default_values
        
        Plugins.after_set_dataset(self, :set_default_values)

        Plugins.inherited_instance_variables(self, :@default_values=>:dup)

        # Freeze default values when freezing model class
        def freeze
          @default_values.freeze
          super
        end

        private

        # Parse the cached database schema for this model and set the default values appropriately.
        def set_default_values
          h = {}
          @db_schema.each{|k, v| h[k] = convert_default_value(v[:ruby_default]) unless v[:ruby_default].nil?} if @db_schema
          @default_values = h.merge!(@default_values || {})
        end

        # Handle the CURRENT_DATE and CURRENT_TIMESTAMP values specially by returning an appropriate Date or
        # Time/DateTime value.
        def convert_default_value(v)
          case v
          when Sequel::CURRENT_DATE
            lambda{Date.today}
          when Sequel::CURRENT_TIMESTAMP
            lambda{dataset.current_datetime}
          else
            v
          end
        end
      end

      module InstanceMethods
        # Use default value for a new record if values doesn't already contain an entry for it.
        def [](k)
          if new? && !values.has_key?(k)
            v = model.default_values[k]
            v.respond_to?(:call) ? v.call : v
          else
            super
          end
        end
      end
    end
  end
end
