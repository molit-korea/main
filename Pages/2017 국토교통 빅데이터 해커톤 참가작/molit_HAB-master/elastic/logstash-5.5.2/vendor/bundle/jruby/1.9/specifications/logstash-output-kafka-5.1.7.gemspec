# -*- encoding: utf-8 -*-
# stub: logstash-output-kafka 5.1.7 ruby lib

Gem::Specification.new do |s|
  s.name = "logstash-output-kafka"
  s.version = "5.1.7"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.metadata = { "group" => "output", "logstash_plugin" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib"]
  s.authors = ["Elasticsearch"]
  s.date = "2017-06-23"
  s.description = "This gem is a Logstash plugin required to be installed on top of the Logstash core pipeline using $LS_HOME/bin/logstash-plugin install gemname. This gem is not a stand-alone program"
  s.email = "info@elastic.co"
  s.homepage = "http://www.elastic.co/guide/en/logstash/current/index.html"
  s.licenses = ["Apache License (2.0)"]
  s.requirements = ["jar 'org.apache.kafka:kafka-clients', '0.10.0.1'", "jar 'org.slf4j:slf4j-log4j12', '1.7.21'"]
  s.rubygems_version = "2.4.8"
  s.summary = "Output events to a Kafka topic. This uses the Kafka Producer API to write messages to a topic on the broker"

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<jar-dependencies>, ["~> 0.3.2"])
      s.add_runtime_dependency(%q<logstash-core-plugin-api>, ["<= 2.99", ">= 1.60"])
      s.add_runtime_dependency(%q<logstash-codec-plain>, [">= 0"])
      s.add_runtime_dependency(%q<logstash-codec-json>, [">= 0"])
      s.add_development_dependency(%q<logstash-devutils>, [">= 0"])
      s.add_development_dependency(%q<poseidon>, [">= 0"])
      s.add_development_dependency(%q<snappy>, [">= 0"])
    else
      s.add_dependency(%q<jar-dependencies>, ["~> 0.3.2"])
      s.add_dependency(%q<logstash-core-plugin-api>, ["<= 2.99", ">= 1.60"])
      s.add_dependency(%q<logstash-codec-plain>, [">= 0"])
      s.add_dependency(%q<logstash-codec-json>, [">= 0"])
      s.add_dependency(%q<logstash-devutils>, [">= 0"])
      s.add_dependency(%q<poseidon>, [">= 0"])
      s.add_dependency(%q<snappy>, [">= 0"])
    end
  else
    s.add_dependency(%q<jar-dependencies>, ["~> 0.3.2"])
    s.add_dependency(%q<logstash-core-plugin-api>, ["<= 2.99", ">= 1.60"])
    s.add_dependency(%q<logstash-codec-plain>, [">= 0"])
    s.add_dependency(%q<logstash-codec-json>, [">= 0"])
    s.add_dependency(%q<logstash-devutils>, [">= 0"])
    s.add_dependency(%q<poseidon>, [">= 0"])
    s.add_dependency(%q<snappy>, [">= 0"])
  end
end
