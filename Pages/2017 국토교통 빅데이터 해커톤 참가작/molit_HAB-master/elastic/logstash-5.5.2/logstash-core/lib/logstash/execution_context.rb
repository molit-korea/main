# encoding: utf-8
require "logstash/util/dead_letter_queue_manager"
module LogStash
  class ExecutionContext
    attr_reader :pipeline, :dlq_writer

    def initialize(pipeline, plugin_id, plugin_type, dlq_writer)
      @pipeline = pipeline
      @plugin_id = plugin_id
      @plugin_type = plugin_type
      @dlq_writer = LogStash::Util::PluginDeadLetterQueueWriter.new(dlq_writer, @plugin_id, @plugin_type)
    end

    def pipeline_id
      @pipeline.pipeline_id
    end
  end
end
