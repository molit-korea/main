require File.join(File.dirname(File.expand_path(__FILE__)), "spec_helper")

describe "prepared_statements plugin" do
  before do
    @db = Sequel.mock(:fetch=>{:id=>1, :name=>'foo', :i=>2}, :autoid=>proc{|sql| 1}, :numrows=>1, :servers=>{:read_only=>{}})
    @c = Class.new(Sequel::Model(@db[:people]))
    @c.columns :id, :name, :i
    @c.set_primary_key :id
    @columns = "id, name, i"
    @c.plugin :prepared_statements
    @p = @c.load(:id=>1, :name=>'foo', :i=>2)
    @ds = @c.dataset
    @db.sqls
  end

  deprecated "should correctly lookup by primary key for joined dataset" do
    @c.dataset = @c.dataset.from(:people, :people2)
    @db.sqls
    @c[1].must_equal @p
    @db.sqls.must_equal ["SELECT * FROM people, people2 WHERE (people.id = 1) LIMIT 1 -- read_only"]
  end 

  it "should correctly lookup by primary key for dataset using subquery" do
    @c.dataset = @c.dataset.from(:people, :people2).from_self(:alias=>:people)
    @db.sqls
    @c[1].must_equal @p
    @db.sqls.must_equal ["SELECT * FROM (SELECT * FROM people, people2) AS people WHERE (id = 1) LIMIT 1 -- read_only"]
  end 

  it "should use prepared statements for pk lookups only if default is not optimized" do
    @c.send(:use_prepared_statements_for_pk_lookup?).must_equal false 
    @c.set_primary_key [:id, :name]
    @c.send(:use_prepared_statements_for_pk_lookup?).must_equal true
    @c.set_primary_key :id
    deprecated do
    @c.dataset = @c.dataset.from(:people, :people2)
    @c.send(:use_prepared_statements_for_pk_lookup?).must_equal false
    end
    @c.dataset = @db[:people].select(:id, :name, :i)
    @c.send(:use_prepared_statements_for_pk_lookup?).must_equal true
  end

  it "should use prepared statements for refreshes if default is not optimized" do
    @p.send(:use_prepared_statements_for?, :refresh).must_equal false 
    @c.set_primary_key [:id, :name]
    @p.send(:use_prepared_statements_for?, :refresh).must_equal true
  end

  it "should use prepared statements for deletes if default is not optimized" do
    @p.send(:use_prepared_statements_for?, :delete).must_equal false 
    @c.set_primary_key [:id, :name]
    @p.send(:use_prepared_statements_for?, :delete).must_equal true
  end

  it "should use prepared statements for deletes if default on Oracle and DB2" do
    def @db.database_type; :oracle end
    @p.send(:use_prepared_statements_for?, :delete).must_equal true
    def @db.database_type; :db2 end
    @p.send(:use_prepared_statements_for?, :delete).must_equal true
  end

  it "should raise Error for unsupported prepared statement types" do
    proc{@p.send(:use_prepared_statements_for?, :foo)}.must_raise Sequel::Error
  end

  prepared_statements_spec = shared_description do
    it "should correctly update instance" do
      @p.update(:name=>'bar').must_equal @c.load(:id=>1, :name=>'bar', :i => 2)
      @db.sqls.must_equal ["UPDATE people SET name = 'bar' WHERE (id = 1)"]
    end

    it "should correctly create instance if dataset supports insert_select" do
      @c.dataset_module do
        def supports_insert_select?
          true
        end
        def supports_returning?(type)
          true
        end
        def insert_select(h)
          cache_set(:_fetch, :id=>1, :name=>'foo', :i => 2)
          server(:default).with_sql_first(insert_select_sql(h))
        end
        def insert_select_sql(*v)
          "#{insert_sql(*v)} RETURNING #{(opts[:returning] && !opts[:returning].empty?) ? opts[:returning].map{|c| literal(c)}.join(', ') : '*'}"
        end
      end
      @c.create(:name=>'foo').must_equal @c.load(:id=>1, :name=>'foo', :i => 2)
      @db.sqls.must_equal ["INSERT INTO people (name) VALUES ('foo') RETURNING #{@columns}"]
    end
  end

  describe "when #use_prepared_statements_for? returns true" do
    before do
      @c.class_eval do
        def self.use_prepared_statements_for_pk_lookup?; true end
        def use_prepared_statements_for?(type) true end
      end
    end

    include prepared_statements_spec

    it "should correctly create instance" do
      @c.create(:name=>'foo').must_equal @c.load(:id=>1, :name=>'foo', :i => 2)
      @db.sqls.must_equal ["INSERT INTO people (name) VALUES ('foo')", "SELECT #{@columns} FROM people WHERE (id = 1) LIMIT 1"]
    end

    it "should correctly lookup by primary key" do
      @c[1].must_equal @p
      @db.sqls.must_equal ["SELECT id, name, i FROM people WHERE (id = 1) LIMIT 1 -- read_only"]
    end 

    it "should correctly delete instance" do
      @p.destroy.must_equal @p
      @db.sqls.must_equal ["DELETE FROM people WHERE (id = 1)"]
    end

    it "should correctly delete instance when specifying server" do
      @p.set_server(:read_only).destroy.must_equal @p
      @db.sqls.must_equal ["DELETE FROM people WHERE (id = 1) -- read_only"]
    end

    it "should correctly update instance when specifying server" do
      @p.set_server(:read_only).update(:name=>'bar').must_equal @c.load(:id=>1, :name=>'bar', :i => 2)
      @db.sqls.must_equal ["UPDATE people SET name = 'bar' WHERE (id = 1) -- read_only"]
    end

    it "should correctly create instance when specifying server" do
      @c.new(:name=>'foo').set_server(:read_only).save.must_equal @c.load(:id=>1, :name=>'foo', :i => 2)
      @db.sqls.must_equal ["INSERT INTO people (name) VALUES ('foo') -- read_only", "SELECT #{@columns} FROM people WHERE (id = 1) LIMIT 1 -- read_only"]
    end

    it "should correctly create instance if dataset supports insert_select when specifying server" do
      @c.dataset_module do
        def supports_insert_select?
          true
        end
        def supports_returning?(type)
          true
        end
        def insert_select(h)
          cache_set(:_fetch, :id=>1, :name=>'foo', :i => 2)
          server(:default).with_sql_first(insert_select_sql(h))
        end
        def insert_select_sql(*v)
          "#{insert_sql(*v)} RETURNING #{(opts[:returning] && !opts[:returning].empty?) ? opts[:returning].map{|c| literal(c)}.join(', ') : '*'}"
        end
      end
      @c.new(:name=>'foo').set_server(:read_only).save.must_equal @c.load(:id=>1, :name=>'foo', :i => 2)
      @db.sqls.must_equal ["INSERT INTO people (name) VALUES ('foo') RETURNING #{@columns} -- read_only"]
    end

    it "should work correctly when subclassing" do
      c = Class.new(@c)
      c[1].must_equal c.load(:id=>1, :name=>'foo', :i=>2)
      @db.sqls.must_equal ["SELECT id, name, i FROM people WHERE (id = 1) LIMIT 1 -- read_only"]
    end 

    it "should correctly handle without schema type when placeholder type specifiers are required" do
      @c.dataset = @ds.with_extend{def requires_placeholder_type_specifiers?; true end}
      @c[1].must_equal @p
      @db.sqls.must_equal ["SELECT id, name, i FROM people WHERE (id = 1) LIMIT 1 -- read_only"]
    end

    it "should correctly handle with schema type when placeholder type specifiers are required" do
      @c.dataset = @ds.with_extend do
        def requires_placeholder_type_specifiers?; true end
        def prepare(*)
          super.with_extend do 
            def literal_symbol_append(sql, v)
              if @opts[:bind_vars] && (match = /\A\$(.*)\z/.match(v.to_s))
                s = match[1].split('__')[0].to_sym
                if prepared_arg?(s)
                  literal_append(sql, prepared_arg(s))
                else
                  sql << v.to_s
                end
              else
                super
              end
            end
          end
        end
      end
      @c.db_schema[:id][:type] = :integer
      @c[1].must_equal @p
      @db.sqls.must_equal ["SELECT id, name, i FROM people WHERE (id = 1) LIMIT 1 -- read_only"]
    end 
  end

  describe "when #use_prepared_statements_for? returns false" do
    before do
      @columns = "*"
      @c.class_eval do
        def self.use_prepared_statements_for_pk_lookup?; false end
        def use_prepared_statements_for?(type) false end
      end
    end

    include prepared_statements_spec

    it "should correctly create instance" do
      @c.create(:name=>'foo').must_equal @c.load(:id=>1, :name=>'foo', :i => 2)
      @db.sqls.must_equal ["INSERT INTO people (name) VALUES ('foo')", "SELECT #{@columns} FROM people WHERE id = 1"]
    end

    it "should correctly lookup by primary key" do
      @c[1].must_equal @p
      @db.sqls.must_equal ["SELECT * FROM people WHERE id = 1 -- read_only"]
    end 

    it "should correctly delete instance" do
      @p.destroy.must_equal @p
      @db.sqls.must_equal ["DELETE FROM people WHERE id = 1"]
    end
  end
end
