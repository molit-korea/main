# -*- encoding: utf-8 -*-
# stub: chronic_duration 0.10.6 ruby lib

Gem::Specification.new do |s|
  s.name = "chronic_duration"
  s.version = "0.10.6"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["hpoydar"]
  s.date = "2014-09-08"
  s.description = "A simple Ruby natural language parser for elapsed time. (For example, 4 hours and 30 minutes, 6 minutes 4 seconds, 3 days, etc.) Returns all results in seconds. Will return an integer unless you get tricky and need a float. (4 minutes and 13.47 seconds, for example.) The reverse can also be performed via the output method."
  s.email = ["henry@poydar.com"]
  s.homepage = "https://github.com/hpoydar/chronic_duration"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.4.8"
  s.summary = "A simple Ruby natural language parser for elapsed time"

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<numerizer>, ["~> 0.1.1"])
      s.add_development_dependency(%q<rake>, ["~> 10.0.3"])
      s.add_development_dependency(%q<rspec>, ["~> 2.12.0"])
    else
      s.add_dependency(%q<numerizer>, ["~> 0.1.1"])
      s.add_dependency(%q<rake>, ["~> 10.0.3"])
      s.add_dependency(%q<rspec>, ["~> 2.12.0"])
    end
  else
    s.add_dependency(%q<numerizer>, ["~> 0.1.1"])
    s.add_dependency(%q<rake>, ["~> 10.0.3"])
    s.add_dependency(%q<rspec>, ["~> 2.12.0"])
  end
end
