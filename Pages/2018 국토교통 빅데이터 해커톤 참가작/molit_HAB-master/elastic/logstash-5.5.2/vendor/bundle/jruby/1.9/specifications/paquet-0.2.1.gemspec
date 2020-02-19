# -*- encoding: utf-8 -*-
# stub: paquet 0.2.1 ruby lib

Gem::Specification.new do |s|
  s.name = "paquet"
  s.version = "0.2.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Elastic"]
  s.bindir = "exe"
  s.date = "2017-03-24"
  s.description = "This gem add a few rake tasks to create a uber gems that will be shipped as a zip"
  s.email = ["info@elastic.co"]
  s.homepage = "https://github.com/elastic/logstash"
  s.licenses = ["Apache License (2.0)"]
  s.rubygems_version = "2.4.8"
  s.summary = "Rake helpers to create a uber gem"

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rspec>, [">= 0"])
      s.add_development_dependency(%q<pry>, [">= 0"])
      s.add_development_dependency(%q<webmock>, ["~> 2.2.0"])
      s.add_development_dependency(%q<stud>, [">= 0"])
    else
      s.add_dependency(%q<rspec>, [">= 0"])
      s.add_dependency(%q<pry>, [">= 0"])
      s.add_dependency(%q<webmock>, ["~> 2.2.0"])
      s.add_dependency(%q<stud>, [">= 0"])
    end
  else
    s.add_dependency(%q<rspec>, [">= 0"])
    s.add_dependency(%q<pry>, [">= 0"])
    s.add_dependency(%q<webmock>, ["~> 2.2.0"])
    s.add_dependency(%q<stud>, [">= 0"])
  end
end
