# frozen-string-literal: true

module Sequel
  # A dataset represents an SQL query, or more generally, an abstract
  # set of rows in the database.  Datasets
  # can be used to create, retrieve, update and delete records.
  # 
  # Query results are always retrieved on demand, so a dataset can be kept
  # around and reused indefinitely (datasets never cache results):
  #
  #   my_posts = DB[:posts].where(:author => 'david') # no records are retrieved
  #   my_posts.all # records are retrieved
  #   my_posts.all # records are retrieved again
  #
  # Most dataset methods return modified copies of the dataset (functional style), so you can
  # reuse different datasets to access data:
  #
  #   posts = DB[:posts]
  #   davids_posts = posts.where(:author => 'david')
  #   old_posts = posts.where('stamp < ?', Date.today - 7)
  #   davids_old_posts = davids_posts.where('stamp < ?', Date.today - 7)
  #
  # Datasets are Enumerable objects, so they can be manipulated using any
  # of the Enumerable methods, such as map, inject, etc.
  #
  # For more information, see the {"Dataset Basics" guide}[rdoc-ref:doc/dataset_basics.rdoc].
  class Dataset
    OPTS = Sequel::OPTS

    # Whether Dataset#freeze can actually freeze datasets.  True only on ruby 2.4+,
    # as it requires clone(freeze: false)
    TRUE_FREEZE = RUBY_VERSION >= '2.4'

    include Enumerable
    include SQL::AliasMethods
    include SQL::BooleanMethods
    include SQL::CastMethods
    include SQL::ComplexExpressionMethods
    include SQL::InequalityMethods
    include SQL::NumericMethods
    include SQL::OrderMethods
    include SQL::StringMethods
  end
  
  require(%w"query actions features graph prepared_statements misc mutation sql placeholder_literalizer dataset_module", 'dataset')
end
