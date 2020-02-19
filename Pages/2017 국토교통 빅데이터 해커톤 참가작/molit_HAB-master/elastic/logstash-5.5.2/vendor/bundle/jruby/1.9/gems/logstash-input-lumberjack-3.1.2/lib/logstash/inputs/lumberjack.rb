# encoding: utf-8
require "logstash/inputs/base"
require "logstash/namespace"
require "logstash/codecs/identity_map_codec"

# Receive events using the Lumberjack protocol.
#
# This input can be used to reliably and securely transport
# events between Logstash instances. To do so, use the
# <<plugins-outputs-lumberjack,lumberjack output plugin>>
# in the sending Logstash instance(s).
#
# It can also be used to receive events from the deprecated
# https://github.com/elastic/logstash-forwarder[logstash-forwarder]
# tool that has been replaced by
# https://github.com/elastic/beats/tree/master/filebeat[Filebeat].
#
class LogStash::Inputs::Lumberjack < LogStash::Inputs::Base

  config_name "lumberjack"

  default :codec, "plain"

  # The IP address to listen on.
  config :host, :validate => :string, :default => "0.0.0.0"

  # The port to listen on.
  config :port, :validate => :number, :required => true

  # SSL certificate to use.
  config :ssl_certificate, :validate => :path, :required => true

  # SSL key to use.
  config :ssl_key, :validate => :path, :required => true

  # SSL key passphrase to use.
  config :ssl_key_passphrase, :validate => :password

  # The number of seconds before we raise a timeout,
  # this option is useful to control how much time to wait if something is blocking the pipeline.
  config :congestion_threshold, :validate => :number, :default => 5

  # TODO(sissel): Add CA to authenticate clients with.
  BUFFERED_QUEUE_SIZE = 1
  RECONNECT_BACKOFF_SLEEP = 0.5
  
  def register
    require "lumberjack/server"
    require "concurrent"
    require "logstash/circuit_breaker"
    require "logstash/sized_queue_timeout"

    @logger.info("Starting lumberjack input listener", :address => "#{@host}:#{@port}")
    @lumberjack = Lumberjack::Server.new(:address => @host, :port => @port,
      :ssl_certificate => @ssl_certificate, :ssl_key => @ssl_key,
      :ssl_key_passphrase => @ssl_key_passphrase)

    # Create a reusable threadpool, we do not limit the number of connections
    # to the input, the circuit breaker with the timeout should take care 
    # of `blocked` threads and prevent logstash to go oom.
    @threadpool = Concurrent::CachedThreadPool.new(:idletime => 15)

    # in 1.5 the main SizeQueue doesnt have the concept of timeout
    # We are using a small plugin buffer to move events to the internal queue
    @buffered_queue = LogStash::SizedQueueTimeout.new(BUFFERED_QUEUE_SIZE)

    @circuit_breaker = LogStash::CircuitBreaker.new("Lumberjack input",
                            :exceptions => [LogStash::SizedQueueTimeout::TimeoutError])

    @codec = LogStash::Codecs::IdentityMapCodec.new(@codec)
  end # def register

  def run(output_queue)
    @output_queue = output_queue
    start_buffer_broker

    @codec.eviction_block(method(:flush_event))

    # Accepting new events coming from LSF
    while !stop? do
      # Wrapping the accept call into a CircuitBreaker
      if @circuit_breaker.closed?
        connection = @lumberjack.accept # call that creates a new connection
        next if connection.nil? # if the connection is nil the connection was close.
        invoke(connection) do |event|
          if stop?
            connection.close
            break
          end

          @circuit_breaker.execute { @buffered_queue.push(event, @congestion_threshold) }
        end
      else
        @logger.warn("Lumberjack input: the pipeline is blocked, temporary refusing new connection.")
        sleep(RECONNECT_BACKOFF_SLEEP)
      end
    end
  end # def run

  public
  def stop
    @lumberjack.close
    @codec.flush { |event| flush_event(event) }
  end

  # I have created this method to make testing a lot easier,
  # mocking multiples levels of block is unfriendly especially with 
  # connection based block.
  public
  def create_event(fields, &block)
    line = fields.delete("line")

    @codec.decode(line, identity(fields)) do |event|
      decorate(event)
      fields.each do |k,v|
        v.force_encoding(Encoding::UTF_8)
        event.set(k,v)
      end
      block.call(event)
    end
  end

  private
  # It use the host and the file as the differentiator,
  # if anything is provided it should fallback to an empty string.
  def identity(fields)
    [fields["host"], fields["file"]].compact.join("-")
  end
  # There is a problem with the way the codecs work for this specific input,
  # when the data is decoded there is no way to attach metadata with the decoded line.
  # If you look at the block used by `@codec.decode`  it reference the fields variable
  # which is available when the proc is created, the problem is that variable with the data is 
  # not available at eviction time or when we force a flush on the codec before 
  # shutting down the input.
  #
  # Not defining the method will make logstash lose data, so Its still better to force a flush
  #
  # See this issue https://github.com/elastic/logstash/issues/4289 for more discussion
  def flush_event(event)
    decorate(event)
    @output_queue << event
  end

  private
  def invoke(connection, &block)
    @threadpool.post do
      begin
        # If any errors occur in from the events the connection should be closed in the 
        # library ensure block and the exception will be handled here
        connection.run do |fields|
          create_event(fields, &block)
        end

        # When too many errors happen inside the circuit breaker it will throw 
        # this exception and start refusing connection. The bubbling of theses
        # exceptions make sure that the lumberjack library will close the current 
        # connection which will force the client to reconnect and restransmit
        # his payload.
      rescue LogStash::CircuitBreaker::OpenBreaker,
        LogStash::CircuitBreaker::HalfOpenBreaker => e
        logger.warn("Lumberjack input: The circuit breaker has detected a slowdown or stall in the pipeline, the input is closing the current connection and rejecting new connection until the pipeline recover.", :exception => e.class)
      rescue => e # If we have a malformed packet we should handle that so the input doesn't crash completely.
        @logger.error("Lumberjack input: unhandled exception", :exception => e, :backtrace => e.backtrace)
      end
    end
  end

  def start_buffer_broker
    @threadpool.post do
      while !stop?
        @output_queue << @buffered_queue.pop_no_timeout
      end
    end
  end
end # class LogStash::Inputs::Lumberjack
