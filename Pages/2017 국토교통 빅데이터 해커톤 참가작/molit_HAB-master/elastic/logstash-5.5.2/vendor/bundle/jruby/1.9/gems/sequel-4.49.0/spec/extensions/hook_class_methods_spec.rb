require File.join(File.dirname(File.expand_path(__FILE__)), "spec_helper")

model_class = proc do |klass, &block|
  c = Class.new(klass)
  c.plugin :hook_class_methods
  c.class_eval(&block) if block
  c
end

describe Sequel::Model, "hook_class_methods plugin" do
  before do
    DB.reset
  end
  
  it "should freeze hooks when freezing model class" do
    c = model_class.call Sequel::Model do
      before_save{adds << 'hi'}
    end
    c.freeze
    hooks = c.instance_variable_get(:@hooks)
    hooks.frozen?.must_equal true
    hooks.values.all?(&:frozen?).must_equal true
  end

  it "should be definable using a block" do
    adds = []
    c = model_class.call Sequel::Model do
      before_save{adds << 'hi'}
    end
    
    c.new.before_save
    adds.must_equal ['hi']
  end
  
  it "should be definable using a method name" do
    adds = []
    c = model_class.call Sequel::Model do
      define_method(:bye){adds << 'bye'}
      before_save :bye
    end
    
    c.new.before_save
    adds.must_equal ['bye']
  end

  it "should be additive" do
    adds = []
    c = model_class.call Sequel::Model do
      after_save{adds << 'hyiyie'}
      after_save{adds << 'byiyie'}
    end

    c.new.after_save
    adds.must_equal ['hyiyie', 'byiyie']
  end
  
  it "before hooks should run in reverse order" do
    adds = []
    c = model_class.call Sequel::Model do
      before_save{adds << 'hyiyie'}
      before_save{adds << 'byiyie'}
    end
    
    c.new.before_save
    adds.must_equal ['byiyie', 'hyiyie']
  end

  it "should not be additive if the method or tag already exists" do
    adds = []
    c = model_class.call Sequel::Model do
      define_method(:bye){adds << 'bye'}
      before_save :bye
      before_save :bye
    end
    
    c.new.before_save
    adds.must_equal ['bye']

    adds = []
    d = model_class.call Sequel::Model do
      before_save(:bye){adds << 'hyiyie'}
      before_save(:bye){adds << 'byiyie'}
    end
    
    d.new.before_save
    adds.must_equal ['byiyie']

    adds = []
    e = model_class.call Sequel::Model do
      define_method(:bye){adds << 'bye'}
      before_save :bye
      before_save(:bye){adds << 'byiyie'}
    end
    
    e.new.before_save
    adds.must_equal ['byiyie']

    adds = []
    e = model_class.call Sequel::Model do
      define_method(:bye){adds << 'bye'}
      before_save(:bye){adds << 'byiyie'}
      before_save :bye
    end
    
    e.new.before_save
    adds.must_equal ['bye']
  end
  
  it "should be inheritable" do
    adds = []
    a = model_class.call Sequel::Model do
      after_save{adds << '123'}
    end
    
    b = Class.new(a)
    b.class_eval do
      after_save{adds << '456'}
      after_save{adds << '789'}
    end
    
    b.new.after_save
    adds.must_equal ['123', '456', '789']
  end
  
  it "should be overridable in descendant classes" do
    adds = []
    a = model_class.call Sequel::Model do
      before_save{adds << '123'}
    end
    
    b = Class.new(a)
    b.class_eval do
      define_method(:before_save){adds << '456'}
    end
    
    a.new.before_save
    adds.must_equal ['123']
    adds = []
    b.new.before_save
    adds.must_equal ['456']
  end
  
  deprecated "should stop processing if a before hook returns false" do
    flag = true
    adds = []
    
    a = model_class.call Sequel::Model do
      before_save{adds << 'cruel'; flag}
      before_save{adds << 'blah'; flag}
    end
    
    a.new.before_save
    adds.must_equal ['blah', 'cruel']

    # chain should not break on nil
    adds = []
    flag = nil
    a.new.before_save
    adds.must_equal ['blah', 'cruel']
    
    adds = []
    flag = false
    a.new.before_save
    adds.must_equal ['blah']
    
    b = Class.new(a)
    b.class_eval do
      before_save{adds << 'mau'}
    end
    
    adds = []
    b.new.before_save
    adds.must_equal ['mau', 'blah']
  end

  it "should stop processing if a before hook calls cancel_action" do
    flag = true
    adds = []
    
    a = model_class.call Sequel::Model(:items) do
      before_save{adds << 'cruel'; cancel_action if flag == false}
      before_save{adds << 'blah'; cancel_action if flag == false}
    end
    
    a.raise_on_save_failure = false
    a.new.save
    adds.must_equal ['blah', 'cruel']

    # chain should not break on nil
    adds = []
    flag = nil
    a.new.save
    adds.must_equal ['blah', 'cruel']
    
    adds = []
    flag = false
    a.new.save
    adds.must_equal ['blah']
    
    b = Class.new(a)
    b.class_eval do
      before_save{adds << 'mau'}
    end
    
    adds = []
    b.new.save
    adds.must_equal ['mau', 'blah']
  end
