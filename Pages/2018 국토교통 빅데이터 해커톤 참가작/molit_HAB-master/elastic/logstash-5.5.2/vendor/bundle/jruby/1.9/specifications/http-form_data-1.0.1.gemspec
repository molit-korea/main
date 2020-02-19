# -*- encoding: utf-8 -*-
# stub: http-form_data 1.0.1 ruby lib

Gem::Specification.new do |s|
  s.name = "http-form_data"
  s.version = "1.0.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Aleksey V Zapparov"]
  s.date = "2015-03-31"
  s.description = "Utility-belt to build form data request bodies. Provides support for `application/x-www-form-urlencoded` and `multipart/form-data` types."
  s.email = ["ixti@member.fsf.org"]
  s.homepage = "https://github.com/httprb/form_data.rb"
  s.licenses = ["MIT"]
  s.rubygems_version = "2.4.8"
  s.summary = "http-form_data-1.0.1"

  s.installed_by_version = "2.4.8" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<bundler>, ["~> 1.7"])
    else
      s.add_dependency(%q<bundler>, ["~> 1.7"])
    end
  else
    s.add_dependency(%q<bundler>, ["~> 1.7"])
  end
end
