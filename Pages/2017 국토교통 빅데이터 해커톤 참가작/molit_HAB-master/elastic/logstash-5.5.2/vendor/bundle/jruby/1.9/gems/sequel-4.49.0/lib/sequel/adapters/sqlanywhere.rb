# frozen-string-literal: true

require 'sqlanywhere'

Sequel.require %w'shared/sqlanywhere', 'adapters'

module Sequel
  # Module for holding all SqlAnywhere-related classes and modules for Sequel.
  module SqlAnywhere

    class SQLAnywhereException < StandardError
      attr_reader :errno
      attr_reader :sql

      def initialize(message, errno, sql)
        super(message)
        @errno = errno
        @sql = sql
      end
    end

    tt = Class.new do
      def blob(s) ::Sequel::SQL::Blob.new(s) end
      def boolean(s) s.to_i != 0 end
      def date(s) ::Date.strptime(s) end
      def decimal(s) ::BigDecimal.new(s) end
      def time(s) ::Sequel.string_to_time(s) end
    end.new

    TYPE_TRANSLATOR = tt
    Sequel::Deprecation.deprecate_constant(self, :TYPE_TRANSLATOR)

    SQLANYWHERE_TYPES = {}
    {
        [0, 484] => tt.method(:decimal),
        [384] => tt.method(:date),
        [388] =>  tt.method(:time),
        [500] => tt.method(:boolean),
        [524, 528] => tt.method(:blob)
    }.each do |k,v|
      k.each{|n| SQLANYWHERE_TYPES[n] = v}
    end
    # SQLANYWHERE_TYPES.freeze # SEQUEL5

    # Database class for SQLAnywhere databases used with Sequel.
    class Database < Sequel::Database
      include Sequel::SqlAnywhere::DatabaseMethods

      DEFAULT_CONFIG = { :user => 'dba', :password => 'sql' }
      Sequel::Deprecation.deprecate_constant(self, :DEFAULT_CONFIG)

      attr_accessor :api

      set_adapter_scheme :sqlanywhere

      def connect(server)
        opts = server_opts(server)
        unless conn_string = opts[:conn_string]
          conn_string = []
          conn_string << "Host=#{opts[:host]}#{":#{opts[:port]}" if opts[:port]}" if opts[:host]
          conn_string << "DBN=#{opts[:database]}" if opts[:database]
          conn_string << "UID=#{opts[:user]}" if opts[:user]
          conn_string << "Password=#{opts[:password]}" if opts[:password]
          conn_string << "CommLinks=#{opts[:commlinks]}" if opts[:commlinks]
          conn_string << "ConnectionName=#{opts[:connection_name]}" if opts[:connection_name]
          conn_string << "CharSet=#{opts[:encoding]}" if opts[:encoding]
          conn_string << "Idle=0" # Prevent the server from disconnecting us if we're idle for >240mins (by default)
          conn_string << nil
          conn_string = conn_string.join(';')
        end

        conn = @api.sqlany_new_connection
        raise LoadError, "Could not connect" unless conn && @api.sqlany_connect(conn, conn_string) == 1

        if Sequel.application_timezone == :utc
          @api.sqlany_execute_immediate(conn, "SET TEMPORARY OPTION time_zone_adjustment=0")
        end

        conn
      end

      # Closes given database connection.
      def disconnect_connection(c)
        @api.sqlany_disconnect(c)
      end

      # Returns number of rows affected
      def execute_dui(sql, opts=OPTS)
        synchronize(opts[:server]) do |conn|
          _execute(conn, :rows, sql, opts)
        end
      end

      def execute(sql, opts=OPTS, &block)
        synchronize(opts[:server]) do |conn|
          _execute(conn, :select, sql, opts, &block)
        end
      end

      def execute_insert(sql, opts=OPTS)
        synchronize(opts[:server]) do |conn|
          _execute(conn, :insert, sql, opts)
        end
      end

      def freeze
        @conversion_procs.freeze
        super
      end

      private

      LAST_INSERT_ID = 'SELECT @@IDENTITY'.freeze
      Sequel::Deprecation.deprecate_constant(self, :LAST_INSERT_ID)
      def _execute(conn, type, sql, opts)
        unless rs = log_connection_yield(sql, conn){@api.sqlany_execute_direct(conn, sql)}
          result, errstr = @api.sqlany_error(conn)
          raise_error(SQLAnywhereException.new(errstr, result, sql))
        end

        case type
        when :select
          yield rs if block_given?
        when :rows
          return @api.sqlany_affected_rows(rs)
        when :insert
          _execute(conn, :select, 'SELECT @@IDENTITY', opts){|r| return @api.sqlany_get_column(r, 0)[1] if r && @api.sqlany_fetch_next(r) == 1}
        end
      ensure
        @api.sqlany_commit(conn) unless in_transaction?
        @api.sqlany_free_stmt(rs) if rs
      end

      def adapter_initialize
        @conversion_procs = SQLANYWHERE_TYPES.dup
        @conversion_procs[392] = method(:to_application_timestamp_sa)
        @api = SQLAnywhere::SQLAnywhereInterface.new
        raise LoadError, "Could not load SQLAnywhere DBCAPI library" if SQLAnywhere::API.sqlany_initialize_interface(@api) == 0
        raise LoadError, "Could not initialize SQLAnywhere DBCAPI library" if @api.sqlany_init == 0
      end

      def dataset_class_default
        Dataset
      end

      def log_connection_execute(conn, sql)
        _execute(conn, nil, sql, OPTS)
      end
    end

    # Dataset class for SqlAnywhere datasets accessed via the native driver.
    class Dataset < Sequel::Dataset
      include Sequel::SqlAnywhere::DatasetMethods

      Database::DatasetClass = self
      Sequel::Deprecation.deprecate_constant(Database, :DatasetClass)

      # Yield all rows matching this dataset.  If the dataset is set to
      # split multiple statements, yield arrays of hashes one per statement
      # instead of yielding results for all statements as hashes.
      def fetch_rows(sql)
        db = @db
        cps = db.conversion_procs
        api = db.api
        execute(sql) do |rs|
          convert = (convert_smallint_to_bool and db.convert_smallint_to_bool)
          col_infos = []
          api.sqlany_num_cols(rs).times do |i|
            _, _, name, _, type = api.sqlany_get_column_info(rs, i)
            cp = if type == 500
              cps[500] if convert
            else
              cps[type]
            end
            col_infos << [i, output_identifier(name), cp]
          end

          self.columns = col_infos.map{|a| a[1]}

          if rs
            while api.sqlany_fetch_next(rs) == 1
              h = {}
              col_infos.each do |i, name, cp|
                _, v = api.sqlany_get_column(rs, i)
                h[name] = cp && v ? cp[v] : v
              end
              yield h
            end
          end
        end
        self
      end
    end
  end
end