end

describe "Model#before_create && Model#after_create" do
  before do
    DB.reset

    @c = model_class.call Sequel::Model(:items)  do
      columns :x
      no_primary_key
      
      after_create {DB << "BLAH after"}
    end
  end
  
  it "should be called around new record creation" do
    @c.before_create {DB << "BLAH before"}
    @c.create(:x => 2)
    DB.sqls.must_equal ['BLAH before', 'INSERT INTO items (x) VALUES (2)', 'BLAH after']
  end

  deprecated ".create should cancel the save and raise an error if before_create returns false and raise_on_save_failure is true" do
    @c.before_create{false}
    proc{@c.create(:x => 2)}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  it ".create should cancel the save and raise an error if before_create calls cancel_action and raise_on_save_failure is true" do
    @c.before_create{cancel_action}
    proc{@c.create(:x => 2)}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  deprecated ".create should cancel the save and return nil if before_create returns false and raise_on_save_failure is false" do
    @c.before_create{false}
    @c.raise_on_save_failure = false
    @c.create(:x => 2).must_be_nil
    DB.sqls.must_equal []
  end

  it ".create should cancel the save and return nil if before_create calls cancel_action and raise_on_save_failure is false" do
    @c.before_create{cancel_action}
    @c.raise_on_save_failure = false
    @c.create(:x => 2).must_be_nil
    DB.sqls.must_equal []
  end
end

describe "Model#before_update && Model#after_update" do
  before do
    DB.reset

    @c = model_class.call(Sequel::Model(:items)) do
      after_update {DB << "BLAH after"}
    end
  end
  
  it "should be called around record update" do
    @c.before_update {DB << "BLAH before"}
    m = @c.load(:id => 2233, :x=>123)
    m.save
    DB.sqls.must_equal ['BLAH before', 'UPDATE items SET x = 123 WHERE (id = 2233)', 'BLAH after']
  end

  deprecated "#save should cancel the save and raise an error if before_update returns false and raise_on_save_failure is true" do
    @c.before_update{false}
    proc{@c.load(:id => 2233).save}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  it "#save should cancel the save and raise an error if before_update calls cancel_action and raise_on_save_failure is true" do
    @c.before_update{cancel_action}
    proc{@c.load(:id => 2233).save}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  deprecated "#save should cancel the save and return nil if before_update returns false and raise_on_save_failure is false" do
    @c.before_update{false}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).save.must_be_nil
    DB.sqls.must_equal []
  end

  it "#save should cancel the save and return nil if before_update calls cancel_action and raise_on_save_failure is false" do
    @c.before_update{cancel_action}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).save.must_be_nil
    DB.sqls.must_equal []
  end
end

