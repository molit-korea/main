# frozen-string-literal: true

module Sequel
  module Plugins
    # The prepared_statements plugin modifies the model to use prepared statements for
    # instance level saves (inserts and updates).  It also will use prepared statements for
    # deletes, refreshes, and class level lookups by primary key, if it thinks that using
    # a prepared statement will be faster in such cases.
    #
    # Note that this plugin is unsafe in some circumstances, as it can allow up to
    # 2^N prepared statements to be created for each type of insert and update query, where
    # N is the number of colums in the table. It is recommended that you use the
    # +prepared_statements_safe+ plugin in addition to this plugin to reduce the number
    # of prepared statements that can be created, unless you tightly control how your
    # model instances are saved.
    # 
    # Usage:
    #
    #   # Make all model subclasses use prepared statements  (called before loading subclasses)
    #   Sequel::Model.plugin :prepared_statements
    #
    #   # Make the Album class use prepared statements
    #   Album.plugin :prepared_statements
    module PreparedStatements
      # Synchronize access to the integer sequence so that no two calls get the same integer.
      MUTEX = Mutex.new
      
      i = 0
      # This plugin names prepared statements uniquely using an integer sequence, this
      # lambda returns the next integer to use.
      NEXT = lambda{MUTEX.synchronize{i += 1}}

      # Setup the datastructure used to hold the prepared statements in the model.
      def self.apply(model)
        # SEQUEL5: Drop Support for :fixed/:lookup_sql SQL
        model.instance_variable_set(:@prepared_statements, {:insert=>{}, :insert_select=>{}, :update=>{}, :lookup_sql=>{}, :fixed=>{}}.freeze)
      end

      module ClassMethods
        Plugins.inherited_instance_variables(self, :@prepared_statements=>lambda{|v| {:insert=>{}, :insert_select=>{}, :update=>{}, :lookup_sql=>{}, :fixed=>{}}.freeze})

        private

        # Create a prepared statement, but modify the SQL used so that the model's columns are explicitly
        # selected instead of using *, assuming that the dataset selects from a single table.
        def prepare_explicit_statement(ds, type, vals=OPTS)
          f = ds.opts[:from]
          meth = type == :insert_select ? :returning : :select
          s = ds.opts[meth]
          if f && f.length == 1 && !ds.opts[:join] && (!s || s.empty?)
            ds = ds.send(meth, *columns.map{|c| Sequel.identifier(c)})
          end 
          
          prepare_statement(ds, type, vals)
        end

        # Create a prepared statement based on the given dataset with a unique name for the given
        # type of query and values.
        def prepare_statement(ds, type, vals=OPTS)
          ds.clone(:log_sql=>true).prepare(type, :"smpsp_#{NEXT.call}", vals)
        end

        # Return a sorted array of columns for use as a hash key.
        def prepared_columns(cols)
          RUBY_VERSION >= '1.9' ? cols.sort : cols.sort_by(&:to_s)
        end

        # Return a prepared statement that can be used to delete a row from this model's dataset.
        def prepared_delete
          # SEQUEL5: Remove
          cached_prepared_statement(:fixed, :delete){prepare_statement(filter(prepared_statement_key_array(primary_key)), :delete)}
        end

        # Return a prepared statement that can be used to insert a row using the given columns.
        def prepared_insert(cols)
          cached_prepared_statement(:insert, prepared_columns(cols)){prepare_statement(dataset, :insert, prepared_statement_key_hash(cols))}
        end

        # Return a prepared statement that can be used to insert a row using the given columns
        # and return that column values for the row created.
        def prepared_insert_select(cols)
          if dataset.supports_insert_select?
            cached_prepared_statement(:insert_select, prepared_columns(cols)){prepare_explicit_statement(naked.clone(:server=>dataset.opts.fetch(:server, :default)), :insert_select, prepared_statement_key_hash(cols))}
          end
        end

        # Return a prepared statement that can be used to lookup a row solely based on the primary key.
        def prepared_lookup
          # SEQUEL5: Remove
          cached_prepared_statement(:fixed, :lookup){prepare_explicit_statement(filter(prepared_statement_key_array(primary_key)), :first)}
        end

        # Return a prepared statement that can be used to refresh a row to get new column values after insertion.
        def prepared_refresh
          # SEQUEL5: Remove
          cached_prepared_statement(:fixed, :refresh){prepare_explicit_statement(naked.clone(:server=>dataset.opts.fetch(:server, :default)).where(prepared_statement_key_array(primary_key)), :first)}
        end

        # Return an array of two element arrays with the column symbol as the first entry and the
        # placeholder symbol as the second entry.
        def prepared_statement_key_array(keys)
          if dataset.requires_placeholder_type_specifiers?
            sch = db_schema
            Array(keys).map do |k|
              if (s = sch[k]) && (t = s[:type])
                [k, :"$#{k}__#{t}"]
              else
                [k, :"$#{k}"]
              end
            end
          else
            Array(keys).map{|k| [k, :"$#{k}"]}
          end
        end

        # Return a hash mapping column symbols to placeholder symbols.
        def prepared_statement_key_hash(keys)
          Hash[*(prepared_statement_key_array(keys).flatten)]
        end

        # Return a prepared statement that can be used to update row using the given columns.
        def prepared_update(cols)
          cached_prepared_statement(:update, prepared_columns(cols)){prepare_statement(filter(prepared_statement_key_array(primary_key)), :update, prepared_statement_key_hash(cols))}
        end

        # Use a prepared statement to query the database for the row matching the given primary key.
        def primary_key_lookup(pk)
          return super unless use_prepared_statements_for_pk_lookup?
          # SEQUEL5: Remove
          prepared_lookup.call(primary_key_hash(pk))
        end

        # If a prepared statement has already been cached for the given type and subtype,
        # return it.  Otherwise, yield to the block to get the prepared statement, and cache it.
        def cached_prepared_statement(type, subtype)
          h = @prepared_statements[type]
          Sequel.synchronize do
            if v = h[subtype]
              return v
            end
          end
          ps = yield
          Sequel.synchronize{h[subtype] = ps}
        end

        # Whether to use prepared statements for lookups by primary key.  True if the default
        # primary key lookup isn't optimized.
        def use_prepared_statements_for_pk_lookup?
          !@fast_pk_lookup_sql && !dataset.joined_dataset?
        end
      end

      module InstanceMethods
        private

        # Use a prepared statement to delete the row.
        def _delete_without_checking
          # SEQUEL5: Remove
          if use_prepared_statements_for?(:delete)
            _set_prepared_statement_server(model.send(:prepared_delete)).call(pk_hash)
          else
            super
          end
        end

        # Use a prepared statement to insert the values into the model's dataset.
        def _insert_raw(ds)
          if use_prepared_statements_for?(:insert)
            _set_prepared_statement_server(model.send(:prepared_insert, @values.keys)).call(@values)
          else
            super
          end
        end

        # Use a prepared statement to insert the values into the model's dataset
        # and return the new column values.
        def _insert_select_raw(ds)
          if use_prepared_statements_for?(:insert_select)
            if ps = model.send(:prepared_insert_select, @values.keys)
              _set_prepared_statement_server(ps).call(@values)
            end
          else
            super
          end
        end

        # Use a prepared statement to refresh this model's column values.
        def _refresh_get(ds)
          # SEQUEL5: Remove
          if use_prepared_statements_for?(:refresh)
            _set_prepared_statement_server(model.send(:prepared_refresh)).call(pk_hash)
          else
            super
          end
        end

        # Use a prepared statement to update this model's columns in the database.
        def _update_without_checking(columns)
          if use_prepared_statements_for?(:update)
            _set_prepared_statement_server(model.send(:prepared_update, columns.keys)).call(Hash[columns].merge!(pk_hash))
          else
            super
          end
        end

        # If a server is set for the instance, return a prepared statement that will use that server.
        def _set_prepared_statement_server(ps)
          if @server
            ps.server(@server)
          else
            ps
          end
        end

        # Whether prepared statements should be used for the given type of query
        # (:insert, :insert_select, :refresh, :update, or :delete).  True by default,
        # can be overridden in other plugins to disallow prepared statements for
        # specific types of queries.
        def use_prepared_statements_for?(type)
          if defined?(super)
            result = super
            return result unless result.nil?
          end

          case type
          when :insert, :insert_select, :update
            true
          # SEQUEL5: Remove :delete/:refresh
          when :delete
            return true unless model.fast_instance_delete_sql

            # Using deletes for prepared statements appears faster on Oracle and DB2,
            # but not for most other database types if optimized SQL is used.
            db_type = model.db.database_type
            db_type == :oracle || db_type == :db2
          when :refresh
            !model.fast_pk_lookup_sql
          else
            raise Error, "unsupported type used: #{type.inspect}"
          end
        end
      end
    end
  end
end
