#
# Copyright (C) 2013 Christian Meier
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#
require 'maven'
require 'maven/ruby/maven'

module RubyMaven
  POLYGLOT_VERSION = "0.1.15"

  def self.exec( *args )
    if File.exist?('settings.xml') and not args.member?('-s') and not args.member?('--settings')
      args << '-s'
      args << 'settings.xml'
    end
    if args.member?('-version') or args.member?('--version') or args.member?('-v')
      warn "Polyglot Maven Extension #{version}"
      launch( '--version' )
    elsif defined? Bundler
      # it can be switching from ruby to jruby with invoking maven
      # just keep it clean
      Bundler.with_clean_env do
        launch( *args )
      end
    else
      launch( *args )
    end
  end

  def self.dir
    @dir ||= File.expand_path( '../../', __FILE__ )
  end

  def self.version
    polyglot_version = begin
                         xml = File.read( File.join( dir, '.mvn/extensions.xml' ) )
                         xml.sub( /.*<version>/m, '' ).sub(/<\/version>.*/m, '' )
                       rescue Errno::ENOENT => e
                         nil
                       end
    POLYGLOT_VERSION.replace(polyglot_version) if polyglot_version
    POLYGLOT_VERSION
  end

  def self.launch( *args )
    old_maven_home = ENV['M2_HOME']
    ENV['M2_HOME'] = Maven.home

    extensions = File.join( '.mvn/extensions.xml' )
    if has_extensions = File.exists?( extensions )
      # tests need copy instead of move
      FileUtils.cp( extensions, extensions + ".orig" )
    else
      FileUtils.mkdir_p( '.mvn' )
    end
    FileUtils.cp( File.join( dir, extensions ), extensions ) rescue nil

    # setup version
    self.version

    Maven.exec( *args )

  ensure
    ENV['M2_HOME'] = old_maven_home
    
    FileUtils.rm_f( extensions )
    if has_extensions
      FileUtils.move( extensions + '.orig', extensions )
    else
      dir = File.dirname( extensions )
      # delete empty .mvn directory
      FileUtils.rm_rf( dir ) if Dir[File.join(dir, '*')].size == 0
    end
  end
end