describe "Model#before_save && Model#after_save" do
  before do
    DB.reset

    @c = model_class.call(Sequel::Model(:items)) do
      columns :x
      after_save {DB << "BLAH after"}
    end
  end
  
  it "should be called around record update" do
    @c.before_save {DB << "BLAH before"}
    m = @c.load(:id => 2233, :x=>123)
    m.save
    DB.sqls.must_equal ['BLAH before', 'UPDATE items SET x = 123 WHERE (id = 2233)', 'BLAH after']
  end
  
  it "should be called around record creation" do
    @c.before_save {DB << "BLAH before"}
    @c.no_primary_key
    @c.create(:x => 2)
    DB.sqls.must_equal ['BLAH before', 'INSERT INTO items (x) VALUES (2)', 'BLAH after']
  end

  deprecated "#save should cancel the save and raise an error if before_save returns false and raise_on_save_failure is true" do
    @c.before_save{false}
    proc{@c.load(:id => 2233).save}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  it "#save should cancel the save and raise an error if before_save calls cancel_action and raise_on_save_failure is true" do
    @c.before_save{cancel_action}
    proc{@c.load(:id => 2233).save}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  deprecated "#save should cancel the save and return nil if before_save returns false and raise_on_save_failure is false" do
    @c.before_save{false}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).save.must_be_nil
    DB.sqls.must_equal []
  end

  it "#save should cancel the save and return nil if before_save calls cancel_action and raise_on_save_failure is false" do
    @c.before_save{cancel_action}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).save.must_be_nil
    DB.sqls.must_equal []
  end
end

describe "Model#before_destroy && Model#after_destroy" do
  before do
    DB.reset

    @c = model_class.call(Sequel::Model(:items)) do
      after_destroy {DB << "BLAH after"}
    end
  end
  
  it "should be called around record destruction" do
    @c.before_destroy {DB << "BLAH before"}
    m = @c.load(:id => 2233)
    m.destroy
    DB.sqls.must_equal ['BLAH before', "DELETE FROM items WHERE id = 2233", 'BLAH after']
  end

  deprecated "#destroy should cancel the destroy and raise an error if before_destroy returns false and raise_on_save_failure is true" do
    @c.before_destroy{false}
    proc{@c.load(:id => 2233).destroy}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  it "#destroy should cancel the destroy and raise an error if before_destroy calls cancel_action and raise_on_save_failure is true" do
    @c.before_destroy{cancel_action}
    proc{@c.load(:id => 2233).destroy}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  deprecated "#destroy should cancel the destroy and return nil if before_destroy returns false and raise_on_save_failure is false" do
    @c.before_destroy{false}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).destroy.must_be_nil
    DB.sqls.must_equal []
  end

  it "#destroy should cancel the destroy and return nil if before_destroy calls cancel_action and raise_on_save_failure is false" do
    @c.before_destroy{cancel_action}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).destroy.must_be_nil
    DB.sqls.must_equal []
  end
end

describe "Model#before_validation && Model#after_validation" do
  before do
    DB.reset

    @c = model_class.call(Sequel::Model(:items)) do
      plugin :validation_class_methods
      after_validation{DB << "BLAH after"}

      def self.validate(o)
        o.errors.add(:id, 'not valid') unless o[:id] == 2233
      end
      columns :id
    end
  end
  
  it "should be called around validation" do
    @c.before_validation{DB << "BLAH before"}
    m = @c.load(:id => 2233)
    m.must_be :valid?
    DB.sqls.must_equal ['BLAH before', 'BLAH after']

    DB.sqls.clear
    m = @c.load(:id => 22)
    m.wont_be :valid?
    DB.sqls.must_equal ['BLAH before', 'BLAH after']
  end

  it "should be called when calling save" do
    @c.before_validation{DB << "BLAH before"}
    m = @c.load(:id => 2233, :x=>123)
    m.save.must_equal m
    DB.sqls.must_equal ['BLAH before', 'BLAH after', 'UPDATE items SET x = 123 WHERE (id = 2233)']

    DB.sqls.clear
    m = @c.load(:id => 22)
    m.raise_on_save_failure = false
    m.save.must_be_nil
    DB.sqls.must_equal ['BLAH before', 'BLAH after']
  end

  deprecated "#save should cancel the save and raise an error if before_validation returns false and raise_on_save_failure is true" do
    @c.before_validation{false}
    proc{@c.load(:id => 2233).save}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  it "#save should cancel the save and raise an error if before_validation calls cancel_action and raise_on_save_failure is true" do
    @c.before_validation{cancel_action}
    proc{@c.load(:id => 2233).save}.must_raise(Sequel::HookFailed)
    DB.sqls.must_equal []
  end

  deprecated "#save should cancel the save and return nil if before_validation returns false and raise_on_save_failure is false" do
    @c.before_validation{false}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).save.must_be_nil
    DB.sqls.must_equal []
  end

  it "#save should cancel the save and return nil if before_validation calls cancel_action and raise_on_save_failure is false" do
    @c.before_validation{cancel_action}
    @c.raise_on_save_failure = false
    @c.load(:id => 2233).save.must_be_nil
    DB.sqls.must_equal []
  end
