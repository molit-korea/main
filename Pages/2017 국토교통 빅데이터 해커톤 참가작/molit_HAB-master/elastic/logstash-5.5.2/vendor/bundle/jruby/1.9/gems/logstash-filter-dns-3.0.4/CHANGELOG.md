## 3.0.3
  - Relax constraint on logstash-core-plugin-api to >= 1.60 <= 2.99

## 3.0.2
  - Add support for International Domain Names e.g. müller.com. Fixes https://github.com/logstash-plugins/logstash-filter-dns/issues/22
  - Add support for custom hosts files (helps with testing but could be useful to some folks).

## 3.0.1
  - Republish all the gems under jruby.

## 3.0.0
  - Update the plugin to the version 2.0 of the plugin api, this change is required for Logstash 5.0 compatibility. See https://github.com/elastic/logstash/issues/5141

## 2.1.3
  - Fix spec early termination by removing an explicit return from a block

## 2.1.2
  - Depend on logstash-core-plugin-api instead of logstash-core, removing the need to mass update plugins on major releases of logstash

## 2.1.1
  - New dependency requirements for logstash-core for the 5.0 release

## 2.1.0
 - Add caches for failed and successful lookups
 - Lower default timeout value
 - Retry a maximum of :max_retries instead of failing immediately

## 2.0.0
 - Plugins were updated to follow the new shutdown semantic, this mainly allows Logstash to instruct input plugins to terminate gracefully,
   instead of using Thread.raise on the plugins' threads. Ref: https://github.com/elastic/logstash/pull/3895
 - Dependency on logstash-core update to 2.0

