require_relative 'setup'
require 'ruby_maven'
require 'stringio'
require 'maven/ruby/version'

describe RubyMaven do

  it 'displays the version info' do
    Dir.chdir 'spec' do
      CatchStdout.exec do
        RubyMaven.exec( '--version' )
      end
      CatchStdout.result.must_match /Polyglot Maven Extension #{RubyMaven::POLYGLOT_VERSION}/
      xml = File.read('.mvn/extensions.xml')
      xml.must_equal "dummy\n"
    end
  end

  let :gem do
    v = Maven::Ruby::VERSION
    v += '-SNAPSHOT' if v =~ /[a-zA-Z]/
    "pkg/ruby-maven-#{v}.gem"
  end

  it 'pack the gem' do
    FileUtils.rm_f gem
    CatchStdout.exec do
      # need newer jruby version
      RubyMaven.exec( '-Dverbose', 'package', '-Djruby.version=1.7.24' )
    end
    #puts CatchStdout.result
    CatchStdout.result.must_match /mvn -Dverbose package/
    File.exists?( gem ).must_equal true
    File.exists?( '.mvn/extensions.xml' ).must_equal true
    File.exists?( '.mvn/extensions.xml.orig' ).wont_equal true
  end
  
end
