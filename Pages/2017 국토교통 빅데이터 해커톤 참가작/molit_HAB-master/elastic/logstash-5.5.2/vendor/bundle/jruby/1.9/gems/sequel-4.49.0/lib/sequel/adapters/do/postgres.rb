# frozen-string-literal: true

Sequel::DataObjects.load_driver 'do_postgres'
Sequel.require 'adapters/shared/postgres'

module Sequel
  module DataObjects
    Sequel.synchronize do
      DATABASE_SETUP[:postgres] = proc do |db|
        db.extend(Sequel::DataObjects::Postgres::DatabaseMethods)
        db.extend_datasets Sequel::Postgres::DatasetMethods
      end
    end

    # Adapter, Database, and Dataset support for accessing a PostgreSQL
    # database via DataObjects.
    module Postgres
      # Methods to add to Database instances that access PostgreSQL via
      # DataObjects.
      module DatabaseMethods
        include Sequel::Postgres::DatabaseMethods
        
        # Add the primary_keys and primary_key_sequences instance variables,
        # so we can get the correct return values for inserted rows.
        def self.extended(db)
          super
          db.send(:initialize_postgres_adapter)
        end
        
        private
        
        DATABASE_ERROR_CLASSES = [::DataObjects::Error].freeze
        def database_error_classes
          DATABASE_ERROR_CLASSES
        end

        # Extend the adapter with the DataObjects PostgreSQL AdapterMethods
        def setup_connection(conn)
          conn = super(conn)
          connection_configuration_sqls.each{|sql| log_connection_yield(sql, conn){conn.create_command(sql).execute_non_query}}
          conn
        end
      end
    end
  end
end
