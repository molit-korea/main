require File.join(File.dirname(File.expand_path(__FILE__)), "spec_helper")

describe "Sequel::Metaprogramming" do
  before do
    deprecated do
      Sequel.extension :meta_def
    end
  end
  after do
    Sequel::Metaprogramming.send(:remove_method, :meta_def)
  end

  it "should add meta_def method to Database, Dataset, and Model classes and instances" do
    Sequel::Database.meta_def(:foo){1}
    Sequel::Database.foo.must_equal 1
    Sequel::Dataset.meta_def(:foo){2}
    Sequel::Dataset.foo.must_equal 2
    Sequel::Model.meta_def(:foo){3}
    Sequel::Model.foo.must_equal 3
    o = Sequel::Database.new
    o.meta_def(:foo){4}
    o.foo.must_equal 4
    
    o = o[:a]
    # SEQUEL5: Remove
    unless o.frozen?
      o.meta_def(:foo){5}
      o.foo.must_equal 5
    end

    o = Sequel::Model.new
    o.meta_def(:foo){6}
    o.foo.must_equal 6
  end
end
