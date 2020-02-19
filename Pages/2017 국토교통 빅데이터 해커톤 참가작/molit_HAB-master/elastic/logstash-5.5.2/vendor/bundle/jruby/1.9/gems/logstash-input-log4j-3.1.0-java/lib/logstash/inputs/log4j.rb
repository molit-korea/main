# encoding: utf-8
require "logstash/inputs/base"
require "logstash/errors"
require "logstash/environment"
require "logstash/namespace"
require "logstash/util/socket_peer"
require "socket"
require "timeout"
require 'logstash-input-log4j_jars'

# ==== Deprecation Notice
#
# NOTE: This plugin is deprecated. It is recommended that you use filebeat to collect logs from log4j.
#
# The following section is a guide for how to migrate from SocketAppender to use filebeat.
#
# To migrate away from log4j SocketAppender to using filebeat, you will need to make 3 changes:
#
# 1) Configure your log4j.properties (in your app) to write to a local file.
# 2) Install and configure filebeat to collect those logs and ship them to Logstash
# 3) Configure Logstash to use the beats input.
#
# .Configuring log4j for writing to local files
# 
# In your log4j.properties file, remove SocketAppender and replace it with RollingFileAppender. 
#
# For example, you can use the following log4j.properties configuration to write daily log files.
#
#     # Your app's log4j.properties (log4j 1.2 only)
#     log4j.rootLogger=daily
#     log4j.appender.daily=org.apache.log4j.rolling.RollingFileAppender
#     log4j.appender.daily.RollingPolicy=org.apache.log4j.rolling.TimeBasedRollingPolicy
#     log4j.appender.daily.RollingPolicy.FileNamePattern=/var/log/your-app/app.%d.log
#     log4j.appender.daily.layout = org.apache.log4j.PatternLayout
#     log4j.appender.daily.layout.ConversionPattern=%d{YYYY-MM-dd HH:mm:ss,SSSZ} %p %c{1}:%L - %m%n
#
# Configuring log4j.properties in more detail is outside the scope of this migration guide.
#
# .Configuring filebeat
#
# Next,
# https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-installation.html[install
# filebeat]. Based on the above log4j.properties, we can use this filebeat
# configuration:
#
#     # filebeat.yml
#     filebeat:
#       prospectors:
#         -
#           paths:
#             - /var/log/your-app/app.*.log
#           input_type: log
#     output:
#       logstash:
#         hosts: ["your-logstash-host:5000"]
#
# For more details on configuring filebeat, see 
# https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-configuration.html[the filebeat configuration guide].
#
# .Configuring Logstash to receive from filebeat
#
# Finally, configure Logstash with a beats input:
#
#     # logstash configuration
#     input {
#       beats {
#         port => 5000
#       }
#     }
#
# It is strongly recommended that you also enable TLS in filebeat and logstash
# beats input for protection and safety of your log data..
#
# For more details on configuring the beats input, see
# https://www.elastic.co/guide/en/logstash/current/plugins-inputs-beats.html[the logstash beats input documentation].
#
# '''
#
# Read events over a TCP socket from a Log4j SocketAppender. This plugin works only with log4j version 1.x.
#
# Can either accept connections from clients or connect to a server,
# depending on `mode`. Depending on which `mode` is configured,
# you need a matching SocketAppender or a SocketHubAppender
# on the remote side.
#
# One event is created per received log4j LoggingEvent with the following schema:
#
# * `timestamp` => the number of milliseconds elapsed from 1/1/1970 until logging event was created.
# * `path` => the name of the logger
# * `priority` => the level of this event
# * `logger_name` => the name of the logger
# * `thread` => the thread name making the logging request
# * `class` => the fully qualified class name of the caller making the logging request.
# * `file` => the source file name and line number of the caller making the logging request in a colon-separated format "fileName:lineNumber".
# * `method` => the method name of the caller making the logging request.
# * `NDC` => the NDC string
# * `stack_trace` => the multi-line stack-trace
#
# Also if the original log4j LoggingEvent contains MDC hash entries, they will be merged in the event as fields.
class LogStash::Inputs::Log4j < LogStash::Inputs::Base

  config_name "log4j"

  # When mode is `server`, the address to listen on.
  # When mode is `client`, the address to connect to.
  config :host, :validate => :string, :default => "0.0.0.0"

  # When mode is `server`, the port to listen on.
  # When mode is `client`, the port to connect to.
  config :port, :validate => :number, :default => 4560

  # Proxy protocol support, only v1 is supported at this time
  # http://www.haproxy.org/download/1.5/doc/proxy-protocol.txt
  config :proxy_protocol, :validate => :boolean, :default => false

  # Mode to operate in. `server` listens for client connections,
  # `client` connects to a server.
  config :mode, :validate => ["server", "client"], :default => "server"

  def initialize(*args)
    super(*args)
  end # def initialize

  public
  def register
    begin
      Java::OrgApacheLog4jSpi.const_get("LoggingEvent")
    rescue
      raise(LogStash::PluginLoadingError, "Log4j java library not loaded")
    end

    @logger.warn("This plugin is deprecated. Please use filebeat instead to collect logs from log4j applications.")

    if server?
      @logger.info("Starting Log4j input listener", :address => "#{@host}:#{@port}")
      @server_socket = TCPServer.new(@host, @port)
    end
    @logger.info("Log4j input")
  end # def register

  public
  def create_event(log4j_obj)
    # NOTE: log4j_obj is org.apache.log4j.spi.LoggingEvent
    event = LogStash::Event.new("message" => log4j_obj.getRenderedMessage)
    event.set("timestamp", log4j_obj.getTimeStamp)
    event.set("path", log4j_obj.getLoggerName)
    event.set("priority", log4j_obj.getLevel.toString)
    event.set("logger_name", log4j_obj.getLoggerName)
    event.set("thread", log4j_obj.getThreadName)
    event.set("class", log4j_obj.getLocationInformation.getClassName)
    event.set("file", log4j_obj.getLocationInformation.getFileName + ":" + log4j_obj.getLocationInformation.getLineNumber)
    event.set("method", log4j_obj.getLocationInformation.getMethodName)
    event.set("NDC", log4j_obj.getNDC) if log4j_obj.getNDC
    event.set("stack_trace", log4j_obj.getThrowableStrRep.to_a.join("\n")) if log4j_obj.getThrowableInformation

    # Add the MDC context properties to event
    if log4j_obj.getProperties
      log4j_obj.getPropertyKeySet.each do |key|
        event.set(key, log4j_obj.getProperty(key))
      end
    end
    return event
  end # def create_event

  private
  def handle_socket(socket, output_queue)
    begin
      peer = socket.peer
      if @proxy_protocol
        pp_hdr = socket.readline
        pp_info = pp_hdr.split(/\s/)

        # PROXY proto clientip proxyip clientport proxyport
        if pp_info[0] != "PROXY"
          @logger.error("invalid proxy protocol header label", :hdr => pp_hdr)
          return
        else
          # would be nice to log the proxy host and port data as well, but minimizing changes
          peer = pp_info[2]
        end
      end
      ois = socket_to_inputstream(socket)

      while !stop?
        event = create_event(ois.readObject)
        event.set("host", peer)
        decorate(event)
        output_queue << event
      end # loop do
    rescue => e
      @logger.debug? && @logger.debug("Closing connection", :client => socket.peer,
                    :exception => e)
    rescue Timeout::Error
      @logger.debug? && @logger.debug("Closing connection after read timeout",
                    :client => socket.peer)
    end # begin
  ensure
    begin
      socket.close
    rescue IOError
      pass
    end # begin
  end

  private
  def socket_to_inputstream(socket)
     Log4jInputStream.new(java.io.BufferedInputStream.new(socket.to_inputstream))
  end

  private
  def server?
    @mode == "server"
  end # def server?

  private
  def readline(socket)
    line = socket.readline
  end # def readline

  public
  # method used to stop the plugin and unblock
  # pending blocking operatings like sockets and others.
  def stop
    begin
      @server_socket.close if @server_socket && !@server_socket.closed?
    rescue IOError
    end
  end

  public
  def run(output_queue)
    if server?
      while !stop?
        Thread.start(@server_socket.accept) do |s|
          add_socket_mixin(s)
          @logger.debug? && @logger.debug("Accepted connection", :client => s.peer,
                        :server => "#{@host}:#{@port}")
          handle_socket(s, output_queue)
        end # Thread.start
      end # loop
    else
      while !stop?
        client_socket = build_client_socket
        @logger.debug? && @logger.debug("Opened connection", :client => "#{client_socket.peer}")
        handle_socket(client_socket, output_queue)
      end # loop
    end
  rescue IOError
  end # def run

  def build_client_socket
    s = TCPSocket.new(@host, @port)
    add_socket_mixin(s)
    s
  end

  def add_socket_mixin(socket)
    socket.instance_eval { class << self; include ::LogStash::Util::SocketPeer end }
  end

  class Log4jInputStream < java.io.ObjectInputStream
    ALLOWED_CLASSES = ["org.apache.log4j.spi.LoggingEvent"]

    def initialize(*args)
      super
      @class_loader = org.jruby.Ruby.getGlobalRuntime.getJRubyClassLoader 
    end

    def safety_check(name)
      raise java.io.InvalidObjectException.new("Object type #{name} is not allowed.") if !ALLOWED_CLASSES.include?(name)
    end

    def resolveClass(desc)
      name = desc.getName
      safety_check(name)
      java.lang.Class.forName(name, false, @class_loader)
    end
  end
end # class LogStash::Inputs::Log4j
