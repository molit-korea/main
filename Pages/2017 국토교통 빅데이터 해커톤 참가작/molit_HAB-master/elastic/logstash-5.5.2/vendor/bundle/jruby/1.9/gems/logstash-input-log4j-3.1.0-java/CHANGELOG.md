## 3.1.0
  - Remove obsolete option `data_timeout`

## 3.0.7
  - Docs: Moved description label to the correct location in the docs.
  
## 3.0.6
  - Docs: Fix asciidoc formatting.

## 3.0.5
  - Added deprecation notice in logs.

## 3.0.4
  - This input will now reject any non-log4j log objects sent as input.

## 3.0.3
  - `data_timeout` is now marked as obsolete, since this option is no longer necessary

## 3.0.2
  - Relax constraint on logstash-core-plugin-api to >= 1.60 <= 2.99

## 3.0.1
  - Republish all the gems under jruby.

## 3.0.0
  - Update the plugin to the version 2.0 of the plugin api, this change is required for Logstash 5.0 compatibility. See https://github.com/elastic/logstash/issues/5141

# 2.0.7
  - Depend on logstash-core-plugin-api instead of logstash-core, removing the need to mass update plugins on major releases of logstash

# 2.0.6
  - New dependency requirements for logstash-core for the 5.0 release

## 2.0.5
 - Fix a spec that was incompatible with the ng pipeline

## 2.0.4
 - Bump for LS 2.x compatibility

## 2.0.3
 - Refactor code to improve test reliability

## 2.0.2
 - Fix tests with `Thread.abort_on_exception` turn on

## 2.0.0
 - Plugins were updated to follow the new shutdown semantic, this mainly allows Logstash to instruct input plugins to terminate gracefully, 
   instead of using Thread.raise on the plugins' threads. Ref: https://github.com/elastic/logstash/pull/3895
 - Dependency on logstash-core update to 2.0

# 1.0.1
  - refactor test to allow unit testing of logstash event creation
