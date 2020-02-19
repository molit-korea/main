# -*- encoding: utf-8 -*-
# stub: json 1.8.6 java lib

Gem::Specification.new do |s|
  s.name = "json"
  s.version = "1.8.6"
  s.platform = "java"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Daniel Luz"]
  s.date = "2017-01-13"
  s.description = "A JSON implementation as a JRuby extension."
  s.email = "dev+ruby@mernen.com"
  s.homepage = "http://json-jruby.rubyforge.org/"
  s.licenses = ["Ruby"]
  s.rubyforge_project = "json-jruby"
  s.rubygems_version = "2.4.8"
  s.summary = "JSON implementation for JRuby"

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rake>, [">= 0"])
      s.add_development_dependency(%q<test-unit>, ["~> 2.0"])
    else
      s.add_dependency(%q<rake>, [">= 0"])
      s.add_dependency(%q<test-unit>, ["~> 2.0"])
    end
  else
    s.add_dependency(%q<rake>, [">= 0"])
    s.add_dependency(%q<test-unit>, ["~> 2.0"])
  end
end
