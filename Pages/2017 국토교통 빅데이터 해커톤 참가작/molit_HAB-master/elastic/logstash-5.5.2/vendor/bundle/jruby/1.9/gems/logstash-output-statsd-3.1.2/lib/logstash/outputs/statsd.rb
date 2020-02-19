# encoding: utf-8
require "logstash/outputs/base"
require "logstash/namespace"

# statsd is a network daemon for aggregating statistics, such as counters and timers,
# and shipping over UDP to backend services, such as Graphite or Datadog. The general
# idea is that you send metrics to statsd and every few seconds it will emit the
# aggregated values to the backend. Example aggregates are sums, average and maximum
# values, their standard deviation, etc. This plugin makes it easy to send such
# metrics based on data in Logstash events.
#
# You can learn about statsd here:
#
# * https://codeascraft.com/2011/02/15/measure-anything-measure-everything/[Etsy blog post announcing statsd]
# * https://github.com/etsy/statsd[statsd on github]
#
# Typical examples of how this can be used with Logstash include counting HTTP hits
# by response code, summing the total number of bytes of traffic served, and tracking
# the 50th and 95th percentile of the processing time of requests.
#
# Each metric emitted to statsd has a dot-separated path, a type, and a value. The
# metric path is built from the `namespace` and `sender` options together with the
# metric name that's picked up depending on the type of metric. All in all, the
# metric path will follow this pattern:
#
#     namespace.sender.metric
#
# With regards to this plugin, the default namespace is "logstash", the default
# sender is the `host` field, and the metric name depends on what is set as the
# metric name in the `increment`, `decrement`, `timing`, `count`, `set` or `gauge`
# options. In metric paths, colons (":"), pipes ("|") and at signs ("@") are reserved
# and will be replaced by underscores ("_").
#
# Example:
# [source,ruby]
# output {
#   statsd {
#     host => "statsd.example.org"
#     count => {
#       "http.bytes" => "%{bytes}"
#     }
#   }
# }
#
# If run on a host named hal9000 the configuration above will send the following
# metric to statsd if the current event has 123 in its `bytes` field:
#
#     logstash.hal9000.http.bytes:123|c
class LogStash::Outputs::Statsd < LogStash::Outputs::Base
  ## Regex stolen from statsd code
  RESERVED_CHARACTERS_REGEX = /[\:\|\@]/
  config_name "statsd"

  # The hostname or IP address of the statsd server.
  config :host, :validate => :string, :default => "localhost"

  # The port to connect to on your statsd server.
  config :port, :validate => :number, :default => 8125

  # The statsd namespace to use for this metric. `%{fieldname}` substitutions are
  # allowed.
  config :namespace, :validate => :string, :default => "logstash"

  # The name of the sender. Dots will be replaced with underscores. `%{fieldname}`
  # substitutions are allowed.
  config :sender, :validate => :string, :default => "%{host}"

  # An increment metric. Metric names as array. `%{fieldname}` substitutions are
  # allowed in the metric names.
  config :increment, :validate => :array, :default => []

  # A decrement metric. Metric names as array. `%{fieldname}` substitutions are
  # allowed in the metric names.
  config :decrement, :validate => :array, :default => []

  # A timing metric. `metric_name => duration` as hash. `%{fieldname}` substitutions
  # are allowed in the metric names.
  config :timing, :validate => :hash, :default => {}

  # A count metric. `metric_name => count` as hash. `%{fieldname}` substitutions are
  # allowed in the metric names.
  config :count, :validate => :hash, :default => {}

  # A set metric. `metric_name => "string"` to append as hash. `%{fieldname}`
  # substitutions are allowed in the metric names.
  config :set, :validate => :hash, :default => {}

  # A gauge metric. `metric_name => gauge` as hash. `%{fieldname}` substitutions are
  # allowed in the metric names.
  config :gauge, :validate => :hash, :default => {}

  # The sample rate for the metric.
  config :sample_rate, :validate => :number, :default => 1

  public
  def register
    require "statsd"
    @client = Statsd.new(@host, @port)
  end # def register

  public
  def receive(event)
    
    @client.namespace = event.sprintf(@namespace) if not @namespace.empty?
    @logger.debug? and @logger.debug("Original sender: #{@sender}")
    sender = event.sprintf(@sender)
    @logger.debug? and @logger.debug("Munged sender: #{sender}")
    @logger.debug? and @logger.debug("Event: #{event}")
    @increment.each do |metric|
      @client.increment(build_stat(event.sprintf(metric), sender), @sample_rate)
    end
    @decrement.each do |metric|
      @client.decrement(build_stat(event.sprintf(metric), sender), @sample_rate)
    end
    @count.each do |metric, val|
      @client.count(build_stat(event.sprintf(metric), sender),
                    event.sprintf(val), @sample_rate)
    end
    @timing.each do |metric, val|
      @client.timing(build_stat(event.sprintf(metric), sender),
                     event.sprintf(val), @sample_rate)
    end
    @set.each do |metric, val|
      @client.set(build_stat(event.sprintf(metric), sender),
                    event.sprintf(val), @sample_rate)
    end
    @gauge.each do |metric, val|
      @client.gauge(build_stat(event.sprintf(metric), sender),
                    event.sprintf(val), @sample_rate)
    end
  end # def receive

  def build_stat(metric, sender=@sender)
    sender = sender.to_s.gsub('::','.')
    sender.gsub!(RESERVED_CHARACTERS_REGEX, '_')
    sender.gsub!(".", "_")
    metric = metric.to_s.gsub('::','.')
    metric.gsub!(RESERVED_CHARACTERS_REGEX, '_')
    @logger.debug? and @logger.debug("Formatted value", :sender => sender, :metric => metric)
    return "#{sender}.#{metric}"
  end
end # class LogStash::Outputs::Statsd
