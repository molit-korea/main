# frozen-string-literal: true

Sequel::Deprecation.deprecate("Sequel support for Cubrid", "Please consider maintaining it yourself as an external sequel adapter if you want to continue using it")

Sequel.require %w'split_alter_table unmodified_identifiers', 'adapters/utils'

module Sequel
  module Cubrid
    Sequel::Database.set_shared_adapter_scheme(:cubrid, self)

    module DatabaseMethods
      include Sequel::Database::SplitAlterTable
      include UnmodifiedIdentifiers::DatabaseMethods

      AUTOINCREMENT = 'AUTO_INCREMENT'.freeze
      Sequel::Deprecation.deprecate_constant(self, :AUTOINCREMENT)
      COLUMN_DEFINITION_ORDER = [:auto_increment, :default, :null, :unique, :primary_key, :references]#.freeze # SEQUEL5

      def database_type
        :cubrid
      end

      def indexes(table, opts=OPTS)
        m = output_identifier_meth
        m2 = input_identifier_meth
        indexes = {}
        metadata_dataset.
          from{db_index[:i]}.
          join(Sequel[:db_index_key].as(:k), :index_name=>:index_name, :class_name=>:class_name).
          where{{i[:class_name]=>m2.call(table), :is_primary_key=>'NO'}}.
          order{k[:key_order]}.
          select{[i[:index_name], k[:key_attr_name].as(:column), :is_unique]}.
          each do |row|
            index = indexes[m.call(row[:index_name])] ||= {:columns=>[], :unique=>row[:is_unique]=='YES'}
            index[:columns] << m.call(row[:column])
          end
        indexes
      end

      def supports_savepoints?
        false
      end

      def schema_parse_table(table_name, opts)
        m = output_identifier_meth(opts[:dataset])
        m2 = input_identifier_meth(opts[:dataset])

        pks = metadata_dataset.
          from{db_index[:i]}.
          join(Sequel[:db_index_key].as(:k), :index_name=>:index_name, :class_name=>:class_name).
          where{{i[:class_name]=>m2.call(table_name), :is_primary_key=>'YES'}}.
          order{k[:key_order]}.
          select_map{k[:key_attr_name]}.
          map{|c| m.call(c)}

        metadata_dataset.
          from(:db_attribute).
          where(:class_name=>m2.call(table_name)).
          order(:def_order).
          select{[:attr_name, data_type.as(:db_type), default_value.as(:default), is_nullable.as(:allow_null), :prec]}.
          map do |row|
            name = m.call(row.delete(:attr_name))
            row[:allow_null] = row[:allow_null] == 'YES'
            row[:primary_key] = pks.include?(name)
            row[:type] = schema_column_type(row[:db_type])
            row[:max_length] = row[:prec] if row[:type] == :string
            [name, row]
          end
      end

      def tables(opts=OPTS)
        _tables('CLASS')
      end

      def views(opts=OPTS)
        _tables('VCLASS')
      end

      private

      def _tables(type)
        m = output_identifier_meth
        metadata_dataset.
          from(:db_class).
          where(:is_system_class=>'NO', :class_type=>type).
          select_map(:class_name).
          map{|c| m.call(c)}
      end

      def alter_table_rename_column_sql(table, op)
        "RENAME COLUMN #{quote_identifier(op[:name])} AS #{quote_identifier(op[:new_name])}"
      end

      def alter_table_change_column_sql(table, op)
        o = op[:op]
        opts = schema(table).find{|x| x.first == op[:name]}
        opts = opts ? opts.last.dup : {}
        opts[:name] = o == :rename_column ? op[:new_name] : op[:name]
        opts[:type] = o == :set_column_type ? op[:type] : opts[:db_type]
        opts[:null] = o == :set_column_null ? op[:null] : opts[:allow_null]
        opts[:default] = o == :set_column_default ? op[:default] : opts[:ruby_default]
        opts.delete(:default) if opts[:default] == nil
        "CHANGE COLUMN #{quote_identifier(op[:name])} #{column_definition_sql(op.merge(opts))}"
      end
      alias alter_table_set_column_type_sql alter_table_change_column_sql
      alias alter_table_set_column_null_sql alter_table_change_column_sql
      alias alter_table_set_column_default_sql alter_table_change_column_sql

      def alter_table_sql(table, op)
        case op[:op]
        when :drop_index
          "ALTER TABLE #{quote_schema_table(table)} #{drop_index_sql(table, op)}"
        else
          super
        end
      end

      def auto_increment_sql
        'AUTO_INCREMENT'
      end

      # CUBRID requires auto increment before primary key
      def column_definition_order
        COLUMN_DEFINITION_ORDER
      end

      # CUBRID requires FOREIGN KEY keywords before a column reference
      def column_references_sql(column)
        sql = super
        sql = " FOREIGN KEY#{sql}" unless column[:columns]
        sql
      end

      def connection_execute_method
        :query
      end

      DATABASE_ERROR_REGEXPS = {
        /Operation would have caused one or more unique constraint violations/ => UniqueConstraintViolation,
        /The constraint of the foreign key .+ is invalid|Update\/Delete operations are restricted by the foreign key/ => ForeignKeyConstraintViolation,
        /cannot be made NULL/ => NotNullConstraintViolation,
        /Your transaction .+ has been unilaterally aborted by the system/ => SerializationFailure,
      }.freeze
      def database_error_regexps
        DATABASE_ERROR_REGEXPS
      end

      # CUBRID does not support named column constraints.
      def supports_named_column_constraints?
        false
      end

      # CUBRID doesn't support booleans, it recommends using smallint.
      def type_literal_generic_trueclass(column)
        :smallint
      end

      # CUBRID uses clob for text types.
      def uses_clob_for_text?
        true
      end

      # CUBRID supports views with check option, but not local.
      def view_with_check_option_support
        true
      end
    end
    
    module DatasetMethods
      include UnmodifiedIdentifiers::DatasetMethods

      COMMA = ', '.freeze
      Sequel::Deprecation.deprecate_constant(self, :COMMA)
      LIMIT = " LIMIT ".freeze
      Sequel::Deprecation.deprecate_constant(self, :LIMIT)
      BOOL_FALSE = '0'.freeze
      Sequel::Deprecation.deprecate_constant(self, :BOOL_FALSE)
      BOOL_TRUE = '1'.freeze
      Sequel::Deprecation.deprecate_constant(self, :BOOL_TRUE)
      ONLY_OFFSET = ",4294967295".freeze
      Sequel::Deprecation.deprecate_constant(self, :ONLY_OFFSET)

      def supports_join_using?
        false
      end

      def supports_multiple_column_in?
        false
      end

      def supports_timestamp_usecs?
        false
      end

      # CUBRID supposedly supports TRUNCATE, but it appears not to work in my testing.
      # Fallback to using DELETE.
      def truncate
        delete
        nil
      end

      private

      def literal_false
        '0'
      end

      def literal_true
        '1'
      end
     
      # CUBRID supports multiple rows in INSERT.
      def multi_insert_sql_strategy
        :values
      end

      # CUBRID requires a limit to use an offset,
      # and requires a FROM table if a limit is used.
      def select_limit_sql(sql)
        return unless @opts[:from]
        l = @opts[:limit]
        o = @opts[:offset]
        if l || o
          sql << " LIMIT "
          if o
            literal_append(sql, o)
            if l
              sql << ', '
              literal_append(sql, l)
            else
              # Hope you don't have more than 2**32 + offset rows in your dataset
              sql << ",4294967295"
            end
          else
            literal_append(sql, l)
          end
        end
      end

      # CUBRID doesn't support FOR UPDATE.
      def select_lock_sql(sql)
      end
    end
  end
end
