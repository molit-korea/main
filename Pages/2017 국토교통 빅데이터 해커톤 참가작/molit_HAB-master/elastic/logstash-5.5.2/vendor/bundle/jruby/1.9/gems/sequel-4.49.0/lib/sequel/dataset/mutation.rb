# frozen-string-literal: true

module Sequel
  class Dataset
    # ---------------------
    # :section: 7 - Mutation methods
    # These methods modify the receiving dataset and should be used with care.
    # ---------------------
    
    # All methods that should have a ! method added that modifies the receiver.
    MUTATION_METHODS = QUERY_METHODS - [:naked, :from_self]
    Sequel::Deprecation.deprecate_constant(self, :MUTATION_METHODS)
    
    # Setup mutation (e.g. filter!) methods.  These operate the same as the
    # non-! methods, but replace the options of the current dataset with the
    # options of the resulting dataset.
    #
    # Do not call this method with untrusted input, as that can result in
    # arbitrary code execution.
    def self.def_mutation_method(*meths)
      options = meths.pop if meths.last.is_a?(Hash)
      mod = options[:module] if options
      mod ||= self
      meths.each do |meth|
        mod.class_eval("def #{meth}!(*args, &block); mutation_method(:#{meth}, *args, &block) end", __FILE__, __LINE__)
      end
    end
    
    # Add the mutation methods via metaprogramming
    def_mutation_method(*(QUERY_METHODS - [:naked, :from_self]))
    
    # Like #extension, but modifies and returns the receiver instead of returning a modified clone.
    def extension!(*exts)
      raise_if_frozen!(%w"extension! extension")
      _extension!(exts)
    end

    # Avoid self-referential dataset by cloning.
    def from_self!(*args, &block)
      raise_if_frozen!(%w"from_self! from_self")
      @opts = clone.from_self(*args, &block).opts
      self
    end

    # Remove the row_proc from the current dataset.
    def naked!
      raise_if_frozen!(%w"naked! naked")
      @opts[:row_proc] = nil
      self
    end
    
    # Set whether to quote identifiers for this dataset
    def quote_identifiers=(v)
      raise_if_frozen!(%w"quote_identifiers= with_quote_identifiers")
      skip_symbol_cache!
      @opts[:quote_identifiers] = v
    end

    # Override the row_proc for this dataset
    def row_proc=(v)
      raise_if_frozen!(%w"row_proc= with_row_proc")
      @opts[:row_proc] = v
    end
    
    private
    
    # Modify the receiver with the results of sending the meth, args, and block
    # to the receiver and merging the options of the resulting dataset into
    # the receiver's options.
    def mutation_method(meth, *args, &block)
      raise_if_frozen!(["#{meth}!", meth])
      @opts = send(meth, *args, &block).opts
      @cache = {}
      self
    end

    # Raise a RuntimeError if the receiver is frozen
    def raise_if_frozen!(meth = nil)
      if frozen?
        raise RuntimeError, "can't modify frozen #{visible_class_name}"
      end
      case meth
      when Array
        meth = " (method called: #{meth.first}, non-mutating replacement: #{meth.last})"
      when String
        # :nocov:
        meth = " (method called: #{meth})"
        # :nocov:
      end
      Sequel::Deprecation.deprecate("Dataset mutation is deprecated and will be removed in Sequel 5#{meth}")
    end

    # Set the dataset to skip the symbol cache
    def skip_symbol_cache!
      @opts[:skip_symbol_cache] = true
    end
  end
end
