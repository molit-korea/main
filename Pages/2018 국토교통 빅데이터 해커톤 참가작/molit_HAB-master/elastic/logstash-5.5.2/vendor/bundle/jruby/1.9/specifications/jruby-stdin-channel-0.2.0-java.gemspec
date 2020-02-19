# -*- encoding: utf-8 -*-
# stub: jruby-stdin-channel 0.2.0 java lib

Gem::Specification.new do |s|
  s.name = "jruby-stdin-channel"
  s.version = "0.2.0"
  s.platform = "java"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Colin Surprenant"]
  s.date = "2015-05-15"
  s.description = "JRuby extension to expose an interruptible NIO FileChannel for STDIN"
  s.email = ["colin.surprenant@gmail.com"]
  s.homepage = "http://github.com/colinsurprenant/jruby-stdin-channel"
  s.licenses = ["Apache-2.0"]
  s.rubygems_version = "2.4.8"
  s.summary = "JRuby extension to expose an interruptible NIO FileChannel for STDIN"

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rspec>, [">= 2.0.0"])
      s.add_development_dependency(%q<rake>, [">= 10.0.0"])
    else
      s.add_dependency(%q<rspec>, [">= 2.0.0"])
      s.add_dependency(%q<rake>, [">= 10.0.0"])
    end
  else
    s.add_dependency(%q<rspec>, [">= 2.0.0"])
    s.add_dependency(%q<rake>, [">= 10.0.0"])
  end
end
