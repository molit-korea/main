# -*- encoding: utf-8 -*-
# stub: logstash-input-twitter 3.0.5 ruby lib

Gem::Specification.new do |s|
  s.name = "logstash-input-twitter"
  s.version = "3.0.5"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.metadata = { "logstash_group" => "input", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib"]
  s.authors = ["Elastic"]
  s.date = "2017-06-23"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program"
  s.email = "info@elastic.co"
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html"
  s.licenses = ["Apache License (2.0)"]
  s.rubygems_version = "2.4.8"
  s.summary = "Read events from the twitter streaming api."

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<logstash-core-plugin-api>, ["<= 2.99", ">= 1.60"])
      s.add_runtime_dependency(%q<twitter>, ["= 5.15.0"])
      s.add_runtime_dependency(%q<http-form_data>, ["<= 1.0.1"])
      s.add_runtime_dependency(%q<public_suffix>, ["<= 1.4.6"])
      s.add_runtime_dependency(%q<stud>, ["< 0.1", ">= 0.0.22"])
      s.add_development_dependency(%q<logstash-devutils>, [">= 0"])
      s.add_development_dependency(%q<logstash-codec-plain>, [">= 0"])
      s.add_development_dependency(%q<rspec-sequencing>, [">= 0"])
    else
      s.add_dependency(%q<logstash-core-plugin-api>, ["<= 2.99", ">= 1.60"])
      s.add_dependency(%q<twitter>, ["= 5.15.0"])
      s.add_dependency(%q<http-form_data>, ["<= 1.0.1"])
      s.add_dependency(%q<public_suffix>, ["<= 1.4.6"])
      s.add_dependency(%q<stud>, ["< 0.1", ">= 0.0.22"])
      s.add_dependency(%q<logstash-devutils>, [">= 0"])
      s.add_dependency(%q<logstash-codec-plain>, [">= 0"])
      s.add_dependency(%q<rspec-sequencing>, [">= 0"])
    end
  else
    s.add_dependency(%q<logstash-core-plugin-api>, ["<= 2.99", ">= 1.60"])
    s.add_dependency(%q<twitter>, ["= 5.15.0"])
    s.add_dependency(%q<http-form_data>, ["<= 1.0.1"])
    s.add_dependency(%q<public_suffix>, ["<= 1.4.6"])
    s.add_dependency(%q<stud>, ["< 0.1", ">= 0.0.22"])
    s.add_dependency(%q<logstash-devutils>, [">= 0"])
    s.add_dependency(%q<logstash-codec-plain>, [">= 0"])
    s.add_dependency(%q<rspec-sequencing>, [">= 0"])
  end
end
