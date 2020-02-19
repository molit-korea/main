# frozen-string-literal: true

module Sequel
  module SqlAnywhere
    Sequel::Database.set_shared_adapter_scheme(:sqlanywhere, self)

    # SEQUEL5: Remove
    @convert_smallint_to_bool = true
    class << self
      def convert_smallint_to_bool
        Sequel::Deprecation.deprecate("Sequel::SqlAnywhere.convert_smallint_to_bool", "Call this method on the Database instance")
        @convert_smallint_to_bool
      end
      def convert_smallint_to_bool=(v)
        Sequel::Deprecation.deprecate("Sequel::SqlAnywhere.convert_smallint_to_bool=", "Call this method on the Database instance")
        @convert_smallint_to_bool = v
      end
    end

    module DatabaseMethods
      attr_reader :conversion_procs

      # Override the default SqlAnywhere.convert_smallint_to_bool setting for this database.
      attr_writer :convert_smallint_to_bool

      AUTO_INCREMENT = 'IDENTITY'.freeze
      Sequel::Deprecation.deprecate_constant(self, :AUTO_INCREMENT)
      SQL_BEGIN = "BEGIN TRANSACTION".freeze
      Sequel::Deprecation.deprecate_constant(self, :SQL_BEGIN)
      SQL_COMMIT = "COMMIT TRANSACTION".freeze
      Sequel::Deprecation.deprecate_constant(self, :SQL_COMMIT)
      SQL_ROLLBACK = "IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION".freeze
      Sequel::Deprecation.deprecate_constant(self, :SQL_ROLLBACK)
      TEMPORARY = "GLOBAL TEMPORARY ".freeze
      Sequel::Deprecation.deprecate_constant(self, :TEMPORARY)
      SMALLINT_RE = /smallint/i.freeze
      Sequel::Deprecation.deprecate_constant(self, :SMALLINT_RE)
      DECIMAL_TYPE_RE = /numeric/i
      Sequel::Deprecation.deprecate_constant(self, :DECIMAL_TYPE_RE)

      # Whether to convert smallint to boolean arguments for this dataset.
      # Defaults to the SqlAnywhere module setting.
      def convert_smallint_to_bool
        defined?(@convert_smallint_to_bool) ? @convert_smallint_to_bool : (@convert_smallint_to_bool = ::Sequel::SqlAnywhere.instance_variable_get(:@convert_smallint_to_bool)) # true) # SEQUEL5
      end

      # Sysbase Server uses the :sqlanywhere type.
      def database_type
        :sqlanywhere
      end

      def freeze
        convert_smallint_to_bool
        @conversion_procs.freeze
        super
      end

      def to_application_timestamp_sa(v)
        to_application_timestamp(v.to_s) if v
      end

      # Convert smallint type to boolean if convert_smallint_to_bool is true
      def schema_column_type(db_type)
        if convert_smallint_to_bool && db_type =~ /smallint/i
          :boolean
        else
          super
        end
      end

      def schema_parse_table(table, opts)
        m = output_identifier_meth(opts[:dataset])
        im = input_identifier_meth(opts[:dataset])
        metadata_dataset.
         from{sa_describe_query("select * from #{im.call(table)}").as(:a)}.
         join(Sequel[:syscolumn].as(:b), :table_id=>:base_table_id, :column_id=>:base_column_id).
         order{a[:column_number]}.
         map do |row|
          auto_increment = row.delete(:is_autoincrement)
          row[:auto_increment] = auto_increment == 1 || auto_increment == true
          row[:primary_key] = row.delete(:pkey) == 'Y'
          row[:allow_null] = row[:nulls_allowed].is_a?(Integer) ? row.delete(:nulls_allowed) == 1 : row.delete(:nulls_allowed)
          row[:db_type] = row.delete(:domain_name)
          row[:type] = if row[:db_type] =~ /numeric/i and (row[:scale].is_a?(Integer) ? row[:scale] == 0 : !row[:scale])
            :integer
          else
            schema_column_type(row[:db_type])
          end
          row[:max_length] = row[:width] if row[:type] == :string
          [m.call(row.delete(:name)), row]
        end
      end

      def indexes(table, opts = OPTS)
        m = output_identifier_meth
        im = input_identifier_meth
        indexes = {}
        metadata_dataset.
         from(Sequel[:dbo][:sysobjects].as(:z)).
         select{[
           z[:name].as(:table_name),
           i[:name].as(:index_name),
           si[:indextype].as(:type),
           si[:colnames].as(:columns)]}.
         join(Sequel[:dbo][:sysindexes].as(:i), :id=>:id).
         join(Sequel[:sys][:sysindexes].as(:si), :iname=> :name).
         where{{z[:type] => 'U', :table_name=>im.call(table)}}.
         each do |r|
          indexes[m.call(r[:index_name])] =
            {:unique=>(r[:type].downcase=='unique'),
             :columns=>r[:columns].split(',').map{|v| m.call(v.split(' ').first)}} unless r[:type].downcase == 'primary key'
        end
        indexes
      end

      def foreign_key_list(table, opts=OPTS)
        m = output_identifier_meth
        im = input_identifier_meth
        fk_indexes = {}
        metadata_dataset.
         from{sys[:sysforeignkey].as(:fk)}.
         select{[
           fk[:role].as(:name),
           fks[:columns].as(:column_map),
           si[:indextype].as(:type),
           si[:colnames].as(:columns),
           fks[:primary_tname].as(:table_name)]}.
         join(Sequel[:sys][:sysforeignkeys].as(:fks), :role => :role).
         join(Sequel[:sys][:sysindexes].as(:si), {:iname => Sequel[:fk][:role]}, {:implicit_qualifier => :fk}).
         where{{fks[:foreign_tname]=>im.call(table)}}.
         each do |r|
          unless r[:type].downcase == 'primary key'
            fk_indexes[r[:name]] =
              {:name=>m.call(r[:name]),
               :columns=>r[:columns].split(',').map{|v| m.call(v.split(' ').first)},
               :table=>m.call(r[:table_name]),
               :key=>r[:column_map].split(',').map{|v| m.call(v.split(' IS ').last)}}
          end
        end
        fk_indexes.values
      end

      def tables(opts=OPTS)
        tables_and_views('U', opts)
      end

      def views(opts=OPTS)
        tables_and_views('V', opts)
      end

      private

      DATABASE_ERROR_REGEXPS = {
        /would not be unique|Primary key for table.+is not unique/ => Sequel::UniqueConstraintViolation,
        /Column .* in table .* cannot be NULL/ => Sequel::NotNullConstraintViolation,
        /Constraint .* violated: Invalid value in table .*/ => Sequel::CheckConstraintViolation,
        /No primary key value for foreign key .* in table .*/ => Sequel::ForeignKeyConstraintViolation,
        /Primary key for row in table .* is referenced by foreign key .* in table .*/ => Sequel::ForeignKeyConstraintViolation
      }.freeze

      def database_error_regexps
        DATABASE_ERROR_REGEXPS
      end

      # Sybase uses the IDENTITY column for autoincrementing columns.
      def auto_increment_sql
        'IDENTITY'
      end
      
      # Sybase does not allow adding primary key constraints to NULLable columns.
      def can_add_primary_key_constraint_on_nullable_columns?
        false
      end

      # SQL fragment for marking a table as temporary
      def temporary_table_sql
        "GLOBAL TEMPORARY "
      end

      # SQL to BEGIN a transaction.
      def begin_transaction_sql
        "BEGIN TRANSACTION"
      end

      # SQL to ROLLBACK a transaction.
      def rollback_transaction_sql
        "IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION"
      end

      # SQL to COMMIT a transaction.
      def commit_transaction_sql
        "COMMIT TRANSACTION"
      end

      # Sybase has both datetime and timestamp classes, most people are going
      # to want datetime
      def type_literal_generic_datetime(column)
        :datetime
      end

      # Sybase has both datetime and timestamp classes, most people are going
      # to want datetime
      def type_literal_generic_time(column)
        column[:only_time] ? :time : :datetime
      end
      
      # Sybase doesn't have a true boolean class, so it uses integer
      def type_literal_generic_trueclass(column)
        :smallint
      end

      # SQLAnywhere uses image type for blobs
      def type_literal_generic_file(column)
        :image
      end

      # Sybase specific syntax for altering tables.
      def alter_table_sql(table, op)
        case op[:op]
        when :add_column
          "ALTER TABLE #{quote_schema_table(table)} ADD #{column_definition_sql(op)}"
        when :drop_column
          "ALTER TABLE #{quote_schema_table(table)} DROP #{column_definition_sql(op)}"
        when :drop_constraint
          case op[:type]
          when :primary_key
            "ALTER TABLE #{quote_schema_table(table)} DROP PRIMARY KEY"
          when :foreign_key
            if op[:name] || op[:columns]
              name = op[:name] || foreign_key_name(table, op[:columns])
              if name
                "ALTER TABLE #{quote_schema_table(table)} DROP FOREIGN KEY #{quote_identifier(name)}"
              end
            end
          else
            super
          end
        when :rename_column
          "ALTER TABLE #{quote_schema_table(table)} RENAME #{quote_identifier(op[:name])} TO #{quote_identifier(op[:new_name].to_s)}"
        when :set_column_type
          "ALTER TABLE #{quote_schema_table(table)} ALTER #{quote_identifier(op[:name])} #{type_literal(op)}"
        when :set_column_null
          "ALTER TABLE #{quote_schema_table(table)} ALTER #{quote_identifier(op[:name])} #{'NOT ' unless op[:null]}NULL"
        when :set_column_default
          "ALTER TABLE #{quote_schema_table(table)} ALTER #{quote_identifier(op[:name])} DEFAULT #{literal(op[:default])}"
        else
          super(table, op)
        end
      end

      # SqlAnywhere doesn't support CREATE TABLE AS, it only supports SELECT INTO.
      # Emulating CREATE TABLE AS using SELECT INTO is only possible if a dataset
      # is given as the argument, it can't work with a string, so raise an
      # Error if a string is given.
      def create_table_as(name, ds, options)
        raise(Error, "must provide dataset instance as value of create_table :as option on SqlAnywhere") unless ds.is_a?(Sequel::Dataset)
        run(ds.into(name).sql)
      end

      # Use SP_RENAME to rename the table
      def rename_table_sql(name, new_name)
        "ALTER TABLE #{quote_schema_table(name)} RENAME #{quote_schema_table(new_name)}"
      end

      def tables_and_views(type, opts=OPTS)
        m = output_identifier_meth
        metadata_dataset.
          from{sysobjects.as(:a)}.
          where{{a[:type]=>type}}.
          select_map{a[:name]}.
          map{|n| m.call(n)}
      end
      
      # SQLAnywhere supports views with check option, but not local.
      def view_with_check_option_support
        true
      end
    end

    module DatasetMethods
      BOOL_TRUE = '1'.freeze
      Sequel::Deprecation.deprecate_constant(self, :BOOL_TRUE)
      BOOL_FALSE = '0'.freeze
      Sequel::Deprecation.deprecate_constant(self, :BOOL_FALSE)
      WILDCARD = LiteralString.new('%').freeze
      Sequel::Deprecation.deprecate_constant(self, :WILDCARD)
      TOP = " TOP ".freeze
      Sequel::Deprecation.deprecate_constant(self, :TOP)
      START_AT = " START AT ".freeze
      Sequel::Deprecation.deprecate_constant(self, :START_AT)
      SQL_WITH_RECURSIVE = "WITH RECURSIVE ".freeze
      Sequel::Deprecation.deprecate_constant(self, :SQL_WITH_RECURSIVE)
      DATE_FUNCTION = 'today()'.freeze
      Sequel::Deprecation.deprecate_constant(self, :DATE_FUNCTION)
      NOW_FUNCTION = 'now()'.freeze
      Sequel::Deprecation.deprecate_constant(self, :NOW_FUNCTION)
      DATEPART = 'datepart'.freeze
      Sequel::Deprecation.deprecate_constant(self, :DATEPART)
      REGEXP = 'REGEXP'.freeze
      Sequel::Deprecation.deprecate_constant(self, :REGEXP)
      NOT_REGEXP = 'NOT REGEXP'.freeze
      Sequel::Deprecation.deprecate_constant(self, :NOT_REGEXP)
      APOS = "'".freeze
      Sequel::Deprecation.deprecate_constant(self, :APOS)
      APOS_RE = /'/.freeze
      Sequel::Deprecation.deprecate_constant(self, :APOS_RE)
      DOUBLE_APOS = "''".freeze
      Sequel::Deprecation.deprecate_constant(self, :DOUBLE_APOS)
      BACKSLASH_RE = /\\/.freeze
      Sequel::Deprecation.deprecate_constant(self, :BACKSLASH_RE)
      QUAD_BACKSLASH = "\\\\\\\\".freeze
      Sequel::Deprecation.deprecate_constant(self, :QUAD_BACKSLASH)
      BLOB_START = "0x".freeze
      Sequel::Deprecation.deprecate_constant(self, :BLOB_START)
      HSTAR = "H*".freeze
      Sequel::Deprecation.deprecate_constant(self, :HSTAR)
      CROSS_APPLY = 'CROSS APPLY'.freeze
      Sequel::Deprecation.deprecate_constant(self, :CROSS_APPLY)
      OUTER_APPLY = 'OUTER APPLY'.freeze
      Sequel::Deprecation.deprecate_constant(self, :OUTER_APPLY)
      ONLY_OFFSET = " TOP 2147483647".freeze
      Sequel::Deprecation.deprecate_constant(self, :ONLY_OFFSET)

      Dataset.def_sql_method(self, :insert, %w'with insert into columns values')
      Dataset.def_sql_method(self, :select, %w'with select distinct limit columns into from join where group having compounds order lock')

      # Override the default IBMDB.convert_smallint_to_bool setting for this dataset.
      def convert_smallint_to_bool=(v)
        Sequel::Deprecation.deprecate("Sequel::SqlAnywhere::Dataset#convert_smallint_to_bool=", "Call with_convert_smallint_to_bool instead, which returns a modified copy instead of modifying the object")
        @opts[:convert_smallint_to_bool] = v
      end

      # Whether to convert smallint to boolean arguments for this dataset.
      # Defaults to the IBMDB module setting.
      def convert_smallint_to_bool
        opts.has_key?(:convert_smallint_to_bool) ? opts[:convert_smallint_to_bool] : db.convert_smallint_to_bool
      end

      # Return a cloned dataset with the convert_smallint_to_bool option set.
      def with_convert_smallint_to_bool(v)
        clone(:convert_smallint_to_bool=>v)
      end

      def supports_cte?(type=:select)
        type == :select || type == :insert
      end

      # SQLAnywhere supports GROUPING SETS
      def supports_grouping_sets?
        true
      end

      def supports_multiple_column_in?
        false
      end

      def supports_where_true?
        false
      end

      def supports_is_true?
        false
      end

      def supports_join_using?
        false
      end

      def supports_timestamp_usecs?
        false
      end

      # Uses CROSS APPLY to join the given table into the current dataset.
      def cross_apply(table)
        join_table(:cross_apply, table)
      end

      # SqlAnywhere requires recursive CTEs to have column aliases.
      def recursive_cte_requires_column_aliases?
        true
      end

      # SQLAnywhere uses + for string concatenation, and LIKE is case insensitive by default.
      def complex_expression_sql_append(sql, op, args)
        case op
        when :'||'
          super(sql, :+, args)
        when :<<, :>>
          complex_expression_emulate_append(sql, op, args)
        when :LIKE, :"NOT LIKE"
          sql << '('
          literal_append(sql, args[0])
          sql << (op == :LIKE ? ' REGEXP ' : ' NOT REGEXP ')
          pattern = String.new
          last_c = ''
          args[1].each_char do |c|
            if  c == '_' and not pattern.end_with?('\\') and last_c != '\\'
              pattern << '.'
            elsif c == '%' and not pattern.end_with?('\\') and last_c != '\\'
              pattern << '.*'
            elsif c == '[' and not pattern.end_with?('\\') and last_c != '\\'
              pattern << '\['
            elsif c == ']' and not pattern.end_with?('\\') and last_c != '\\'
              pattern << '\]'
            elsif c == '*' and not pattern.end_with?('\\') and last_c != '\\'
              pattern << '\*'
            elsif c == '?' and not pattern.end_with?('\\') and last_c != '\\'
              pattern << '\?'
            else
              pattern << c
            end
            if c == '\\' and last_c == '\\'
              last_c = ''
            else
              last_c = c
            end
          end
          literal_append(sql, pattern)
          sql << " ESCAPE "
          literal_append(sql, "\\")
          sql << ')'
        when :ILIKE, :"NOT ILIKE"
          super(sql, (op == :ILIKE ? :LIKE : :"NOT LIKE"), args)
        when :extract
          sql << 'datepart('
          literal_append(sql, args[0])
          sql << ','
          literal_append(sql, args[1])
          sql << ')'
        else
          super
        end
      end

      # SqlAnywhere uses \\ to escape metacharacters, but a ']' should not be escaped
      def escape_like(string)
        string.gsub(/[\\%_\[]/){|m| "\\#{m}"}
      end

      # Use today() and Now() for CURRENT_DATE and CURRENT_TIMESTAMP
      def constant_sql_append(sql, constant)
        case constant
        when :CURRENT_DATE
          sql << 'today()'
        when :CURRENT_TIMESTAMP, :CURRENT_TIME
          sql << 'now()'
        else
          super
        end
      end

      # Specify a table for a SELECT ... INTO query.
      def into(table)
        clone(:into => table)
      end

      private

      # Use 1 for true on Sybase
      def literal_true
        '1'
      end

      # Use 0 for false on Sybase
      def literal_false
        '0'
      end

      # SQL fragment for String.  Doubles \ and ' by default.
      def literal_string_append(sql, v)
        sql << "'" << v.gsub("\\", "\\\\\\\\").gsub("'", "''") << "'"
      end

      # SqlAnywhere uses a preceding X for hex escaping strings
      def literal_blob_append(sql, v)
        if v.empty?
          literal_append(sql, "")
        else
          sql << "0x" << v.unpack("H*").first
        end
      end

      # Sybase supports multiple rows in INSERT.
      def multi_insert_sql_strategy
        :values
      end

      def select_into_sql(sql)
        if i = @opts[:into]
          sql << " INTO "
          identifier_append(sql, i)
        end
      end

      # Sybase uses TOP N for limit.  For Sybase TOP (N) is used
      # to allow the limit to be a bound variable.
      def select_limit_sql(sql)
        l = @opts[:limit]
        o = @opts[:offset]
        if l || o
          if l
            sql << " TOP "
            literal_append(sql, l)
          else
            sql << " TOP 2147483647"
          end

          if o 
            sql << " START AT ("
            literal_append(sql, o)
            sql << " + 1)"
          end
        end
      end

      # Use WITH RECURSIVE instead of WITH if any of the CTEs is recursive
      def select_with_sql_base
        opts[:with].any?{|w| w[:recursive]} ? "WITH RECURSIVE " : super
      end

      def join_type_sql(join_type)
        case join_type
        when :cross_apply
          'CROSS APPLY'
        when :outer_apply
          'OUTER APPLY'
        else
          super
        end
      end

      # SQLAnywhere supports millisecond timestamp precision.
      def timestamp_precision
        3
      end
    end
  end
end