end

describe "Model transaction hooks" do
  before do
    DB.reset

    @c = model_class.call(Sequel::Model(:items)) do
      columns :x
      after_save {DB << "AS"}
      after_destroy {DB << "AD"}
      self.use_transactions = true
    end
  end
  
  deprecated "should call after_commit or after_rollback depending on whether the transaction commits or rolls back" do
    @c.after_commit{DB << 'AC'}
    @c.after_rollback{DB << 'AR'}
    m = @c.load(:id => 2233, :x=>123)

    m.save
    DB.sqls.must_equal ['BEGIN', 'UPDATE items SET x = 123 WHERE (id = 2233)', 'AS', 'COMMIT', 'AC']

    @c.db.transaction(:rollback=>:always){m.save}
    DB.sqls.must_equal ['BEGIN', 'UPDATE items SET x = 123 WHERE (id = 2233)', 'AS', 'ROLLBACK', 'AR']

    @c.db.transaction do
      m.save
      DB.sqls.must_equal ['BEGIN', 'UPDATE items SET x = 123 WHERE (id = 2233)', 'AS']
    end
  end
  
  deprecated "should call after_destroy_commit or after_destroy_rollback depending on whether the transaction commits or rolls back" do
    @c.after_destroy_commit {DB << 'ADC'}
    @c.after_destroy_rollback{DB << 'ADR'}

    @c.load(:id => 2233).destroy
    DB.sqls.must_equal ['BEGIN', 'DELETE FROM items WHERE id = 2233', 'AD', 'COMMIT', 'ADC']

    @c.db.transaction(:rollback=>:always){@c.load(:id => 2233).destroy}
    DB.sqls.must_equal ['BEGIN', 'DELETE FROM items WHERE id = 2233', 'AD', 'ROLLBACK', 'ADR']

    @c.db.transaction do
      @c.load(:id => 2233).destroy
      DB.sqls.must_equal ['BEGIN', 'DELETE FROM items WHERE id = 2233', 'AD']
    end
  end
end

describe "Model.has_hooks?" do
  before do
    @c = model_class.call(Sequel::Model(:items))
  end
  
  it "should return false if no hooks are defined" do
    @c.has_hooks?(:before_save).must_equal false
  end
  
  it "should return true if hooks are defined" do
    @c.before_save {'blah'}
    @c.has_hooks?(:before_save).must_equal true
  end
  
  it "should return true if hooks are inherited" do
    @d = Class.new(@c)
    @d.has_hooks?(:before_save).must_equal false
  end
end

describe "Model#add_hook_type" do
  before do
    deprecated do
      class ::Foo < Sequel::Model(:items)
        plugin :hook_class_methods
        add_hook_type :before_bar, :after_bar

        def bar
          return :b if before_bar == false
          return :a if after_bar == false
          true
        end
      end
      @f = Class.new(Foo)
    end
  end
  after do
    Object.send(:remove_const, :Foo)
  end

  deprecated "should have before_bar and after_bar class methods" do
    @f.must_respond_to(:before_bar)
    @f.must_respond_to(:before_bar)
  end

  deprecated "should have before_bar and after_bar instance methods" do
    @f.new.must_respond_to(:before_bar)
    @f.new.must_respond_to(:before_bar)
  end

  deprecated "it should return true for bar when before_bar and after_bar hooks are returing true" do
    a = 1
    @f.before_bar { a += 1}
    @f.new.bar.must_equal true
    a.must_equal 2
    @f.after_bar { a *= 2}
    @f.new.bar.must_equal true
    a.must_equal 6
  end

  deprecated "it should return nil for bar when before_bar and after_bar hooks are returing false" do
    @f.new.bar.must_equal true
    @f.after_bar { false }
    @f.new.bar.must_equal :a
    @f.before_bar { false }
    @f.new.bar.must_equal :b
  end
end
